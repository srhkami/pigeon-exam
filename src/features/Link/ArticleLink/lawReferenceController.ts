export type ExamQuestionType = 'select' | 'essay'

export type ExamLawReference = {
  id: number
  source_index: number
  target_document: {id: number, document_code: string, title: string}
  target_document_version_id: number
  target_provision: {
    id: number
    provision_type: 'article' | 'point' | string
    ordinal_code: string
    heading: string | null
    md_content?: string | null
    nodes_json?: unknown
  }
}

export type LawProvisionSummary = {
  id: number
  document_title: string
  document_code?: string
  provision_type: 'article' | 'point' | string
  ordinal_code: string
  heading?: string | null
  md_content?: string | null
}

export type LawReferenceItem =
  | {kind: 'existing', reference: ExamLawReference}
  | {kind: 'provision', provision: LawProvisionSummary}

export type LawReferencePutItem = {reference_link_id: number} | {provision_id: number}
export type LawReferenceLoadState = 'loading' | 'ready' | 'error'

type RequestConfig = {
  method: 'POST' | 'PATCH' | 'PUT'
  url: string
  data: unknown
}

type Request = (config: RequestConfig) => Promise<{data: unknown}>

type SaveQuestionAndReferencesInput = {
  questionType: ExamQuestionType
  questionUrl: string
  questionMethod: 'POST' | 'PATCH'
  questionPayload: Record<string, unknown>
  referenceItems: LawReferencePutItem[]
  request: Request
  retryQuestionId?: number
  questionOutcomeUnknown?: boolean
}

export type SaveQuestionAndReferencesResult =
  | {kind: 'saved', questionId: number}
  | {kind: 'links_failed', questionId: number}
  | {kind: 'question_unknown'}

export function examLawReferencesUrl(questionType: ExamQuestionType, questionId: number) {
  return `/v3/exam/questions/${questionType}/${questionId}/law-references`
}

export function buildQuestionPayload<T extends Record<string, unknown>>(payload: T): Omit<T, 'article_link' | 'file_link'> {
  const questionPayload = {...payload}
  delete questionPayload.article_link
  // 表單預設值可能含舊檔案關聯；省略欄位，避免編輯時覆寫或清空資料。
  delete questionPayload.file_link
  return questionPayload
}

export function referenceItemsForPut(items: LawReferenceItem[]): LawReferencePutItem[] {
  const seenProvisionIds = new Set<number>()
  const seenReferenceIds = new Set<number>()
  const result: LawReferencePutItem[] = []
  items.forEach((item) => {
    if (item.kind === 'existing') {
      const provisionId = item.reference.target_provision.id
      if (seenReferenceIds.has(item.reference.id) || seenProvisionIds.has(provisionId)) return
      seenReferenceIds.add(item.reference.id)
      seenProvisionIds.add(provisionId)
      result.push({reference_link_id: item.reference.id})
      return
    }
    if (seenProvisionIds.has(item.provision.id)) return
    seenProvisionIds.add(item.provision.id)
    result.push({provision_id: item.provision.id})
  })
  return result
}

function questionIdFromResponse(data: unknown): number | null {
  if (!data || typeof data !== 'object') return null
  const id = (data as {id?: unknown}).id
  return typeof id === 'number' && Number.isSafeInteger(id) && id > 0 ? id : null
}

function hasHttpResponse(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'response' in error && (error as {response?: unknown}).response)
}

export async function saveQuestionAndReferences(input: SaveQuestionAndReferencesInput): Promise<SaveQuestionAndReferencesResult> {
  if (input.questionOutcomeUnknown) return {kind: 'question_unknown'}

  let questionId: number | null = input.retryQuestionId ?? null
  if (!questionId) {
    try {
      const response = await input.request({
        method: input.questionMethod,
        url: input.questionUrl,
        data: buildQuestionPayload(input.questionPayload),
      })
      questionId = input.questionMethod === 'POST' ? questionIdFromResponse(response.data) : null
      if (input.questionMethod === 'PATCH') {
        const parsedId = Number(input.questionUrl.match(/\/(\d+)\/?$/)?.[1])
        questionId = Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null
      }
      if (!questionId) return {kind: 'question_unknown'}
    } catch (error) {
      if (hasHttpResponse(error)) throw error
      return {kind: 'question_unknown'}
    }
  }

  try {
    await input.request({
      method: 'PUT',
      url: examLawReferencesUrl(input.questionType, questionId),
      data: {items: input.referenceItems},
    })
    return {kind: 'saved', questionId}
  } catch {
    return {kind: 'links_failed', questionId}
  }
}
