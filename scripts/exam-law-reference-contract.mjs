import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {existsSync, readFileSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {runInNewContext} from 'node:vm'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = path => readFileSync(resolve(root, path), 'utf8')
const required = path => {
  assert.ok(existsSync(resolve(root, path)), `缺少正式 DEMO 樣式元件：${path}`)
  return source(path)
}
const editor = await import(`${resolve(root, 'src/features/LawReferenceEditor/lawReferenceEditorController.ts')}?contract=${Date.now()}`)
const pickerApi = await import(`${resolve(root, 'src/features/Link/ArticleLink/lawPickerApi.ts')}?contract=${Date.now()}`)

assert.equal(editor.lawReferenceEditorUrl('select', 37), '/law/reference-editor/37/exam-select')
assert.equal(editor.lawReferenceEditorUrl('essay', 18), '/law/reference-editor/18/exam-essay')
assert.deepEqual(editor.buildQuestionPayload({question: '題目', article_link: [], file_link: []}), {question: '題目'})
for (const path of [
  'src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx',
  'src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx',
]) {
  const text = source(path)
  assert.match(text, /LawReferenceEditor/, `${path} 必須使用新的獨立關聯編輯器`)
  assert.match(text, /createdQuestionId/, `${path} 新建成功後必須綁定回傳題目 ID`)
  assert.match(text, /buildQuestionPayload/, `${path} 正文請求必須排除 article_link 與 file_link`)
  assert.match(text, /savingRef\.current/, `${path} 正文保存必須有同步 in-flight 護欄`)
  assert.match(text, /questionUnknown/, `${path} 正文結果未知必須停止重建`)
  assert.doesNotMatch(text, /saveQuestionAndReferences|referenceItemsForPut|ArticleLinkEdit/, `${path} 不得把正文與關聯自動串存`)
  assert.doesNotMatch(text, /article_link|file_link/, `${path} 不得把舊關聯欄位送入正文表單`)
}
const component = source('src/features/LawReferenceEditor/LawReferenceEditor.tsx')
const formalPicker = required('src/features/LawReferenceEditor/LawReferenceEditorPicker.tsx')
const formalResultCard = required('src/features/LawReferenceEditor/LawReferenceEditorResultCard.tsx')
const formalDetailDialog = required('src/features/LawReferenceEditor/LawReferenceEditorDetailDialog.tsx')
assert.match(component, /loadLawReferenceEditor/, '編輯器必須以新的 GET 讀取權威集合')
assert.match(component, /saveLawReferenceEditor/, '編輯器必須以新的 PUT 獨立儲存')
assert.match(component, /url: V3_API \+ config\.url/, 'Exam 必須只由 V3_API 補一次 /v3 前綴')
assert.match(component, /LawReferenceEditorPicker/, 'Exam 必須使用與 DEMO 同結構的正式搜尋介面')
assert.match(component, /batch-resolve/, '編輯器預覽必須沿用條文 batch-resolve')
assert.match(component, /LawReferenceEditorDetailDialog/, 'Exam 預覽必須使用與 DEMO 同可見結構的詳情對話框')
assert.doesNotMatch(component, /ModalBody|ModalHeader|ModalTitle|LawProvisionNodes/, 'Exam 主編輯器不得自建偏離 DEMO 的預覽 Modal')
assert.match(component, /草稿已保留/, '一般錯誤必須保留草稿')
assert.match(component, /duration: Infinity/, '關聯衝突必須持續通知')
assert.match(component, /load\(true\)/, '關聯衝突只能由使用者直接重新 GET')
assert.match(component, /new AbortController\(\)/, '權威集合 GET 必須可取消')
assert.match(component, /onSaved\?\.\(\)/, '關聯成功後必須刷新既有讀取摘要')
assert.match(component, /className='card border border-base-300 bg-base-100'/, 'Exam 必須沿用確認版卡片結構')
assert.match(component, /<ul className='list'/, 'Exam 已選集合必須沿用確認版清單結構')
assert.match(component, /link_status === 'NEEDS_REVIEW'/, '待確認狀態必須使用後端正式列舉值')
assert.match(component, /!dirty \|\| conflict/, '未變更或衝突時不得送出整批 PUT')
assert.match(component, /放棄變更/, 'Exam 必須保留 DEMO 的放棄變更操作')
assert.match(component, /待新增/, 'Exam 必須保留 DEMO 的待新增標籤')
assert.doesNotMatch(component, /ModalAddArticleLink|FaEye|loadState === 'error' \? <div|conflict \? <div/, 'Exam 不得保留舊 Modal 搜尋、額外眼睛按鈕或行內狀態 alert')
assert.match(component, /toast\.error\(<div[\s\S]*重新載入/, 'Exam 衝突必須沿用 DEMO 的 toast 內重新載入操作')
assert.match(component, /\{saving \? <span className='loading loading-spinner loading-xs'\/> : null\}儲存關聯法條/, 'Exam 儲存中必須與 DEMO 維持相同按鈕文案')
for (const label of ['法規名稱', '搜尋範圍', '條款關鍵字']) assert.match(formalPicker, new RegExp(label))
assert.match(formalPicker, /LawReferenceEditorResultCard/)
assert.doesNotMatch(formalPicker + formalResultCard, /搜尋法規名稱 \/ code|font-mono|document_code\s*\?\s*<span/, 'Exam 正式可見介面不得顯示法規 code')
assert.match(formalPicker, /onPreview/, 'Exam 搜尋結果必須沿用 DEMO 的預覽操作')
assert.match(formalResultCard, /FaEye/)
assert.match(formalResultCard, /document_title} \| \{provision\.ordinal_code}/, 'Exam 結果卡標題格式必須與 DEMO 共用卡一致')
assert.match(formalResultCard, /flex items-center gap-1 font-semibold/)
assert.match(formalResultCard, /btn btn-ghost btn-xs/)
assert.doesNotMatch(formalResultCard, /FaCirclePlus/, 'Exam 結果卡不得多出 DEMO 沒有的加號圖示')
assert.doesNotMatch(formalPicker, /搜尋中…|input input-bordered input-sm w-full' aria-label='條號或內容關鍵字'/, 'Exam 搜尋控制項不得偏離 DEMO 的可見樣式')
for (const text of ['條文詳情', '條文資訊', '條文類型', '所屬章節', '完整條文內容', '原始文字']) assert.match(formalDetailDialog, new RegExp(text))
assert.match(formalDetailDialog, /max-h-\[70vh\] space-y-5 overflow-y-auto pr-1/, 'Exam 預覽 body 必須對齊 DEMO 共用詳情樣式')
assert.match(formalDetailDialog, /className='min-w-0 space-y-1'/, 'Exam 完整條文節點結構必須對齊 DEMO／Manage')
assert.match(formalDetailDialog, /node\.marker/, 'Exam 完整條文不得漏掉 DEMO／Manage 顯示的節點標記')
assert.match(source('src/features/Link/ArticleLink/ArticleLink.tsx'), /\/exam\/questions\//, '一般只讀 ArticleLink 保留既有舊 API')

const articleSource = source('src/features/Link/ArticleLink/ArticleLink.tsx')
assert.match(articleSource, /V3_API.*\/exam\/questions/, '一般顯示元件必須保留 Exam V3 關聯讀取')
assert.match(articleSource, /batch-resolve/, '一般顯示預覽必須使用 batch-resolve')
assert.ok((articleSource.match(/new AbortController\(\)/g) ?? []).length >= 2, '一般關聯清單與條文預覽都必須可取消晚到請求')
assert.doesNotMatch(articleSource, /POLICE_API|article_text|dangerouslySetInnerHTML/, '一般顯示元件不得復活 PoliceLaw／HTML live path')

for (const path of [
  'src/features/Link/ArticleLink/Articles.tsx',
  'src/features/Link/ArticleLink/ModalAddArticleLink.tsx',
]) {
  const text = source(path)
  assert.doesNotMatch(text, /POLICE_API|PoliceLawData|dangerouslySetInnerHTML/, `${path} 不得復活舊 PoliceLaw 依賴`)
}
const searchModalSource = source('src/features/Link/ArticleLink/ModalAddArticleLink.tsx')
assert.match(searchModalSource, /LawProvisionSearchPicker/, '選取 Modal 必須接入既有局部法規選取介面')
assert.doesNotMatch(searchModalSource, /\/law\/search|law\/search|searchLaw/, '選取 Modal 不得另建第二套搜尋實作')

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
  '合成條文回應必須正規化為結果卡片可用資料',
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
assert.match(source('src/features/Link/ArticleLink/Articles.tsx'), /LawProvisionResultCard/, '結果集合必須只使用既有結果卡片')

const types = source('src/types/exam-types.ts')
assert.doesNotMatch(types, /article_link/, 'Exam 公開型別不得復活 article_link')
assert.match(source('src/lib/config.ts'), /V3_EXAM_API/, 'config 必須保留 V3 Exam API 根位址')
assert.match(source('src/App.tsx'), /buster: 'v2'/, '持久快取 buster 必須維持已核准版本')

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

// 驗既有一般顯示的刷新接線；只替換 React 掛鉤與傳輸，不連線真實 API。
function componentHarness(path, api = () => {}) {
  const cells = []
  let cursor = 0
  const react = {
    useState(initial) {
      const index = cursor++
      if (!(index in cells)) cells[index] = initial
      return [cells[index], value => { cells[index] = typeof value === 'function' ? value(cells[index]) : value }]
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
  return props => { cursor = 0; return module.exports.default(props) }
}

function childProps(node, suffix) {
  if (!node || typeof node !== 'object') return undefined
  if (typeof node.type === 'string' && node.type.endsWith(suffix)) return node.props
  const children = Array.isArray(node.props?.children) ? node.props.children : [node.props?.children]
  return children.map(child => childProps(child, suffix)).find(Boolean)
}

for (const [kind, modal] of [['Select', 'ModalSelectEdit.tsx'], ['Essay', 'ModalEssayQuestionEdit.tsx']]) {
  const renderCard = componentHarness(`src/features/${kind}/for-manager/Question/QsCardForEdit.tsx`)
  let listRefreshes = 0
  const props = {
    q: {id: 37, question: '合成題目', file_link: []}, a: [], i: 0,
    config: {showLinks: true}, onRefetch: () => { listRefreshes += 1 },
  }
  const requests = []
  const renderLinks = componentHarness('src/features/Link/ArticleLink/ArticleLink.tsx', config => {
    requests.push(config)
    return Promise.resolve({data: {items: []}})
  })
  let tree = renderCard(props)
  renderLinks(childProps(tree, '/ArticleLink.tsx'))
  assert.equal(requests.length, 1, `${kind} 首次一般顯示必須讀取關聯`)
  renderLinks(childProps(renderCard({...props, q: {...props.q}}), '/ArticleLink.tsx'))
  assert.equal(requests.length, 1, `${kind} 一般重繪不可重複讀取關聯`)
  childProps(tree, modal).onRefetch()
  tree = renderCard(props)
  renderLinks(childProps(tree, '/ArticleLink.tsx'))
  assert.equal(listRefreshes, 1, `${kind} 必須保留原列表刷新`)
  assert.equal(requests.length, 2, `${kind} 儲存後不切換顯示開關也必須重新讀取一般關聯摘要`)
  assert.equal(requests[0].signal.aborted, true, `${kind} 刷新必須取消舊關聯讀取`)
  childProps(tree, modal).onRefetch()
  renderLinks(childProps(renderCard(props), '/ArticleLink.tsx'))
  assert.equal(requests.length, 3, `${kind} 再次儲存仍必須刷新一般顯示`)
  assert.equal(listRefreshes, 2)
  assert.ok(requests.every(({method, url}) => method === 'GET' && url.endsWith(`/exam/questions/${kind.toLowerCase()}/37/law-references`)))
}

execFileSync('node', ['--check', 'scripts/exam-law-reference-contract.mjs'], {cwd: root, stdio: 'inherit'})
console.log('exam law reference contract: PASS')
