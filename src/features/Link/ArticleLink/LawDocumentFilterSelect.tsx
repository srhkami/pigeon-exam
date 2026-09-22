import {useEffect, useRef, useState} from "react"
import {useAxios} from "@/hooks"
import {V3_API} from "@/lib/config.ts"
import {lawDocumentsUrl, type LawDocumentSummary, type PaginatedResponse} from "./lawPickerApi.ts"

type Props = {
  readonly isOpen: boolean
  readonly value: string
  readonly selectedDocumentTitle: string
  readonly disabled?: boolean
  readonly onChange: (document: LawDocumentSummary | null) => void
}

export default function LawDocumentFilterSelect({isOpen, value, selectedDocumentTitle, disabled = false, onChange}: Props) {
  const api = useAxios()
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<LawDocumentSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const requestGeneration = useRef(0)
  const requestController = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!isOpen) {
      requestGeneration.current += 1
      requestController.current?.abort()
      requestController.current = null
      setLoading(false)
      setError('')
      setQuery('')
      setDocuments([])
      return
    }
    const generation = ++requestGeneration.current
    requestController.current?.abort()
    const controller = new AbortController()
    requestController.current = controller
    setLoading(true)
    setError('')
    api<PaginatedResponse<LawDocumentSummary>>({
      method: 'GET',
      url: lawDocumentsUrl(query.trim(), V3_API),
      signal: controller.signal,
    }).then((response) => {
      if (controller.signal.aborted || generation !== requestGeneration.current) return
      setDocuments(response.data.items ?? [])
    }).catch(() => {
      if (!controller.signal.aborted && generation === requestGeneration.current) setError('讀取法規篩選失敗，請稍後再試。')
    }).finally(() => {
      if (!controller.signal.aborted && generation === requestGeneration.current) setLoading(false)
    })
    return () => controller.abort()
  }, [api, isOpen, query])

  const selectedDocument = documents.find((document) => document.document_code === value)

  return <div className='grid gap-2 md:grid-cols-[1fr_1.4fr]'>
    <label className='form-control'>
      <input
        className='input input-bordered input-sm w-full'
        placeholder='搜尋法規名稱 / code'
        disabled={disabled}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </label>
    <label className='form-control'>
      <select
        className='select select-bordered select-sm w-full'
        disabled={disabled || loading}
        value={value}
        onChange={(event) => onChange(documents.find((document) => document.document_code === event.target.value) ?? null)}
      >
        <option value=''>全部法規</option>
        {value && !selectedDocument ? <option value={value}>{selectedDocumentTitle || value}</option> : null}
        {documents.map((document) => <option key={document.document_code} value={document.document_code}>{document.title}</option>)}
      </select>
    </label>
    {error ? <p role='alert' className='text-sm text-error md:col-span-2'>{error}</p> : null}
  </div>
}
