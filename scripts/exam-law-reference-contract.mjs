import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {readFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, resolve} from 'node:path'
import {runInNewContext} from 'node:vm'
import ts from 'typescript'

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const controllerPath = resolve(repo, 'src/features/Link/ArticleLink/lawReferenceController.ts')
const controller = await import(`${controllerPath}?contract=${Date.now()}`)
const pickerApiPath = resolve(repo, 'src/features/Link/ArticleLink/lawPickerApi.ts')
const pickerApi = await import(`${pickerApiPath}?contract=${Date.now()}`)

const requestLog = []
const request = async (config) => {
  requestLog.push(config)
  if (config.method === 'POST') return {data: {id: 37}}
  return {data: {items: []}}
}

assert.deepEqual(
  controller.buildQuestionPayload({question: '題目', article_link: [['刑法', '第 1 條']], file_link: []}),
  {question: '題目', file_link: []},
  '題目 payload 必須明確排除 article_link',
)
assert.equal(controller.examLawReferencesUrl('select', 37), '/v3/exam/questions/select/37/law-references')
assert.equal(controller.examLawReferencesUrl('essay', 18), '/v3/exam/questions/essay/18/law-references')
assert.deepEqual(controller.referenceItemsForPut([
  {kind: 'existing', reference: {id: 12, target_provision: {id: 9}}},
  {kind: 'provision', provision: {id: 9}},
  {kind: 'provision', provision: {id: 10}},
]), [
  {reference_link_id: 12},
  {provision_id: 10},
], '既有關聯與新選條文必須以 provision id 跨型別去重')

const createResult = await controller.saveQuestionAndReferences({
  questionType: 'select',
  questionUrl: '/exam/select_questions/',
  questionMethod: 'POST',
  questionPayload: {question: '題目', article_link: [['刑法', '第 1 條']]},
  referenceItems: [{provision_id: 9}],
  request,
})
assert.deepEqual(createResult, {kind: 'saved', questionId: 37})
assert.deepEqual(requestLog, [
  {method: 'POST', url: '/exam/select_questions/', data: {question: '題目'}},
  {method: 'PUT', url: '/v3/exam/questions/select/37/law-references', data: {items: [{provision_id: 9}]}},
], '新增題目成功後才保存 V3 關聯')

const retryLog = []
const retryResult = await controller.saveQuestionAndReferences({
  questionType: 'essay',
  questionUrl: '/exam/essay_questions/44/',
  questionMethod: 'PATCH',
  questionPayload: {question: '不應重送'},
  referenceItems: [{reference_link_id: 12}],
  retryQuestionId: 44,
  request: async (config) => {
    retryLog.push(config)
    return {data: {items: []}}
  },
})
assert.deepEqual(retryResult, {kind: 'saved', questionId: 44})
assert.deepEqual(retryLog, [
  {method: 'PUT', url: '/v3/exam/questions/essay/44/law-references', data: {items: [{reference_link_id: 12}]}},
], '部分成功重試只能保存關聯，不能重送題目')

const failedLinks = await controller.saveQuestionAndReferences({
  questionType: 'select',
  questionUrl: '/exam/select_questions/',
  questionMethod: 'POST',
  questionPayload: {question: '題目'},
  referenceItems: [{provision_id: 9}],
  request: async (config) => {
    if (config.method === 'POST') return {data: {id: 38}}
    throw new Error('references failed')
  },
})
assert.deepEqual(failedLinks, {kind: 'links_failed', questionId: 38})

let blockedUnknownCalls = 0
const blockedUnknown = await controller.saveQuestionAndReferences({
  questionType: 'select',
  questionUrl: '/exam/select_questions/',
  questionMethod: 'POST',
  questionPayload: {question: '不可重送'},
  referenceItems: [],
  questionOutcomeUnknown: true,
  request: async () => {
    blockedUnknownCalls += 1
    return {data: {id: 99}}
  },
})
assert.deepEqual(blockedUnknown, {kind: 'question_unknown'})
assert.equal(blockedUnknownCalls, 0, '題目結果未知後不得重送任何題目或關聯請求')

const networkUnknown = await controller.saveQuestionAndReferences({
  questionType: 'select',
  questionUrl: '/exam/select_questions/',
  questionMethod: 'POST',
  questionPayload: {question: '網路結果未知'},
  referenceItems: [],
  request: async () => { throw new Error('network unavailable') },
})
assert.deepEqual(networkUnknown, {kind: 'question_unknown'})

await assert.rejects(
  controller.saveQuestionAndReferences({
    questionType: 'select',
    questionUrl: '/exam/select_questions/',
    questionMethod: 'POST',
    questionPayload: {question: '伺服器明確拒絕'},
    referenceItems: [],
    request: async () => { throw {response: {status: 400}} },
  }),
  '有 HTTP 回應的題目失敗必須交回表單錯誤處理，不得誤報結果未知',
)

const source = (path) => readFileSync(resolve(repo, path), 'utf8')
const articleSource = source('src/features/Link/ArticleLink/ArticleLink.tsx')
assert.match(articleSource, /V3_API.*\/exam\/questions/, '顯示元件必須讀取 Exam V3 關聯')
assert.match(articleSource, /batch-resolve/, '預覽必須使用 batch-resolve')
assert.ok((articleSource.match(/new AbortController\(\)/g) ?? []).length >= 2, '關聯清單與條文預覽都必須可取消晚到請求')
assert.doesNotMatch(articleSource, /POLICE_API|article_text|dangerouslySetInnerHTML/, '顯示元件不得保留 PoliceLaw／HTML live path')

for (const path of [
  'src/features/Link/ArticleLink/Articles.tsx',
  'src/features/Link/ArticleLink/ModalAddArticleLink.tsx',
]) {
  const text = source(path)
  assert.doesNotMatch(text, /POLICE_API|PoliceLawData|dangerouslySetInnerHTML/, `${path} 不得保留舊 PoliceLaw 依賴`)
}
const searchModalSource = source('src/features/Link/ArticleLink/ModalAddArticleLink.tsx')
assert.match(searchModalSource, /LawProvisionSearchPicker/, '選取 Modal 必須接入局部法規選取介面')
assert.doesNotMatch(searchModalSource, /\/law\/search|law\/search|searchLaw/, '選取 Modal 不得保留第二套搜尋實作')

assert.equal(
  pickerApi.lawDocumentsUrl('刑法'),
  '/v3/law/documents?page=1&page_size=20&is_active=true&q=%E5%88%91%E6%B3%95',
  '法規篩選必須固定讀取首批 20 筆啟用法規',
)
assert.equal(
  pickerApi.lawProvisionSearchUrl('傷害', ''),
  '/v3/law/search?page=1&page_size=10&q=%E5%82%B7%E5%AE%B3&active_only=true',
  '全部法規搜尋不得夾帶 document_code',
)
assert.equal(
  pickerApi.lawProvisionSearchUrl('傷害', 'CRIMINAL_CODE'),
  '/v3/law/search?page=1&page_size=10&q=%E5%82%B7%E5%AE%B3&active_only=true&document_code=CRIMINAL_CODE',
  '指定法規搜尋必須帶入 document_code 並維持首批 10 筆',
)
assert.deepEqual(
  pickerApi.normalizeLawProvisionHits({items: [{id: 9, document_title: '刑法', ordinal_code: '277', provision_type: 'article', md_content: '傷害他人者'}]}),
  [{provision: {id: 9, document_title: '刑法', ordinal_code: '277', provision_type: 'article', md_content: '傷害他人者'}, search_text_preview: '傷害他人者'}],
  '合成條文回應必須正規化為結果卡片可用的資料',
)

for (const path of [
  'src/features/Link/ArticleLink/LawProvisionSearchPicker.tsx',
  'src/features/Link/ArticleLink/LawDocumentFilterSelect.tsx',
]) {
  const text = source(path)
  assert.match(text, /new AbortController\(\)/, `${path} 必須取消被條件變更、關閉或卸載取代的請求`)
  assert.match(text, /requestGeneration|generation/, `${path} 必須以請求序號拒絕晚到結果`)
  assert.match(text, /signal: .*\.signal/, `${path} 必須把取消訊號交給 Axios`)
}
const pickerSource = source('src/features/Link/ArticleLink/LawProvisionSearchPicker.tsx')
assert.match(pickerSource, /LawDocumentFilterSelect/, '桌面與窄螢幕皆須呈現法規篩選器')
assert.match(pickerSource, /Articles/, '桌面與窄螢幕皆須以結果卡片集合呈現條文')
assert.match(pickerSource, /flex-col.*md:flex-row/, '窄螢幕搜尋列必須改為垂直排列')
assert.match(pickerSource, /selectedProvisionIds/, '選取狀態必須由父層已選 provision id 控制')
assert.doesNotMatch(pickerSource, /page=2|has_next|無限捲動|infinite/i, '選取介面不得新增分頁或無限捲動')

const documentFilterSource = source('src/features/Link/ArticleLink/LawDocumentFilterSelect.tsx')
assert.match(documentFilterSource, /全部法規/, '法規篩選器必須可回到全部法規')
assert.match(documentFilterSource, /lawDocumentsUrl/, '法規篩選器必須使用局部 V3 讀取契約')
assert.match(documentFilterSource, /V3_API/, '法規篩選器必須使用 Exam 的 V3 主機設定')
assert.match(documentFilterSource, /selectedDocumentTitle/, '變更法規名稱搜尋時必須保留已選法規的可見標籤')
assert.match(pickerSource, /V3_API/, '條文搜尋必須使用 Exam 的 V3 主機設定')

const resultCardSource = source('src/features/Link/ArticleLink/LawProvisionResultCard.tsx')
assert.match(resultCardSource, /第 .*條|第 .*點/, '結果卡片必須使用 Exam 的中文條次標示')
assert.match(resultCardSource, /已加入|選取/, '結果卡片必須標示已選取狀態並禁止重複加入')
assert.match(source('src/features/Link/ArticleLink/Articles.tsx'), /LawProvisionResultCard/, '結果集合必須只使用新的結果卡片')

const types = source('src/types/exam-types.ts')
assert.doesNotMatch(types, /article_link/, 'Exam 型別不得再公開 article_link')
assert.match(source('src/lib/config.ts'), /V3_EXAM_API/, 'config 必須提供 V3 Exam API 根位址')
assert.match(source('src/App.tsx'), /buster: 'v2'/, '持久快取 buster 必須升版')

for (const path of [
  'src/features/Select/for-user/Question/QsCardForRecord.tsx',
  'src/features/Select/for-manager/Question/QsCardForEdit.tsx',
  'src/features/Select/for-manager/Question/QsCardForView.tsx',
  'src/features/Essay/for-user/Question/QsCardForView.tsx',
  'src/features/Essay/for-manager/Question/QsCardForEdit.tsx',
]) {
  const text = source(path)
  assert.match(text, /<ArticleLink questionType=/, `${path} 必須傳入 questionType`)
  assert.match(text, /questionId=\{(?:q\.|record\.question\.)id\}/, `${path} 必須傳入 questionId`)
  assert.doesNotMatch(text, /article_link/, `${path} 不得再讀取 article_link`)
}

for (const path of [
  'src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx',
  'src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx',
]) {
  const text = source(path)
  assert.match(text, /saveQuestionAndReferences/, `${path} 必須以兩次保存 controller 處理部分成功`)
  assert.doesNotMatch(text, /article_link/, `${path} 題目保存不得送 article_link`)
  assert.match(text, /if \(questionUnknown\) return/, `${path} 結果未知後必須阻止盲目重送`)
  assert.match(text, /if \(saving\) return/, `${path} 保存中必須阻止重複送出`)
  assert.match(text, /onLoadStateChange=\{setLawReferencesState\}/, `${path} 必須接收既有關聯載入狀態`)
  assert.match(
    text,
    /disabled=\{saving \|\| questionUnknown \|\| Boolean\(pendingQuestionId\) \|\| lawReferencesState !== 'ready'\}/,
    `${path} 保存中、結果未知、部分成功或既有關聯未成功載入時必須停用主儲存`,
  )
}

const articleEditSource = source('src/features/Link/ArticleLink/ArticleLinkEdit.tsx')
assert.match(articleEditSource, /onLoadStateChange: \(state: LawReferenceLoadState\) => void/, '關聯編輯器必須向父層回報載入狀態')
assert.match(articleEditSource, /onLoadStateChange\('error'\)/, '既有關聯讀取失敗必須 fail closed')
assert.match(articleEditSource, /onLoadStateChange\('ready'\)/, '只有成功同步關聯集合後才能允許題目保存')
assert.match(articleEditSource, /重新讀取/, '既有關聯讀取失敗必須提供可實際重試的操作')
assert.match(
  source('src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx'),
  /questionId=\{obj\?\.id\}/,
  '選擇題新增部分成功後必須保留待存 collection，不得用新 id 觸發重載覆蓋',
)
assert.match(
  source('src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx'),
  /questionId=\{q\?\.id\}/,
  '申論題新增部分成功後必須保留待存 collection，不得用新 id 觸發重載覆蓋',
)

// 執行真實元件的接線與 effect；僅替換 React 掛鉤及外部依賴，不發送網路請求。
function componentHarness(path, api = () => {}) {
  const cells = []
  let cursor = 0
  const react = {
    useState(initial) {
      const index = cursor++
      if (!(index in cells)) cells[index] = initial
      return [cells[index], (value) => {
        cells[index] = typeof value === 'function' ? value(cells[index]) : value
      }]
    },
    useRef(initial) {
      const index = cursor++
      return cells[index] ??= {current: initial}
    },
    useEffect(callback, dependencies) {
      const index = cursor++
      const previous = cells[index]
      if (!previous || dependencies.some((value, i) => !Object.is(value, previous.dependencies[i]))) {
        previous?.cleanup?.()
        cells[index] = {dependencies, cleanup: callback()}
      }
    },
  }
  const module = {exports: {}}
  const output = ts.transpileModule(source(path), {
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX},
    fileName: path,
  }).outputText
  runInNewContext(output, {
    exports: module.exports, module, AbortController,
    require(name) {
      if (name === 'react') return react
      if (name === 'react/jsx-runtime') return {
        jsx: (type, props) => ({type, props}), jsxs: (type, props) => ({type, props}),
      }
      if (name === '@/hooks') return {
        useAxios: () => api, useModal: () => ({isShow: false, onShow() {}, onHide() {}}),
      }
      return new Proxy({__esModule: true, default: name}, {get: (target, key) => target[key] ?? `${name}:${String(key)}`})
    },
  })
  return (props) => {
    cursor = 0
    return module.exports.default(props)
  }
}

function childProps(node, suffix) {
  if (!node || typeof node !== 'object') return undefined
  if (typeof node.type === 'string' && node.type.endsWith(suffix)) return node.props
  const children = Array.isArray(node.props?.children) ? node.props.children : [node.props?.children]
  return children.map((child) => childProps(child, suffix)).find(Boolean)
}

for (const [kind, modal] of [['Select', 'ModalSelectEdit.tsx'], ['Essay', 'ModalEssayQuestionEdit.tsx']]) {
  const renderCard = componentHarness(`src/features/${kind}/for-manager/Question/QsCardForEdit.tsx`)
  let listRefreshes = 0
  const props = {
    q: {id: 37, question: '合成題目', file_link: []}, a: [], i: 0,
    config: {showLinks: true}, onRefetch: () => { listRefreshes += 1 },
  }
  const requests = []
  const renderLinks = componentHarness('src/features/Link/ArticleLink/ArticleLink.tsx', (config) => {
    requests.push(config)
    return Promise.resolve({data: {items: []}})
  })
  let tree = renderCard(props)
  renderLinks(childProps(tree, '/ArticleLink.tsx'))
  assert.equal(requests.length, 1, `${kind} 首次顯示必須讀取關聯`)
  renderLinks(childProps(renderCard({...props, q: {...props.q}}), '/ArticleLink.tsx'))
  assert.equal(requests.length, 1, `${kind} 一般重繪不可重複讀取關聯`)
  childProps(tree, modal).onRefetch()
  tree = renderCard(props)
  renderLinks(childProps(tree, '/ArticleLink.tsx'))
  assert.equal(listRefreshes, 1, `${kind} 必須保留原列表刷新`)
  assert.equal(requests.length, 2, `${kind} 儲存後不切換顯示開關也必須重新讀取關聯`)
  assert.equal(requests[0].signal.aborted, true, `${kind} 刷新必須取消舊關聯讀取`)
  childProps(tree, modal).onRefetch()
  renderLinks(childProps(renderCard(props), '/ArticleLink.tsx'))
  assert.equal(requests.length, 3, `${kind} 再次儲存仍必須刷新`)
  assert.equal(listRefreshes, 2)
  assert.ok(requests.every(({method, url}) => method === 'GET' && url.endsWith(`/exam/questions/${kind.toLowerCase()}/37/law-references`)))
}

execFileSync('node', ['--check', 'scripts/exam-law-reference-contract.mjs'], {cwd: repo, stdio: 'inherit'})
console.log('exam law reference contract: PASS')
