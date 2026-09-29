import assert from 'node:assert/strict'
import {existsSync, readFileSync, readdirSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {test} from 'node:test'
import {fileURLToPath} from 'node:url'
import {runInNewContext} from 'node:vm'
import ts from 'typescript'
import {buildQuestionPayload} from '../src/features/LawReferenceEditor/lawReferenceEditorController.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = path => readFileSync(resolve(root, path), 'utf8')
for (const name of ['FileLink.tsx', 'FileLinkEdit.tsx', 'ModalSelectFile.tsx']) {
  assert.equal(existsSync(resolve(root, 'src/features/Link/FileLink', name)), false, `${name} 必須維持退役`)
}
for (const path of readdirSync(resolve(root, 'src'), {recursive: true}).filter(path => /\.(ts|tsx)$/.test(path))) {
  assert.doesNotMatch(source(`src/${path}`), /features\/Link\/FileLink\/|happywork\/sop_search\//, `${path} 不得復活檔案關聯`)
}
for (const path of [
  'src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx',
  'src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx',
]) {
  const text = source(path)
  assert.doesNotMatch(text, /file_link|article_link|saveQuestionAndReferences/, `${path} 不得以正文串存檔案或法條關聯`)
  assert.match(text, /LawReferenceEditor/, `${path} 法條保存必須是獨立操作`)
}
assert.match(source('src/features/LawReferenceEditor/lawReferenceEditorController.ts'), /delete result\.file_link/, '正文 payload 必須防禦性排除已退役檔案欄位')

const legacyFiles = [{id: '17', title: '合成作業程序舊檔案', url: '/f/synthetic'}]
const question = {
  id: 37, question: '合成題目', options: ['選項甲'], answer: [0],
  year: '115', source: '四等特考', category: '共同', subject: '警察法規',
  is_public: true, file_link: legacyFiles, comment: null, sample_answer: null,
  remark: '原有筆記', record_count: 1, correct_count: 1,
}
const cards = [
  ['select', 'src/features/Select/for-manager/Question/QsCardForEdit.tsx'],
  ['select', 'src/features/Select/for-manager/Question/QsCardForView.tsx'],
  ['select', 'src/features/Select/for-user/Question/QsCardForRecord.tsx'],
  ['essay', 'src/features/Essay/for-manager/Question/QsCardForEdit.tsx'],
  ['essay', 'src/features/Essay/for-user/Question/QsCardForView.tsx'],
]
const modals = [
  ['select', 'src/features/Select/for-manager/Manage/Edit/ModalSelectEdit.tsx'],
  ['essay', 'src/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx'],
]
const plain = value => JSON.parse(JSON.stringify(value))

// 執行既有卡片與正文送出事件；法條編輯器及外部傳輸以合成邊界替代。
function harness(path, formValues = {}) {
  const cells = []
  const requests = []
  const errors = []
  const notifications = []
  const navigations = []
  let cursor = 0
  const react = {
    useEffect() {},
    useState(initial) {
      const index = cursor++
      if (!(index in cells)) cells[index] = typeof initial === 'function' ? initial() : initial
      return [cells[index], value => { cells[index] = typeof value === 'function' ? value(cells[index]) : value }]
    },
    useRef(initial) {
      const index = cursor++
      return cells[index] ??= {current: initial}
    },
  }
  const api = async config => {
    requests.push(plain(config))
    return {data: config.method === 'POST' ? {id: 37} : {}}
  }
  const module = {exports: {}}
  const output = ts.transpileModule(source(path), {
    fileName: path,
    compilerOptions: {module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX},
  }).outputText
  runInNewContext(output, {
    module, exports: module.exports, URLSearchParams,
    require(name) {
      if (name === 'react') return react
      if (name === 'react/jsx-runtime') return {
        jsx: (type, props) => ({type, props}), jsxs: (type, props) => ({type, props}), Fragment: 'fragment',
      }
      if (name === 'react-hook-form') return {
        useForm: ({defaultValues}) => {
          const values = {...defaultValues, ...formValues}
          return {
            register: field => ({name: field}),
            handleSubmit: callback => () => callback(values),
            reset: () => {},
            setError: (...args) => errors.push(args),
            setValue: (field, value) => { values[field] = value },
            watch: fields => fields ? fields.map(field => values[field]) : values,
            formState: {errors: {}},
          }
        },
      }
      if (name === '@/hooks') return {
        useAxios: () => api, useModal: () => ({isShow: true, onShow() {}, onHide() {}}),
        useCacheApi: () => ({data: {source: [], category: [], subject: []}}),
      }
      if (name === 'react-router') return {
        useNavigate: () => url => navigations.push(url),
        useParams: () => ({page: '3'}), useLocation: () => ({pathname: '/synthetic-questions/3'}),
        useSearchParams: () => [new URLSearchParams(), () => {}],
      }
      if (name === 'react-hot-toast') return {__esModule: true, default: {
        success: message => notifications.push(message), error: message => errors.push(message),
      }}
      if (name === '@/func') return {showFormError: error => errors.push(error)}
      if (name === '@/lib/config.ts' || name === '@/lib/config') return {EXAM_API: '/exam', EXAM_API_V2: '/v2/exam'}
      if (name.endsWith('/lawReferenceEditorController.ts')) return {buildQuestionPayload}
      return new Proxy({__esModule: true, default: name}, {
        get: (target, key) => target[key] ?? `${name}:${String(key)}`,
      })
    },
  })
  return {
    requests, errors, notifications, navigations,
    render(props) { cursor = 0; return module.exports.default(props) },
  }
}

function nodes(tree) {
  if (Array.isArray(tree)) return tree.flatMap(nodes)
  if (!tree || typeof tree !== 'object') return []
  return [tree, ...nodes(tree.props?.children)]
}
const bySuffix = (tree, suffix) => nodes(tree).find(node => typeof node.type === 'string' && node.type.endsWith(suffix))
const saveButton = tree => nodes(tree).find(node =>
  node.type === '@/component:Button' && nodes(node).some(child => String(child.type).endsWith(':FaSave')))
const hasFileControl = tree => nodes(tree).some(node =>
  String(node.type).includes('/FileLink/') || node.props?.href === '/f/synthetic' || node.props?.to === '/f/synthetic')

for (const [kind, path] of cards) {
  test(`${path}：舊檔案不顯示，關聯法條一般顯示保留`, () => {
    const {render} = harness(path)
    const props = {
      q: question, record: {question, answer: [0], created_at: '2026-09-22'}, a: [0], i: 0,
      config: {showLinks: true}, onRefetch() {},
    }
    const tree = render(props)
    assert.equal(hasFileControl(tree), false, '題目卡片不得渲染檔案關聯元件或連結')
    const article = bySuffix(tree, '/ArticleLink.tsx')
    assert.equal(article?.props.questionType, kind)
    assert.equal(article?.props.questionId, 37)
    assert.equal(bySuffix(render({...props, config: {showLinks: false}}), '/ArticleLink.tsx'), undefined)
  })
}

for (const [kind, path] of modals) {
  test(`${kind}：新增與編輯表單皆無檔案入口，法條改為獨立編輯器`, () => {
    for (const editing of [false, true]) {
      const {render} = harness(path)
      const tree = render({[kind === 'select' ? 'obj' : 'q']: editing ? question : undefined, onRefetch() {}})
      assert.equal(hasFileControl(tree), false, '表單不得掛載檔案搜尋或編輯元件')
      assert.ok(bySuffix(tree, '/LawReferenceEditor.tsx'), '必須提供獨立關聯法條編輯器')
    }
  })

  for (const method of ['POST', 'PATCH']) {
    test(`${kind} ${method}：正文儲存不送舊關聯欄位，也不自動串存法條`, async () => {
      const before = plain(question)
      const h = harness(path, {question: '本次修改題目', file_link: legacyFiles, article_link: [['刑法', '第 1 條']]})
      let refreshes = 0
      const props = {
        [kind === 'select' ? 'obj' : 'q']: method === 'PATCH' ? question : undefined,
        onRefetch() { refreshes += 1 },
      }
      const tree = h.render(props)
      saveButton(tree).props.onClick()
      saveButton(tree).props.onClick()
      await new Promise(resolve => setImmediate(resolve))
      assert.deepEqual(h.errors, [])
      assert.equal(h.requests.length, 1, '正文按鈕只能發送一次題目請求，不得自動送出關聯 PUT')
      const request = h.requests[0]
      assert.equal(request.method, method)
      assert.equal(request.url, `/exam/${kind === 'select' ? 'select' : 'essay'}_questions/${method === 'PATCH' ? '37/' : ''}`)
      assert.equal(Object.hasOwn(request.data, 'file_link'), false)
      assert.equal(Object.hasOwn(request.data, 'article_link'), false)
      assert.equal(request.data.question, '本次修改題目')
      if (kind === 'select') {
        assert.deepEqual(request.data.options, method === 'PATCH' ? question.options : [])
        assert.deepEqual(request.data.answer, method === 'PATCH' ? question.answer : [])
        assert.equal(request.data.comment, null)
      } else assert.equal(request.data.sample_answer, null)
      assert.deepEqual(question, before, '原始題目及檔案集合不得被正文送出流程改寫')
      assert.equal(refreshes, 1)
      assert.deepEqual(h.notifications, [method === 'POST' ? '題目已儲存；可另外儲存關聯法條。' : '題目已儲存'])
      if (method === 'POST') {
        const reboundTree = h.render(props)
        saveButton(reboundTree).props.onClick()
        await new Promise(resolve => setImmediate(resolve))
        assert.equal(h.requests.length, 2)
        assert.equal(h.requests[1].method, 'PATCH', '取得新題目 ID 後，後續正文儲存不得再次 POST 建題')
        assert.equal(h.requests[1].url, `/exam/${kind === 'select' ? 'select' : 'essay'}_questions/37/`)
      }
    })
  }
}

test('送出邊界排除非空、空陣列與 null 關聯欄位且不修改輸入', () => {
  for (const value of [legacyFiles, [], null]) {
    const input = Object.freeze({question: '合成題目', file_link: value, article_link: [], is_public: false})
    const result = buildQuestionPayload(input)
    assert.deepEqual(result, {question: '合成題目', is_public: false})
    assert.equal(input.file_link, value)
  }
})

test('僅移除表單欄位，保留後端回應型別及法條顯示設定', () => {
  const ast = ts.createSourceFile('exam-types.ts', source('src/types/exam-types.ts'), ts.ScriptTarget.Latest, true)
  const declaration = name => ast.statements.find(node => node.name?.text === name)
  for (const name of ['SelectQuestionForm', 'EssayQuestionForm']) {
    assert.ok(declaration(name))
    assert.equal(declaration(name).type.members.some(member => member.name?.text === 'file_link'), false)
  }
  for (const name of ['SelectQuestionSimpleData', 'EssayQuestionData']) {
    assert.ok(declaration(name).members.some(member => member.name?.text === 'file_link'))
  }
  for (const name of ['SelectCardConfig', 'EssayCardConfig']) {
    assert.ok(declaration(name).type.members.some(member => member.name?.text === 'showLinks'))
  }
})

test('退役檢查仍登錄於套件指令', () => {
  const pkg = JSON.parse(source('package.json'))
  assert.equal(pkg.scripts['test:file-link-retirement'], 'node --experimental-strip-types scripts/exam-file-link-retirement-contract.mjs')
})

for (const path of [
  'src/features/Select/for-manager/Manage/ModalSelectFilter.tsx',
  'src/features/Essay/for-manager/tools/ModalEssayFilter.tsx',
]) {
  test(`${path}：法條專用名稱與原有篩選參數、分頁接線`, () => {
    for (const value of ['true', 'false', '']) {
      const h = harness(path, {link_is_null: value, search: '合成搜尋', ordering: 'year', subject: ['警察法規']})
      const tree = h.render({detailMode: true})
      const field = nodes(tree).find(node => node.type === 'select' && node.props.name === 'link_is_null')
      const options = nodes(field).filter(node => node.type === 'option' && node.props.value)
      assert.deepEqual(options.map(node => [node.props.children, node.props.value]), [
        ['無關聯法條', 'true'], ['有關聯法條', 'false'],
      ])
      const button = nodes(tree).find(node => node.type === '@/component:Button' &&
        nodes(node).some(child => String(child.type).endsWith(':FaSearch')))
      button.props.onClick()
      assert.equal(h.navigations.length, 1)
      const url = new URL(h.navigations[0], 'https://example.test')
      assert.equal(url.pathname, '/synthetic-questions/1')
      assert.equal(url.searchParams.get('link_is_null'), value || null)
      assert.equal(url.searchParams.get('search'), '合成搜尋')
      assert.equal(url.searchParams.get('ordering'), 'year')
      assert.equal(url.searchParams.get('subject'), '警察法規')
      assert.equal(h.requests.length, 0)
      assert.equal(nodes(h.render({detailMode: false})).some(node => node.props?.name === 'link_is_null'), false)
    }
  })
}
console.log('exam file link retirement contract: PASS')
