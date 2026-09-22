import assert from 'node:assert/strict'
import {existsSync, readFileSync, readdirSync} from 'node:fs'
import {dirname, resolve} from 'node:path'
import {test} from 'node:test'
import {fileURLToPath} from 'node:url'
import {runInNewContext} from 'node:vm'
import ts from 'typescript'
import {buildQuestionPayload, referenceItemsForPut, saveQuestionAndReferences} from '../src/features/Link/ArticleLink/lawReferenceController.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = path => readFileSync(resolve(root, path), 'utf8')
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
const retired = ['FileLink.tsx', 'FileLinkEdit.tsx', 'ModalSelectFile.tsx']
  .map(name => `src/features/Link/FileLink/${name}`)
const plain = value => JSON.parse(JSON.stringify(value))

// 執行實際元件與送出事件；只替換掛鉤、表單邊界與外部傳輸，不連線真實 API。
function harness(path, formValues = {}) {
  const cells = []
  const requests = []
  const errors = []
  const notifications = []
  const navigations = []
  let cursor = 0
  const react = {
    useEffect() {}, // 篩選畫面的焦點計時器不屬於本次離線契約。
    useState(initial) {
      const index = cursor++
      if (!(index in cells)) cells[index] = typeof initial === 'function' ? initial() : initial
      return [cells[index], value => {
        cells[index] = typeof value === 'function' ? value(cells[index]) : value
      }]
    },
    useRef(initial) {
      const index = cursor++
      return cells[index] ??= {current: initial}
    },
  }
  const api = async config => {
    requests.push(plain(config))
    return {data: config.method === 'POST' ? {id: 37} : {items: []}}
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
          // 保留 defaultValues 中未註冊的舊欄位，覆蓋本次表單輸入。
          const values = {...defaultValues, ...formValues}
          return {
            register: field => ({name: field}),
            handleSubmit: callback => () => callback(values),
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
      if (name.endsWith('/lawReferenceController.ts')) return {
        saveQuestionAndReferences, referenceItemsForPut,
      }
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
  test(`${path}：舊檔案不顯示，關聯法條保留`, () => {
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
  test(`${kind}：新增與編輯表單皆無檔案操作入口`, () => {
    for (const editing of [false, true]) {
      const {render} = harness(path)
      const tree = render({[kind === 'select' ? 'obj' : 'q']: editing ? question : undefined, onRefetch() {}})
      assert.equal(hasFileControl(tree), false, '表單不得掛載檔案搜尋或編輯元件')
      assert.ok(bySuffix(tree, '/ArticleLinkEdit.tsx'), '仍須提供關聯法條編輯器')
    }
  })

  for (const method of ['POST', 'PATCH']) {
    test(`${kind} ${method}：實際儲存事件不送舊檔案欄位，也不清空原資料`, async () => {
      const before = plain(question)
      const h = harness(path, {question: '本次修改題目', file_link: legacyFiles})
      let refreshes = 0
      const props = {
        [kind === 'select' ? 'obj' : 'q']: method === 'PATCH' ? question : undefined,
        onRefetch() { refreshes += 1 },
      }
      let tree = h.render(props)
      const editor = bySuffix(tree, '/ArticleLinkEdit.tsx')
      if (method === 'PATCH') assert.equal(saveButton(tree).props.disabled, true, '舊法條載入前不可儲存')
      editor.props.onChange([{kind: 'provision', provision: {id: 9}}])
      editor.props.onLoadStateChange('ready')
      tree = h.render(props)
      assert.equal(saveButton(tree).props.disabled, false)
      saveButton(tree).props.onClick()
      // 同一繪製結果重複觸發，確認原有同步防重入仍有效。
      saveButton(tree).props.onClick()
      await new Promise(resolve => setImmediate(resolve))
      assert.deepEqual(h.errors, [])
      assert.equal(h.requests.length, 2, '只能有題目保存及 V3 法條保存，不得搜尋檔案或重複送出')
      const request = h.requests[0]
      assert.equal(request.method, method)
      assert.equal(request.url, `/exam/${kind === 'select' ? 'select' : 'essay'}_questions/${method === 'PATCH' ? '37/' : ''}`)
      assert.equal(Object.hasOwn(request.data, 'file_link'), false, '即使 defaultValues 含舊關聯，POST／PATCH 也不得送出 file_link')
      assert.equal(Object.hasOwn(request.data, 'article_link'), false)
      assert.equal(request.data.question, '本次修改題目')
      if (kind === 'select') {
        assert.deepEqual(request.data.options, method === 'PATCH' ? question.options : [])
        assert.deepEqual(request.data.answer, method === 'PATCH' ? question.answer : [])
        assert.equal(request.data.comment, null)
      } else assert.equal(request.data.sample_answer, null)
      assert.deepEqual(h.requests[1], {
        method: 'PUT', url: `/v3/exam/questions/${kind}/37/law-references`, data: {items: [{provision_id: 9}]},
      })
      assert.deepEqual(question, before, '原始題目及檔案集合不得被送出流程改寫')
      assert.equal(refreshes, 1)
      assert.deepEqual(h.notifications, ['儲存成功'])
    })
  }
}

test('送出邊界排除非空、空陣列與 null 檔案欄位且不修改輸入', () => {
  for (const value of [legacyFiles, [], null]) {
    const input = Object.freeze({question: '合成題目', file_link: value, article_link: [], is_public: false})
    const result = buildQuestionPayload(input)
    assert.deepEqual(result, {question: '合成題目', is_public: false})
    assert.equal(input.file_link, value)
  }
})

test('專用元件已移除且產品來源不再匯入或搜尋檔案', () => {
  for (const path of retired) assert.equal(existsSync(resolve(root, path)), false, `${path} 應已移除`)
  const files = readdirSync(resolve(root, 'src'), {recursive: true}).filter(path => /\.(ts|tsx)$/.test(path))
  for (const path of files) {
    const text = source(`src/${path}`)
    assert.doesNotMatch(text, /features\/Link\/FileLink\/|happywork\/sop_search\//, `${path} 不得保留檔案關聯使用路徑`)
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

test('退役檢查已登錄套件指令', () => {
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
