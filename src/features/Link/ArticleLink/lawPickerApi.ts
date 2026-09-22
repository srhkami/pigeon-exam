import type {LawProvisionSummary} from "./lawReferenceController.ts"

export type LawDocumentSummary = {
  id: number
  document_code: string
  title: string
}

export type LawProvisionSearchHit = {
  provision: LawProvisionSummary
  search_text_preview?: string | null
}

export type PaginatedResponse<T> = {items?: T[]}

export function lawDocumentsUrl(query: string, v3Api = '/v3') {
  const params = new URLSearchParams({page: '1', page_size: '20', is_active: 'true'})
  if (query) params.set('q', query)
  return `${v3Api}/law/documents?${params.toString()}`
}

export function lawProvisionSearchUrl(query: string, documentCode: string, v3Api = '/v3') {
  const params = new URLSearchParams({page: '1', page_size: '10', q: query, active_only: 'true'})
  if (documentCode) params.set('document_code', documentCode)
  return `${v3Api}/law/search?${params.toString()}`
}

export function normalizeLawProvisionHits(response: PaginatedResponse<LawProvisionSearchHit | LawProvisionSummary>): LawProvisionSearchHit[] {
  return (response.items ?? []).map((item) => (
    'provision' in item ? item : {provision: item, search_text_preview: item.md_content ?? ''}
  ))
}
