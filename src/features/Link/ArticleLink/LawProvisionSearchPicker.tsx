import {useEffect, useRef, useState} from "react"
import {SubmitHandler, useForm} from "react-hook-form"
import {Button} from "@/component"
import {useAxios} from "@/hooks"
import {V3_API} from "@/lib/config.ts"
import Articles from "./Articles.tsx"
import LawDocumentFilterSelect from "./LawDocumentFilterSelect.tsx"
import {lawProvisionSearchUrl, normalizeLawProvisionHits, type LawDocumentSummary, type LawProvisionSearchHit, type PaginatedResponse} from "./lawPickerApi.ts"
import type {LawProvisionSummary} from "./lawReferenceController.ts"

type SearchForm = {query: string}

type Props = {
  readonly isOpen: boolean
  readonly selectedProvisionIds: number[]
  readonly onSelect: (provision: LawProvisionSummary) => void
}

export default function LawProvisionSearchPicker({isOpen, selectedProvisionIds, onSelect}: Props) {
  const api = useAxios()
  const [filterDocumentCode, setFilterDocumentCode] = useState('')
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState('')
  const [hits, setHits] = useState<LawProvisionSearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [error, setError] = useState('')
  const searchGeneration = useRef(0)
  const searchController = useRef<AbortController | null>(null)
  const {register, handleSubmit, reset, setFocus} = useForm<SearchForm>({defaultValues: {query: ''}})


  useEffect(() => {
    if (!isOpen) {
      searchGeneration.current += 1
      searchController.current?.abort()
      searchController.current = null
      setFilterDocumentCode('')
      setSelectedDocumentTitle('')
      setHits([])
      setLoading(false)
      setHasSearched(false)
      setError('')
      reset()
      return
    }
    const timer = window.setTimeout(() => setFocus('query'), 0)
    return () => window.clearTimeout(timer)
  }, [isOpen, reset, setFocus])

  useEffect(() => () => searchController.current?.abort(), [])

  const changeDocument = (document: LawDocumentSummary | null) => {
    searchGeneration.current += 1
    searchController.current?.abort()
    searchController.current = null
    setFilterDocumentCode(document?.document_code ?? '')
    setSelectedDocumentTitle(document?.title ?? '')
    setHits([])
    setLoading(false)
    setHasSearched(false)
    setError('')
  }

  const search: SubmitHandler<SearchForm> = ({query}) => {
    const keyword = query.trim()
    if (!keyword) {
      setError('請輸入條號或關鍵字搜尋法條')
      return
    }
    const requestGeneration = ++searchGeneration.current
    searchController.current?.abort()
    const controller = new AbortController()
    searchController.current = controller
    setLoading(true)
    setHasSearched(true)
    setError('')
    api<PaginatedResponse<LawProvisionSearchHit | LawProvisionSummary>>({
      method: 'GET',
      url: lawProvisionSearchUrl(keyword, filterDocumentCode, V3_API),
      signal: controller.signal,
    }).then((response) => {
      if (controller.signal.aborted || requestGeneration !== searchGeneration.current) return
      setHits(normalizeLawProvisionHits(response.data))
    }).catch(() => {
      if (!controller.signal.aborted && requestGeneration === searchGeneration.current) setError('搜尋法條失敗，請稍後再試。')
    }).finally(() => {
      if (!controller.signal.aborted && requestGeneration === searchGeneration.current) setLoading(false)
    })
  }

  return <form className='rounded-2xl border border-base-300 bg-base-100 p-3' onSubmit={handleSubmit(search)}>
    <LawDocumentFilterSelect
      isOpen={isOpen}
      value={filterDocumentCode}
      selectedDocumentTitle={selectedDocumentTitle}
      disabled={loading}
      onChange={changeDocument}
    />
    <div className='mt-3 flex flex-col gap-2 md:flex-row'>
      <input className='input input-bordered input-sm min-w-0 flex-1' placeholder='輸入條號、關鍵字或條文內容' disabled={loading} {...register('query')}/>
      <Button type='submit' size='sm' color='primary' disabled={loading}>{loading ? '搜尋中…' : '搜尋法條'}</Button>
    </div>
    {error ? <p role='alert' className='mt-3 text-sm text-error'>{error}</p> : null}
    {hasSearched && !loading && !error ? <div className='mt-3'><Articles hits={hits} selectedProvisionIds={selectedProvisionIds} onSelect={onSelect}/></div> : null}
  </form>
}
