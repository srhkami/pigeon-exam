import {useEffect, useMemo, useState} from "react"
import {Button, Col} from "@/component"
import {IoClose} from "react-icons/io5"
import {useAxios} from "@/hooks"
import {V3_API} from "@/lib/config.ts"
import ModalAddArticleLink from "./ModalAddArticleLink.tsx"
import {type ExamLawReference, type ExamQuestionType, type LawReferenceItem, type LawReferenceLoadState, type LawProvisionSummary} from "./lawReferenceController.ts"

type Props = {
  readonly questionType: ExamQuestionType
  readonly questionId?: number
  readonly items: LawReferenceItem[]
  readonly onChange: (items: LawReferenceItem[]) => void
  readonly onLoadStateChange: (state: LawReferenceLoadState) => void
}

const label = (item: LawReferenceItem) => {
  const provision = item.kind === 'existing' ? item.reference.target_provision : item.provision
  const documentTitle = item.kind === 'existing' ? item.reference.target_document.title : item.provision.document_title
  return `${documentTitle} 第 ${provision.ordinal_code} ${provision.provision_type === 'point' ? '點' : '條'}`
}

export default function ArticleLinkEdit({questionType, questionId, items, onChange, onLoadStateChange}: Props) {
  const api = useAxios()
  const [loading, setLoading] = useState(Boolean(questionId))
  const [error, setError] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!questionId) {
      onLoadStateChange('ready')
      return
    }
    const controller = new AbortController()
    let generation = 0
    const requestGeneration = ++generation
    setLoading(true)
    setError('')
    onLoadStateChange('loading')
    api<{items: ExamLawReference[]}>({
      method: 'GET',
      url: V3_API + `/exam/questions/${questionType}/${questionId}/law-references`,
      signal: controller.signal,
    }).then((response) => {
      if (controller.signal.aborted || requestGeneration !== generation) return
      onChange(response.data.items.map((reference) => ({kind: 'existing', reference})))
      onLoadStateChange('ready')
    }).catch(() => {
      if (!controller.signal.aborted && requestGeneration === generation) {
        setError('既有關聯法條讀取失敗，請重新讀取後再試。')
        onLoadStateChange('error')
      }
    }).finally(() => {
      if (!controller.signal.aborted && requestGeneration === generation) setLoading(false)
    })
    return () => {
      generation += 1
      controller.abort()
    }
  }, [api, onChange, onLoadStateChange, questionId, questionType, reloadToken])

  const selectedProvisionIds = useMemo(() => items.map((item) => item.kind === 'existing' ? item.reference.target_provision.id : item.provision.id), [items])
  const select = (provision: LawProvisionSummary) => {
    if (selectedProvisionIds.includes(provision.id)) return
    onChange([...items, {kind: 'provision', provision}])
  }
  const remove = (index: number) => onChange(items.filter((_, current) => current !== index))

  return <Col xs={12} className='mt-4'>
    <div className='flex gap-2 items-center'>
      <span className='label text-sm'>關聯法條</span>
      {!loading && !error ? <ModalAddArticleLink selectedProvisionIds={selectedProvisionIds} onSelect={select}/> : null}
    </div>
    {loading ? <p className='mt-2 text-sm text-base-content/70'>既有關聯法條載入中...</p> : null}
    {error ? <div className='mt-2 flex items-center gap-2'>
      <p role='alert' className='text-sm text-error'>{error}</p>
      <Button type='button' size='xs' onClick={() => setReloadToken((value) => value + 1)}>重新讀取</Button>
    </div> : null}
    {!loading && !error && items.length === 0 ? <p className='mt-2 text-sm text-base-content/70'>尚未設定關聯法條</p> : null}
    {!loading && !error ? <div className='mt-2'>
      {items.map((item, index) => <Button key={item.kind === 'existing' ? item.reference.id : item.provision.id} type='button' size='xs' color='accent' className='mr-1 mb-1 rounded-4xl' onClick={() => remove(index)}>
        <IoClose className='i-12'/>{label(item)}
      </Button>)}
    </div> : null}
  </Col>
}
