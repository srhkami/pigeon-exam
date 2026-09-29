export type ExamQuestionType = 'select' | 'essay'

export type LawReferenceEditorItem = {
  reference_link_id: number
  provision_id: number | null
  document_code: string | null
  document_title: string | null
  ordinal_code: string | null
  provision_type: string | null
  link_status: string
  is_current: boolean | null
  display_text: string
}

export type LawReferenceEditorResponse = {
  items: LawReferenceEditorItem[]
  expected_revision: string
}

export type NewProvision = {
  id: number
  document_title: string
  document_code?: string
  ordinal_code: string
  provision_type: string
  md_content?: string | null
}

export type DraftItem =
  | {kind: 'existing', item: LawReferenceEditorItem}
  | {kind: 'provision', provision: NewProvision}

export type ReplaceItem = {reference_link_id: number} | {provision_id: number}

type RequestConfig = {
  method: 'GET' | 'PUT'
  url: string
  data?: unknown
  signal?: AbortSignal
  skipAuthReplay?: boolean
}
type Request = (config: RequestConfig) => Promise<{data: unknown}>

const itemKeys = ['reference_link_id', 'provision_id', 'document_code', 'document_title', 'ordinal_code', 'provision_type', 'link_status', 'is_current', 'display_text']
const responseKeys = ['items', 'expected_revision']

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function exactKeys(value: Record<string, unknown>, keys: string[]) {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key))
}

function nullableString(value: unknown) {
  return value === null || typeof value === 'string'
}

function positiveInteger(value: unknown) {
  return typeof value === 'number' && Number.isSafeInteger(value) && value > 0
}

export function parseLawReferenceEditorResponse(value: unknown): LawReferenceEditorResponse {
  if (!isRecord(value) || !exactKeys(value, responseKeys) || typeof value.expected_revision !== 'string' || !value.expected_revision || !Array.isArray(value.items)) throw new Error('關聯法條回應格式無效。')
  const items = value.items.map((candidate) => {
    if (!isRecord(candidate) || !exactKeys(candidate, itemKeys) || !positiveInteger(candidate.reference_link_id) || !(candidate.provision_id === null || positiveInteger(candidate.provision_id)) || !nullableString(candidate.document_code) || !nullableString(candidate.document_title) || !nullableString(candidate.ordinal_code) || !nullableString(candidate.provision_type) || typeof candidate.link_status !== 'string' || !candidate.link_status || !(candidate.is_current === null || typeof candidate.is_current === 'boolean') || typeof candidate.display_text !== 'string') throw new Error('關聯法條項目格式無效。')
    return candidate as LawReferenceEditorItem
  })
  return {expected_revision: value.expected_revision, items}
}

export function buildQuestionPayload<T extends Record<string, unknown>>(payload: T): Omit<T, 'article_link' | 'file_link'> {
  const result = {...payload}
  delete result.article_link
  delete result.file_link
  return result
}

export function lawReferenceEditorUrl(questionType: ExamQuestionType, questionId: number) {
  return `/law/reference-editor/${questionId}/${questionType === 'select' ? 'exam-select' : 'exam-essay'}`
}

export function responseToDraft(response: LawReferenceEditorResponse): DraftItem[] {
  return response.items.map((item) => ({kind: 'existing', item}))
}

export function referenceItemsForReplace(existingItems: LawReferenceEditorItem[], provisions: NewProvision[]): {expected_revision: string, items: ReplaceItem[]} {
  const seenProvisions = new Set<number>()
  const items: ReplaceItem[] = []
  for (const item of existingItems) {
    if (item.provision_id) seenProvisions.add(item.provision_id)
    items.push({reference_link_id: item.reference_link_id})
  }
  for (const provision of provisions) {
    if (!seenProvisions.has(provision.id)) {
      seenProvisions.add(provision.id)
      items.push({provision_id: provision.id})
    }
  }
  return {expected_revision: '', items}
}

export function draftReplacePayload(expectedRevision: string, draft: DraftItem[]): {expected_revision: string, items: ReplaceItem[]} {
  const existing = draft.filter((item): item is Extract<DraftItem, {kind: 'existing'}> => item.kind === 'existing').map((item) => item.item)
  const provisions = draft.filter((item): item is Extract<DraftItem, {kind: 'provision'}> => item.kind === 'provision').map((item) => item.provision)
  return {...referenceItemsForReplace(existing, provisions), expected_revision: expectedRevision}
}

function errorDetails(error: unknown): {status?: number, code?: unknown} {
  if (!isRecord(error) || !isRecord(error.response)) return {}
  const status = typeof error.response.status === 'number' ? error.response.status : undefined
  const code = isRecord(error.response.data) ? error.response.data.code : undefined
  return {status, code}
}

export function classifyLawReferenceEditorError(error: unknown): 'revision_conflict' | 'source_not_editable' | 'other' {
  const {status, code} = errorDetails(error)
  if (status === 409 && code === 'law_reference_editor_revision_conflict') return 'revision_conflict'
  if (status === 409 && code === 'law_reference_editor_source_not_editable') return 'source_not_editable'
  return 'other'
}

export async function loadLawReferenceEditor(input: {questionType: ExamQuestionType, questionId: number, request: Request, signal?: AbortSignal}) {
  const response = await input.request({method: 'GET', url: lawReferenceEditorUrl(input.questionType, input.questionId), signal: input.signal})
  return parseLawReferenceEditorResponse(response.data)
}

export async function saveLawReferenceEditor(input: {questionType: ExamQuestionType, questionId: number, expectedRevision: string, items: ReplaceItem[], request: Request}): Promise<{kind: 'saved', response: LawReferenceEditorResponse} | {kind: 'revision_conflict'} | {kind: 'source_not_editable'} | {kind: 'error'}> {
  try {
    const response = await input.request({
      method: 'PUT',
      url: lawReferenceEditorUrl(input.questionType, input.questionId),
      data: {expected_revision: input.expectedRevision, items: input.items},
      skipAuthReplay: true,
    })
    return {kind: 'saved', response: parseLawReferenceEditorResponse(response.data)}
  } catch (error) {
    const kind = classifyLawReferenceEditorError(error)
    if (kind === 'revision_conflict') return {kind}
    if (kind === 'source_not_editable') return {kind}
    return {kind: 'error'}
  }
}

export function createEditorRequestGuard() {
  let owner = ''
  let generation = 0
  let saving = false
  return {
    begin(nextOwner: string) {
      if (owner !== nextOwner) saving = false
      owner = nextOwner
      generation += 1
      return generation
    },
    isCurrent(candidateOwner: string, candidateGeneration: number) { return owner === candidateOwner && generation === candidateGeneration },
    tryBeginSave(nextOwner: string) {
      if (saving && owner === nextOwner) return null
      if (owner !== nextOwner) saving = false
      owner = nextOwner
      generation += 1
      saving = true
      return generation
    },
    endSave(candidateOwner: string, candidateGeneration: number) {
      if (owner !== candidateOwner || generation !== candidateGeneration) return false
      saving = false
      return true
    },
  }
}
