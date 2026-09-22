import assert from 'node:assert/strict'
import {readFileSync, readdirSync} from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import vm from 'node:vm'
import ts from 'typescript'
import axios from 'axios'
import * as jsx from 'react/jsx-runtime'

// 只執行原始碼與合成傳輸，不讀環境檔、不啟動網路或使用真實帳號。
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = (file) => readFileSync(path.join(root, file), 'utf8')
const cases = []
const check = (name, run) => cases.push({name, run})
const settle = () => new Promise(resolve => setImmediate(resolve))
const guest = {id: 0, auth: '0000000000000000', name: '訪客', email: '', wait_accredit: 0, ai_point: 0}
const member = {...guest, id: 7, email: 'fixture@example.invalid', name: '測試會員', expiry_days: -2}
const pair = {access: 'synthetic-access', refresh: 'synthetic-refresh'}

function harness({env = {DEV: false}, transport, authenticated = false, userInfo = guest} = {}) {
  const storage = new Map()
  const cache = new Map()
  const requests = []
  const errors = []
  const notices = []
  const fieldErrors = []
  const states = []
  const effects = []
  let cursor = 0
  let reloads = 0
  const localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: key => storage.delete(key),
  }
  const adapter = async config => {
    requests.push(config)
    if (!transport) throw new Error('禁止未指定的傳輸')
    const result = await transport(config, requests)
    const response = {config, headers: {}, statusText: '', status: result.status ?? 200, data: result.data}
    if (response.status >= 400) throw new axios.AxiosError('合成 HTTP 錯誤', undefined, config, undefined, response)
    return response
  }
  const fakeAxios = Object.assign(axios.create({adapter}), axios, {
    create: config => axios.create({...config, adapter}),
    post: (url, data) => axios.create({adapter}).post(url, data),
  })
  // Object.assign 不替代呼叫本體，其底層 instance 仍固定使用合成 adapter。
  const toast = Object.assign(value => notices.push(value), {
    error: value => errors.push(value),
    dismiss: () => {},
    promise: async (value, options) => {
      try { return await (typeof value === 'function' ? value() : value) }
      catch (error) { toast.error(typeof options.error === 'function' ? options.error(error) : options.error); throw error }
    },
  })
  const react = {
    createContext: value => ({Provider: 'Provider', initial: value}),
    useState: initial => {
      const index = cursor++
      if (!(index in states)) states[index] = typeof initial === 'function' ? initial() : initial
      return [states[index], value => { states[index] = typeof value === 'function' ? value(states[index]) : value }]
    },
    useEffect: fn => effects.push(fn),
    useMemo: fn => fn(),
    useCallback: fn => fn,
    useRef: value => ({current: value}),
  }
  const auth = {isAuthenticated: authenticated, userInfo, onReload: () => { reloads += 1 }}
  const component = Object.fromEntries(['Button', 'Dropdown', 'DropdownContent', 'DropdownToggle', 'Alert', 'Col', 'Row', 'Badge'].map(name => [name, name]))
  const mocks = {
    react, 'react/jsx-runtime': jsx, axios: fakeAxios, 'react-hot-toast': toast,
    'react-router': {Link: 'Link'},
    'react-icons/io5': {IoWarningOutline: 'IoWarningOutline'},
    'react-hook-form': {useForm: () => ({register: () => ({}), handleSubmit: fn => fn, watch: () => [member.email], setError: (...args) => fieldErrors.push(args), formState: {errors: {}}})},
    '@/component': component,
    '@/features': {ErrorAlert: 'ErrorAlert', Login: 'Login', ModalLogin: 'ModalLogin'},
    '@/hooks': {useAuth: () => auth, useAxios: () => load('src/hooks/useAxios.ts').default()},
  }
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports
    const module = {exports: {}}
    cache.set(file, module)
    const require = name => {
      if (Object.hasOwn(mocks, name)) return mocks[name]
      if (name === '@/func') return {
        showToast: load('src/func/toast.ts').default,
        showFormError: load('src/func/form.ts').default,
        getUserFacingErrorMessage: load('src/func/api-error.ts').getUserFacingErrorMessage,
        showUserFacingError: error => toast.error(load('src/func/api-error.ts').getUserFacingErrorMessage(error)),
      }
      if (name.endsWith('/BtnEmailCode.tsx')) return {__esModule: true, default: 'BtnEmailCode'}
      if (name.startsWith('@/')) return load('src/' + name.slice(2))
      if (name.startsWith('.')) return load(path.posix.normalize(path.posix.join(path.posix.dirname(file), name)))
      throw new Error(`未允許的模組：${name}`)
    }
    const code = ts.transpileModule(source(file).replaceAll('import.meta.env', JSON.stringify(env)), {
      fileName: file,
      compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
    }).outputText
    vm.runInNewContext(code, {module, exports: module.exports, require, localStorage, URL, console: {error: () => {}}, setTimeout, clearTimeout}, {filename: file})
    return module.exports
  }
  return {load, requests, errors, notices, fieldErrors, states, effects, auth, localStorage,
    render: (fn, props = {}) => { cursor = 0; return fn(props) },
    get reloads() { return reloads },
  }
}

function nodes(node) {
  if (Array.isArray(node)) return node.flatMap(nodes)
  if (!node || typeof node !== 'object') return []
  return [node, ...nodes(node.props?.children)]
}
function assertHandLink(node, href) {
  assert.ok(node, `缺少跨站連結：${href}`)
  assert.equal(node.type, 'a')
  assert.equal(node.props.href, href)
  assert.equal(node.props.target, '_blank')
  assert.equal(node.props.rel, 'noopener noreferrer')
  assert.equal(new URL(node.props.href).search, '')
  assert.equal(new URL(node.props.href).hash, '')
}

for (const [label, env, origin] of [
  ['開發預設埠', {DEV: true}, 'http://localhost:8000'],
  ['開發自訂埠', {DEV: true, VITE_API_PORT: '8123'}, 'http://localhost:8123'],
  ['正式忽略開發埠', {DEV: false, VITE_API_PORT: '8123'}, 'https://api.pigeonhand.tw'],
]) check(label, () => {
  const config = harness({env}).load('src/lib/config.ts')
  assert.equal(config.ROOT_IP, origin)
  for (const [key, suffix] of Object.entries({MEDIA_IP: '', WEB_API: '/web', USER_API: '/user', V3_API: '/v3', V3_USER_API: '/v3/user', POLICE_API: '/police', EXAM_API: '/exam', EXAM_API_V2: '/v2/exam', AI_API_V2: '/v2/ai'})) assert.equal(config[key], origin + suffix)
  assert.equal(config.HAND_SIGNUP_URL, 'https://pigeonhand.tw/signup')
  assert.equal(config.HAND_ACCREDIT_URL, 'https://pigeonhand.tw/user/accredit')
})

// 使用真正的共用請求與 Axios 組合網址，只替換傳輸，避免相對路徑測試掩蓋基底錯誤。
for (const [label, env, origin] of [
  ['開發預設埠', {DEV: true}, 'http://localhost:8000'],
  ['開發自訂埠', {DEV: true, VITE_API_PORT: '8123'}, 'http://localhost:8123'],
  ['正式設定', {DEV: false, VITE_API_PORT: '8123'}, 'https://api.pigeonhand.tw'],
]) {
  for (const questionType of ['select', 'essay']) {
    for (const action of ['create', 'edit', 'retry']) check(`${label} ${questionType} ${action} 最終關聯網址`, async () => {
      const h = harness({env, transport: () => ({data: {id: 45}})})
      h.load('src/auth/handleUser.ts').saveTokens(pair)
      const api = h.load('src/hooks/useAxios.ts').default()
      const config = h.load('src/lib/config.ts')
      const {saveQuestionAndReferences} = h.load('src/features/Link/ArticleLink/lawReferenceController.ts')
      const questionUrl = `${config.EXAM_API}/${questionType}_questions/${action === 'create' ? '' : '45/'}`
      const result = await saveQuestionAndReferences({
        questionType, questionUrl, questionMethod: action === 'create' ? 'POST' : 'PATCH',
        questionPayload: {question: '測試題目'}, referenceItems: [{provision_id: 9}],
        ...(action === 'retry' ? {retryQuestionId: 45} : {}),
        request: config => api(config),
      })
      assert.equal(result.kind, 'saved')
      assert.equal(h.requests.length, action === 'retry' ? 1 : 2)
      if (action !== 'retry') {
        assert.equal(axios.getUri(h.requests[0]), questionUrl)
        assert.equal(h.requests[0].method, action === 'create' ? 'post' : 'patch')
      }
      const last = h.requests.at(-1)
      assert.equal(last.method, 'put')
      assert.equal(axios.getUri(last), `${origin}/v3/exam/questions/${questionType}/45/law-references`)
      assert.deepEqual(JSON.parse(last.data), {items: [{provision_id: 9}]})
      assert.ok(h.requests.every(request => request.headers.get('Authorization') === 'Bearer synthetic-access'))
    })
  }
  check(`${label} 領域完整網址與根路徑相容`, async () => {
    const h = harness({env, transport: () => ({data: {}})})
    const config = h.load('src/lib/config.ts')
    const api = h.load('src/hooks/useAxios.ts').default()
    for (const [key, suffix] of Object.entries({WEB_API: '/web', USER_API: '/user', V3_API: '/v3', V3_USER_API: '/v3/user', V3_EXAM_API: '/v3/exam', POLICE_API: '/police', EXAM_API: '/exam', EXAM_API_V2: '/v2/exam', AI_API_V2: '/v2/ai'})) {
      assert.equal(config[key], origin + suffix)
      for (const url of [config[key] + '/fixture', suffix + '/fixture']) {
        await api.get(url, {params: {page: 2}})
        assert.equal(axios.getUri(h.requests.at(-1)), `${origin}${suffix}/fixture?page=2`)
      }
    }
  })
  check(`${label} 根路徑在認證更新後重送不變`, async () => {
    const h = harness({env, transport: config => config.url.endsWith('/token/refresh')
      ? {data: {...pair, access: 'synthetic-new'}}
      : {status: config._retry ? 200 : 401, data: {items: []}}})
    h.load('src/auth/handleUser.ts').saveTokens(pair)
    const api = h.load('src/hooks/useAxios.ts').default()
    await api.put('/v3/exam/questions/select/45/law-references', {items: []})
    assert.deepEqual(h.requests.map(request => axios.getUri(request)), [
      `${origin}/v3/exam/questions/select/45/law-references`,
      `${origin}/v3/user/token/refresh`,
      `${origin}/v3/exam/questions/select/45/law-references`,
    ])
    assert.equal(h.requests[2].headers.get('Authorization'), 'Bearer synthetic-new')
  })
  check(`${label} 檔案網址保持同源且不混入會員前綴`, async () => {
    const h = harness({env, transport: () => ({data: '合成檔案'})})
    const api = h.load('src/hooks/useAxios.ts').default()
    const {fetchHappyWorkFileBlob} = h.load('src/features/FilePreview/api/fetchHappyWorkFileBlob.ts')
    for (const url of ['/v3/happywork/files/45/download', `${origin}/v3/happywork/files/45/download`]) {
      await fetchHappyWorkFileBlob(api, url)
      assert.equal(axios.getUri(h.requests.at(-1)), `${origin}/v3/happywork/files/45/download`)
    }
    const before = h.requests.length
    for (const url of ['https://outside.example.invalid/file', '//outside.example.invalid/file', 'relative/file']) {
      await assert.rejects(fetchHappyWorkFileBlob(api, url), /檔案網址/)
    }
    assert.equal(h.requests.length, before, '不允許的檔案網址不得送出請求')
  })
}

for (const kind of ['Password', 'Email']) {
  for (const status of [200, 429, 500, 'network']) check(`${kind} 登入 ${status}`, async () => {
    const h = harness({transport: () => {
      if (status === 'network') throw new Error('合成斷線')
      return {status, data: status === 200 ? pair : {}}
    }})
    const component = h.load(`src/features/User/Login/${kind}Form.tsx`).default
    let form = h.render(component)
    if (kind === 'Email') {
      nodes(form).find(n => n.type === 'BtnEmailCode').props.setIsUser(true)
      form = h.render(component)
    }
    form.props.onSubmit(kind === 'Password' ? {email: member.email, password: 'synthetic-password'} : {email: member.email, code: 'synthetic-code'})
    await settle()
    assert.equal(h.requests.length, 1)
    assert.equal(h.requests[0].url, `https://api.pigeonhand.tw/v3/user/login/${kind.toLowerCase()}`)
    assert.equal(h.reloads, status === 200 ? 1 : 0)
    assert.equal(h.localStorage.getItem('ph_tokens') !== null, status === 200)
    if (status === 429) assert.ok(h.errors.includes('請稍後再試'))
    if (status === 500) assert.ok(h.errors.includes('伺服器臨時維護中，請稍後再試'))
    if (status === 'network') assert.ok(h.errors.includes('登入失敗，請稍後再試。'))
  })
}
check('未取得驗證碼不送登入', () => {
  const h = harness()
  h.render(h.load('src/features/User/Login/EmailForm.tsx').default).props.onSubmit({})
  assert.equal(h.requests.length, 0)
  assert.equal(h.fieldErrors[0][0], 'code')
})
check('畸形登入回應不保存憑證', async () => {
  const h = harness({transport: () => ({data: {access: ''}})})
  await assert.rejects(h.load('src/auth/handleUser.ts').handleLogin({}), /auth_response_invalid/)
  assert.equal(h.localStorage.getItem('ph_tokens'), null)
})

for (const mode of ['success', 'second401', 'refreshFailure', 'skip', 'non401', 'network', 'parallel']) check(`憑證更新 ${mode}`, async () => {
  let refreshCalls = 0
  const h = harness({transport: config => {
    if (config.url.endsWith('/token/refresh')) {
      refreshCalls += 1
      return {status: mode === 'refreshFailure' ? 401 : 200, data: {...pair, access: 'synthetic-new'}}
    }
    if (mode === 'network') throw new Error('合成斷線')
    return {status: mode === 'non401' ? 403 : config._retry && mode !== 'second401' ? 200 : 401, data: {ok: true}}
  }})
  h.load('src/auth/handleUser.ts').saveTokens(pair)
  const api = h.load('src/hooks/useAxios.ts').default()
  const request = () => api({method: 'GET', url: '/fixture', skipAuthReplay: mode === 'skip'})
  if (mode === 'success' || mode === 'parallel') {
    const results = await Promise.all(Array.from({length: mode === 'parallel' ? 2 : 1}, request))
    assert.ok(results.every(r => r.status === 200))
    assert.ok(h.requests.filter(r => r._retry).every(r => r.headers.get('Authorization') === 'Bearer synthetic-new'))
  } else await assert.rejects(request())
  assert.equal(refreshCalls, ['skip', 'non401', 'network'].includes(mode) ? 0 : 1)
  const originals = h.requests.filter(r => r.url === '/fixture')
  assert.equal(originals.length, mode === 'parallel' ? 4 : ['success', 'second401'].includes(mode) ? 2 : 1)
  if (mode === 'refreshFailure') {
    assert.equal(h.localStorage.getItem('ph_tokens'), null)
    assert.equal(h.errors.length, 1)
  }
})

for (const status of [200, 500]) check(`登出清除與重新驗證 ${status}`, async () => {
  const h = harness({authenticated: true, userInfo: member, transport: config => {
    assert.equal(h.localStorage.getItem('ph_tokens'), null)
    assert.equal(config.url, 'https://api.pigeonhand.tw/v3/user/logout')
    assert.deepEqual(JSON.parse(config.data), {refresh: pair.refresh})
    return {status, data: {logged_out: true}}
  }})
  h.load('src/auth/handleUser.ts').saveTokens(pair)
  const tree = h.render(h.load('src/features/User/UserProfile/MenuUser.tsx').default)
  nodes(tree).find(n => n.type === 'button').props.onClick()
  await settle()
  assert.equal(h.localStorage.getItem('ph_tokens'), null)
  assert.equal(h.reloads, 1)
  assert.equal(h.requests.length, 1)
})

check('會員驗證與到期通知使用 Hand 認證連結', async () => {
  const h = harness({transport: config => {
    assert.equal(config.url, 'https://api.pigeonhand.tw/v3/user/token/verify')
    return {data: member}
  }})
  h.load('src/auth/handleUser.ts').saveTokens(pair)
  const Provider = h.load('src/auth/AuthContext.tsx').AuthProvider
  h.render(Provider, {children: 'protected'})
  h.effects.splice(0).forEach(fn => fn())
  await settle()
  const tree = h.render(Provider, {children: 'protected'})
  assert.equal(tree.props.value.isAuthenticated, true)
  assert.equal(tree.props.value.userInfo.id, member.id)
  assert.equal(tree.props.children, 'protected')
  const notice = h.notices[0]({id: 'fixture'})
  assertHandLink(nodes(notice).find(n => n.type === 'a'), 'https://pigeonhand.tw/user/accredit')
})
check('會員驗證失敗清除憑證並返回訪客', async () => {
  const h = harness({transport: () => ({data: {}})})
  h.load('src/auth/handleUser.ts').saveTokens(pair)
  const Provider = h.load('src/auth/AuthContext.tsx').AuthProvider
  h.render(Provider)
  h.effects.splice(0).forEach(fn => fn())
  await settle()
  const tree = h.render(Provider)
  assert.equal(tree.props.value.isAuthenticated, false)
  assert.equal(tree.props.value.userInfo.id, 0)
  assert.equal(h.localStorage.getItem('ph_tokens'), null)
})
check('註冊與會員選單導回 Hand，訪客仍有登入入口', () => {
  const h = harness()
  const login = h.render(h.load('src/features/User/Login/Login.tsx').default)
  assertHandLink(nodes(login).find(n => n.type === 'a'), 'https://pigeonhand.tw/signup')
  const Menu = h.load('src/features/User/UserProfile/MenuUser.tsx').default
  assert.equal(h.render(Menu).type, 'ModalLogin')
  h.auth.isAuthenticated = true
  const tree = h.render(Menu)
  assertHandLink(nodes(tree).find(n => n.type === 'a'), 'https://pigeonhand.tw/user/accredit')
  assert.ok(nodes(tree).some(n => n.type === 'Link' && n.props.to === '/user/profile'))
})
for (const errorType of ['noAcc', 'loggedIn']) check(`${errorType} 提示導回 Hand`, () => {
  const h = harness()
  const tree = h.render(h.load('src/features/Layout/ErrorAlert.tsx').default, {errorType})
  assertHandLink(nodes(tree).find(n => n.type === 'a'), 'https://pigeonhand.tw/user/accredit')
})

const shared = ['auth/AuthLayout.tsx', 'auth/AuthComponent.tsx', 'auth/handleHasAuth.ts', 'auth/authContract.ts', 'auth/refreshCoordinator.ts', 'auth/AuthShow.tsx', 'types/auth-types.ts', 'features/User/UserProfile/BadgeAccredit.tsx']
check('既有共用權限來源與 Hand 相同', () => {
  for (const file of shared) assert.equal(source('src/' + file).trim(), readFileSync(path.join(root, '../pigeon-hand/src', file), 'utf8').trim(), file)
})
check('訪客／會員路由與指定權限行為保持', () => {
  const h = harness()
  const Layout = h.load('src/auth/AuthLayout.tsx').default
  const Component = h.load('src/auth/AuthComponent.tsx').default
  const has = h.load('src/auth/handleHasAuth.ts').handleHasAuth
  const {AUTH_CHECK} = h.load('src/types/auth-types.ts')
  assert.equal(h.render(Layout, {children: 'private'}).props.errorType, 'noLogin')
  h.auth.isAuthenticated = true
  assert.equal(h.render(Layout, {children: 'private'}).props.children, 'private')
  for (const [type, position] of Object.entries(AUTH_CHECK)) {
    if (type === 'L') continue
    h.auth.userInfo = {...member, auth: guest.auth}
    assert.equal(has(guest.auth, type), false)
    assert.equal(h.render(Component, {authType: type, children: 'private', errorContent: 'denied'}).props.children, 'denied')
    assert.equal(h.render(Layout, {authType: type}).props.errorType, ['C', 'T', 'S'].includes(type) ? 'noAcc' : 'noAuth')
    const auth = guest.auth.split(''); auth[position - 1] = '1'
    h.auth.userInfo = {...member, auth: auth.join('')}
    assert.equal(has(auth.join(''), type), true)
    assert.equal(h.render(Layout, {authType: type, children: 'private'}).props.children, 'private')
  }
})
check('所有來源無失效站內認證連結或新增表單路由', () => {
  function walk(dir) {
    for (const entry of readdirSync(path.join(root, dir), {withFileTypes: true})) {
      const file = path.posix.join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (/\.(ts|tsx)$/.test(file)) assert.equal(/(?:to|href)\s*=\s*["']\/user\/accredit["']/.test(source(file)), false, `${file} 不得保留失效站內認證連結`)
    }
  }
  walk('src')
  assert.doesNotMatch(source('src/routes/routes.tsx'), /path:\s*['"](?:signup|accredit)['"]|SignUp|<Accredit/)
})

let failed = 0
const unhandled = []
const onUnhandled = error => unhandled.push(error)
process.on('unhandledRejection', onUnhandled)
for (const {name, run} of cases) {
  try {
    await run()
    await settle()
    assert.equal(unhandled.length, 0, '不得產生未處理的非同步例外')
    console.log(`通過：${name}`)
  }
  catch (error) { failed += 1; console.error(`失敗：${name}\n${error.stack}`) }
  finally { unhandled.length = 0 }
}
process.off('unhandledRejection', onUnhandled)
console.log(`總計 ${cases.length} 項；失敗 ${failed} 項（僅離線合成驗證）`)
if (failed) process.exitCode = 1
