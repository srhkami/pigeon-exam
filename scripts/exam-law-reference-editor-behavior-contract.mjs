import assert from 'node:assert/strict'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const editor = await import(`${resolve(root, 'src/features/LawReferenceEditor/lawReferenceEditorController.ts')}?contract=${Date.now()}`)

const response = {
  expected_revision: 'revision-1',
  items: [{
    reference_link_id: 7,
    provision_id: 9,
    document_code: 'CRIMINAL_CODE',
    document_title: '刑法',
    ordinal_code: '277',
    provision_type: 'article',
    link_status: 'ACTIVE',
    is_current: true,
    display_text: '刑法第277條',
  }],
}
assert.deepEqual(editor.parseLawReferenceEditorResponse(response), response)
for (const invalid of [null, {}, {items: []}, {expected_revision: '', items: []}, {...response, extra: true}, {...response, items: [{...response.items[0], provision_id: '9'}]}]) {
  assert.throws(() => editor.parseLawReferenceEditorResponse(invalid), '回應必須嚴格驗證，不接受缺欄、額外欄位或錯誤型別')
}
assert.equal(editor.lawReferenceEditorUrl('select', 37), '/law/reference-editor/37/exam-select')
assert.equal(editor.lawReferenceEditorUrl('essay', 38), '/law/reference-editor/38/exam-essay')
const abortController = new AbortController()
const loadLog = []
assert.deepEqual(await editor.loadLawReferenceEditor({
  questionType: 'select', questionId: 37, signal: abortController.signal,
  request: async config => { loadLog.push(config); return {data: response} },
}), response)
assert.deepEqual(loadLog, [{method: 'GET', url: '/law/reference-editor/37/exam-select', signal: abortController.signal}])
assert.deepEqual(editor.draftReplacePayload('revision-1', [
  {kind: 'existing', item: response.items[0]},
  {kind: 'provision', provision: {id: 10, document_title: '刑法', ordinal_code: '278', provision_type: 'article'}},
]), {expected_revision: 'revision-1', items: [{reference_link_id: 7}, {provision_id: 10}]})
const duplicateHistorical = {...response.items[0], reference_link_id: 8}
assert.deepEqual(editor.draftReplacePayload('revision-1', [
  {kind: 'existing', item: response.items[0]},
  {kind: 'existing', item: duplicateHistorical},
  {kind: 'provision', provision: {id: 9, document_title: '刑法', ordinal_code: '277', provision_type: 'article'}},
]), {
  expected_revision: 'revision-1',
  items: [{reference_link_id: 7}, {reference_link_id: 8}],
}, '既有相同條文的歷史重複列必須逐筆保留，只阻止新增同條文')
assert.deepEqual(editor.draftReplacePayload('revision-1', [
  {kind: 'existing', item: response.items[0]},
]), {
  expected_revision: 'revision-1',
  items: [{reference_link_id: 7}],
}, '明確移除其中一筆歷史重複列時，payload 必須保留另一筆並移除指定列')

const requestLog = []
const transport = async config => {
  requestLog.push(config)
  return {data: response}
}
const saved = await editor.saveLawReferenceEditor({questionType: 'select', questionId: 37, expectedRevision: 'revision-1', items: [{reference_link_id: 7}], request: transport})
assert.deepEqual(saved, {kind: 'saved', response})
assert.deepEqual(requestLog, [{
  method: 'PUT',
  url: '/law/reference-editor/37/exam-select',
  data: {expected_revision: 'revision-1', items: [{reference_link_id: 7}]},
  skipAuthReplay: true,
}])

const conflict = await editor.saveLawReferenceEditor({
  questionType: 'essay', questionId: 38, expectedRevision: 'revision-1', items: [],
  request: async () => { throw {response: {status: 409, data: {code: 'law_reference_editor_revision_conflict'}}} },
})
assert.deepEqual(conflict, {kind: 'revision_conflict'}, '衝突只能停存，不能由保存函式自動覆蓋草稿')
const notEditable = await editor.saveLawReferenceEditor({
  questionType: 'essay', questionId: 38, expectedRevision: 'revision-1', items: [],
  request: async () => { throw {response: {status: 409, data: {code: 'law_reference_editor_source_not_editable'}}} },
})
assert.deepEqual(notEditable, {kind: 'source_not_editable'})
const wrongStatus = await editor.saveLawReferenceEditor({
  questionType: 'essay', questionId: 38, expectedRevision: 'revision-1', items: [],
  request: async () => { throw {response: {status: 422, data: {code: 'law_reference_editor_revision_conflict'}}} },
})
assert.deepEqual(wrongStatus, {kind: 'error'}, '必須同時比對 HTTP 409 與精確錯誤碼')
assert.equal(editor.classifyLawReferenceEditorError({response: {status: 409, data: {code: 'law_reference_editor_source_not_editable'}}}), 'source_not_editable')
assert.equal(editor.classifyLawReferenceEditorError({response: {status: 422, data: {code: 'law_reference_editor_source_not_editable'}}}), 'other')
const ordinaryFailure = await editor.saveLawReferenceEditor({
  questionType: 'essay', questionId: 38, expectedRevision: 'revision-1', items: [],
  request: async () => { throw new Error('offline') },
})
assert.deepEqual(ordinaryFailure, {kind: 'error'})

const guard = editor.createEditorRequestGuard()
const first = guard.begin('select:37')
const second = guard.begin('essay:38')
assert.equal(guard.isCurrent('select:37', first), false, 'owner 切換後舊回應不能更新目前編輯器')
assert.equal(guard.isCurrent('essay:38', second), true)
assert.equal(guard.begin('essay:38') > second, true, '同 owner 的新請求必須淘汰晚到回應')
const saveGeneration = guard.tryBeginSave('essay:38')
assert.equal(typeof saveGeneration, 'number')
assert.equal(guard.tryBeginSave('essay:38'), null, '同步旗標必須在 state 更新前阻止雙擊')
guard.begin('select:37')
assert.equal(guard.endSave('essay:38', saveGeneration), false, '舊 owner 的晚到完成不得解除新 owner 的忙碌狀態')
const nextSaveGeneration = guard.tryBeginSave('select:37')
assert.equal(typeof nextSaveGeneration, 'number', 'owner 切換必須解除舊 owner 的保存旗標')
assert.equal(guard.endSave('select:37', nextSaveGeneration), true)
assert.equal(typeof guard.tryBeginSave('select:37'), 'number')
console.log('exam law reference editor behavior contract: PASS')
