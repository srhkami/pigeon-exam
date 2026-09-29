import {useEffect, useRef, useState, type FormEvent} from 'react'
import toast from 'react-hot-toast'
import {FaSearch} from 'react-icons/fa'
import {useAxios} from '@/hooks'
import {V3_API} from '@/lib/config.ts'
import {
  lawDocumentsUrl,
  lawProvisionSearchUrl,
  normalizeLawProvisionHits,
  type LawDocumentSummary,
  type LawProvisionSearchHit,
  type PaginatedResponse,
} from '@/features/Link/ArticleLink/lawPickerApi.ts'
import type {LawProvisionSummary} from '@/features/Link/ArticleLink/lawReferenceController.ts'
import type {NewProvision} from './lawReferenceEditorController.ts'
import LawReferenceEditorResultCard from './LawReferenceEditorResultCard.tsx'

type Props = {
  readonly selectedProvisionIds: number[]
  readonly disabled: boolean
  readonly onSelect: (provision: NewProvision) => void
  readonly onPreview: (provision: NewProvision) => void
}

export default function LawReferenceEditorPicker({selectedProvisionIds, disabled, onSelect, onPreview}: Props) {
  const api = useAxios()
  const [documentQuery, setDocumentQuery] = useState('')
  const [documents, setDocuments] = useState<LawDocumentSummary[]>([])
  const [selectedDocument, setSelectedDocument] = useState<LawDocumentSummary | null>(null)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<LawProvisionSearchHit[]>([])
  const [searching, setSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const documentGeneration = useRef(0)
  const documentController = useRef<AbortController | null>(null)
  const searchGeneration = useRef(0)
  const searchController = useRef<AbortController | null>(null)

  useEffect(() => {
    const generation = ++documentGeneration.current
    documentController.current?.abort()
    const controller = new AbortController()
    documentController.current = controller
    api<PaginatedResponse<LawDocumentSummary>>({
      method: 'GET',
      url: lawDocumentsUrl(documentQuery.trim(), V3_API),
      signal: controller.signal,
    }).then((response) => {
      if (!controller.signal.aborted && generation === documentGeneration.current) setDocuments(response.data.items ?? [])
    }).catch(() => {
      if (!controller.signal.aborted && generation === documentGeneration.current) toast.error('讀取法規名稱失敗，請稍後再試。')
    })
    return () => controller.abort()
  }, [api, documentQuery])

  useEffect(() => () => {
    documentController.current?.abort()
    searchController.current?.abort()
  }, [])

  const search = (event: FormEvent) => {
    event.preventDefault()
    const keyword = query.trim()
    if (!keyword) {
      toast.error('請輸入條號或關鍵字搜尋法條')
      return
    }
    const generation = ++searchGeneration.current
    searchController.current?.abort()
    const controller = new AbortController()
    searchController.current = controller
    setSearching(true)
    setHasSearched(true)
    api<PaginatedResponse<LawProvisionSearchHit | LawProvisionSummary>>({
      method: 'GET',
      url: lawProvisionSearchUrl(keyword, selectedDocument?.document_code ?? '', V3_API),
      signal: controller.signal,
    }).then((response) => {
      if (!controller.signal.aborted && generation === searchGeneration.current) setHits(normalizeLawProvisionHits(response.data))
    }).catch(() => {
      if (!controller.signal.aborted && generation === searchGeneration.current) toast.error('搜尋法條失敗，請稍後再試。')
    }).finally(() => {
      if (!controller.signal.aborted && generation === searchGeneration.current) setSearching(false)
    })
  }

  const selectedVisible = selectedDocument && !documents.some((document) => document.document_code === selectedDocument.document_code)
  return <form className='rounded-2xl border border-base-300 bg-base-100 p-3' onSubmit={search} aria-label='搜尋法條'>
    <div className='grid gap-2 md:grid-cols-[1fr_1.4fr]'>
      <label className='form-control min-w-0'>
        <span className='mb-1 block text-xs'>法規名稱</span>
        <input className='input input-bordered input-sm w-full' aria-label='法規名稱' placeholder='搜尋法規名稱'
               disabled={disabled} value={documentQuery} onChange={(event) => setDocumentQuery(event.target.value)}/>
      </label>
      <label className='form-control min-w-0'>
        <span className='mb-1 block text-xs'>搜尋範圍</span>
        <select className='select select-bordered select-sm w-full' aria-label='搜尋範圍' disabled={disabled}
                value={selectedDocument?.document_code ?? ''}
                onChange={(event) => setSelectedDocument(documents.find((document) => document.document_code === event.target.value) ?? null)}>
          <option value=''>全部法規</option>
          {selectedVisible ? <option value={selectedDocument.document_code}>{selectedDocument.title}</option> : null}
          {documents.map((document) => <option key={document.document_code} value={document.document_code}>{document.title}</option>)}
        </select>
      </label>
    </div>
    <div className='mt-2 grid gap-2 md:grid-cols-[1.4fr_1fr]'>
      <label className='form-control min-w-0'>
        <span className='mb-1 block text-xs'>條款關鍵字</span>
        <input className='input input-sm w-full' aria-label='條號或內容關鍵字' placeholder='輸入條號、關鍵字或條文內容'
               disabled={disabled || searching} value={query} onChange={(event) => setQuery(event.target.value)}/>
      </label>
      <div className='flex items-end justify-end'>
        <button className='btn btn-primary btn-sm' type='submit' disabled={disabled || searching}>
          <FaSearch aria-hidden='true'/>搜尋法條
        </button>
      </div>
    </div>
    <div className='mt-2 grid max-h-96 gap-2 overflow-y-auto'>
      {hits.map((hit) => <LawReferenceEditorResultCard key={hit.provision.id} hit={hit}
                                                        selected={selectedProvisionIds.includes(hit.provision.id)}
                                                        disabled={disabled} onSelect={onSelect} onPreview={onPreview}/>) }
      {hasSearched && !searching && hits.length === 0 ? <p className='py-6 text-center text-sm opacity-60'>沒有符合條件的條文，請調整搜尋條件。</p> : null}
    </div>
  </form>
}
