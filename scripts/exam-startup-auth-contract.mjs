import assert from 'node:assert/strict'
import {test} from 'node:test'
import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {runInNewContext} from 'node:vm'
import ts from 'typescript'
import * as React from 'react'
import * as jsx from 'react/jsx-runtime'
import {renderToStaticMarkup} from 'react-dom/server'
import axios, {AxiosError, AxiosHeaders} from 'axios'
import {createRefreshCoordinator} from '../src/auth/refreshCoordinator.ts'

const root = resolve(import.meta.dirname, '..')
function load(file, imports) {
  const exports = {}
  const code = ts.transpileModule(readFileSync(resolve(root, file), 'utf8'), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX},
  }).outputText
  runInNewContext(code, {exports, AbortController, console, require(name) {
    assert.ok(name in imports, `未宣告依賴：${name}`)
    return imports[name]
  }})
  return exports
}
const config = {ROOT_IP: 'https://synthetic.invalid', USER_API: 'https://synthetic.invalid/user', V3_USER_API: 'https://synthetic.invalid/v3/user', HAND_ACCREDIT_URL: 'https://pigeonhand.tw/user/accredit'}
const contract = load('src/auth/authContract.ts', {'@/lib/config.ts': config})
const guest = {id: 0, auth: '0000000000000000'}
function authView(file, state) {
  return load(file, {
    react: React, 'react/jsx-runtime': jsx,
    './handleHasAuth.ts': {handleHasAuth: (_auth, type) => type === 'L'},
    '@/hooks': {useAuth: () => state},
    '@/features': {ErrorAlert: () => React.createElement('span', null, '拒絕存取')},
    '@/component/Loading/Loading.tsx': {__esModule: true, default: () => React.createElement('span', null, '載入中')},
  }).default
}

test('公開內容在 React 首次呈現時不被全域驗證隱藏', () => {
  const module = load('src/auth/AuthContext.tsx', {
    react: React, 'react/jsx-runtime': jsx,
    'react-hot-toast': {default: () => {}},
    '@/lib/config.ts': config,
    '@/hooks': {useAxios: () => () => {}},
    '@/auth/handleUser.ts': {loadTokens: () => null, clearTokens: () => {}},
    '@/component': {Button: 'button'},
    '@/auth/authContract.ts': contract,
  })
  assert.match(renderToStaticMarkup(React.createElement(module.AuthProvider, null, '公開首頁')), /公開首頁/)
})

test('受保護元件在驗證中不得顯示內容或未登入結論', () => {
  const Layout = authView('src/auth/AuthLayout.tsx', {isLoading: true, isAuthenticated: false, userInfo: guest})
  const Component = authView('src/auth/AuthComponent.tsx', {isLoading: true, isAuthenticated: true, userInfo: guest})
  const layout = renderToStaticMarkup(React.createElement(Layout, null, '受保護內容'))
  assert.doesNotMatch(layout, /受保護內容|拒絕存取/)
  assert.match(layout, /載入中|驗證中/)
  assert.doesNotMatch(renderToStaticMarkup(React.createElement(Component, null, '受保護內容')), /受保護內容/)
})

function transport({holdRefresh = false, holdRequest = false} = {}) {
  let tokens = {access: 'synthetic-old', refresh: 'synthetic-refresh'}
  let release
  const held = new Promise(resolve => { release = resolve })
  let releaseRequest
  const heldRequest = new Promise(resolve => { releaseRequest = resolve })
  const calls = []
  let saved = 0
  let cleared = 0
  const adapter = async cfg => {
    calls.push(cfg)
    if (cfg.url === contract.V3_AUTH_ENDPOINTS.refresh) {
      if (JSON.parse(cfg.data).refresh === 'synthetic-other-refresh') return {status: 200, data: {access: 'synthetic-other-new', refresh: 'synthetic-other-next'}, config: cfg, headers: {}}
      if (holdRefresh) await held
      return {status: 200, data: {access: 'synthetic-new', refresh: 'synthetic-next'}, config: cfg, headers: {}}
    }
    if (holdRequest && cfg.url === '/delayed' && !cfg._retry) await heldRequest
    if (!['Bearer synthetic-new', 'Bearer synthetic-other-new'].includes(cfg.headers.get('Authorization'))) throw new AxiosError('合成 401', 'ERR_BAD_REQUEST', cfg, null, {status: 401, data: {}, config: cfg, headers: {}})
    return {status: 200, data: {}, config: cfg, headers: {}}
  }
  const raw = axios.create({adapter})
  const facade = {create: options => axios.create({...options, adapter}), post: (...args) => raw.post(...args)}
  const api = load('src/hooks/useAxios.ts', {
    axios: {__esModule: true, default: facade, AxiosHeaders, CanceledError: axios.CanceledError},
    '@/lib/config.ts': config,
    'react-hot-toast': {__esModule: true, default: {error: () => {}}},
    '@/auth/handleUser.ts': {loadTokens: () => tokens, saveTokens: value => { saved++; tokens = value }, clearTokens: () => { cleared++; tokens = null }},
    '@/auth/authContract.ts': contract,
    '@/auth/refreshCoordinator.ts': {createRefreshCoordinator},
  }).default()
  return {api, calls, release, releaseRequest, replace: value => { tokens = value }, counts: () => ({saved, cleared}), getTokens: () => tokens}
}

test('更新憑證有 10 秒上限，ROOT_IP 業務請求不被套用此上限', async () => {
  const t = transport()
  await t.api.get('/protected')
  assert.equal(t.calls.find(call => call.url === contract.V3_AUTH_ENDPOINTS.refresh).timeout, 10000)
  assert.equal(t.calls[0].timeout, 0)
})

test('登出或換身分時，舊更新晚到不得覆蓋或重送', async () => {
  for (const replacement of [null, {access: 'synthetic-other', refresh: 'synthetic-other-refresh'}]) {
    const t = transport({holdRefresh: true})
    const pending = t.api.get('/protected')
    while (!t.calls.some(call => call.url === contract.V3_AUTH_ENDPOINTS.refresh)) await new Promise(resolve => setImmediate(resolve))
    t.replace(replacement)
    t.release()
    await assert.rejects(pending)
    assert.equal(t.counts().saved, 0)
    assert.equal(t.counts().cleared, 0)
    assert.deepEqual(t.getTokens(), replacement)
    assert.equal(t.calls.length, 2)
  }
})

test('同身分錯開的 401 可單次重送；跨身分不得共用更新', async () => {
  const same = transport({holdRequest: true})
  const delayed = same.api.get('/delayed')
  while (!same.calls.some(call => call.url === '/delayed')) await new Promise(resolve => setImmediate(resolve))
  await same.api.get('/protected')
  same.releaseRequest()
  await delayed
  assert.equal(same.counts().saved, 1)
  assert.equal(same.calls.filter(call => call.url === '/delayed').length, 2)

  const cross = transport({holdRefresh: true})
  const old = cross.api.get('/protected').then(() => 'unexpected', () => 'rejected')
  while (!cross.calls.some(call => call.url === contract.V3_AUTH_ENDPOINTS.refresh)) await new Promise(resolve => setImmediate(resolve))
  cross.replace({access: 'synthetic-other', refresh: 'synthetic-other-refresh'})
  const next = cross.api.get('/protected')
  await new Promise(resolve => setImmediate(resolve))
  cross.release()
  await next
  assert.equal(await old, 'rejected')
  assert.deepEqual(cross.getTokens(), {access: 'synthetic-other-new', refresh: 'synthetic-other-next'})
  assert.equal(cross.counts().cleared, 0)
})
