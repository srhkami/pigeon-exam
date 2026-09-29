import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import toast from 'react-hot-toast'
import {FaXmark} from 'react-icons/fa6'
import {Col} from '@/component'
import {useAxios} from '@/hooks'
import {V3_API} from '@/lib/config.ts'
import LawReferenceEditorDetailDialog, {type LawReferenceEditorPreviewProvision} from './LawReferenceEditorDetailDialog.tsx'
import LawReferenceEditorPicker from './LawReferenceEditorPicker.tsx'
import {
  classifyLawReferenceEditorError,
  createEditorRequestGuard,
  draftReplacePayload,
  loadLawReferenceEditor,
  responseToDraft,
  saveLawReferenceEditor,
  type DraftItem,
  type ExamQuestionType,
  type NewProvision,
} from './lawReferenceEditorController.ts'

type Props = {
  readonly questionType: ExamQuestionType
  readonly questionId?: number
  readonly onSaved?: () => void
}

type BatchResolveResponse = {
  items?: Array<{status?: unknown, provision?: unknown}>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isPreviewProvision = (value: unknown): value is LawReferenceEditorPreviewProvision => isRecord(value)
  && typeof value.ordinal_code === 'string'
  && (value.heading === null || typeof value.heading === 'string')
  && typeof value.provision_type === 'string'
  && Array.isArray(value.structure_labels)
  && Array.isArray(value.nodes_json)
  && typeof value.md_content === 'string'

const CONFLICT_TOAST_PREFIX = 'law-reference-editor-conflict'
const provisionLabel = (documentTitle: string, ordinalCode: string, provisionType: string) =>
  `${documentTitle} 第 ${ordinalCode} ${provisionType === 'point' ? '點' : '條'}`
const label = (item: DraftItem) => item.kind === 'existing'
  ? item.item.document_title && item.item.ordinal_code && item.item.provision_type
    ? provisionLabel(item.item.document_title, item.item.ordinal_code, item.item.provision_type)
    : item.item.display_text
  : provisionLabel(item.provision.document_title, item.provision.ordinal_code, item.provision.provision_type)
const draftSignature = (items: DraftItem[]) => JSON.stringify(draftReplacePayload('revision', items).items)

export default function LawReferenceEditor({questionType, questionId, onSaved}: Props) {
  const api = useAxios()
  const [loaded, setLoaded] = useState<DraftItem[]>([])
  const [draft, setDraft] = useState<DraftItem[]>([])
  const [expectedRevision, setExpectedRevision] = useState('')
  const [loadState, setLoadState] = useState<'idle' | 'loading' | 'ready' | 'error'>(questionId ? 'loading' : 'idle')
  const [saving, setSaving] = useState(false)
  const [conflict, setConflict] = useState(false)
  const [sourceNotEditable, setSourceNotEditable] = useState(false)
  const guard = useRef(createEditorRequestGuard())
  const owner = questionId ? `${questionType}:${questionId}` : ''
  const loadAbort = useRef<AbortController | null>(null)
  const previewAbort = useRef<AbortController | null>(null)
  const previewGeneration = useRef(0)
  const [preview, setPreview] = useState<LawReferenceEditorPreviewProvision | null>(null)
  const conflictToastId = `${CONFLICT_TOAST_PREFIX}:${owner}`

  const selectedProvisionIds = useMemo(() => draft.flatMap((item) => item.kind === 'existing' && item.item.provision_id
    ? [item.item.provision_id]
    : item.kind === 'provision' ? [item.provision.id] : []), [draft])

  const load = useCallback(async (preserveDraft = false) => {
    if (!questionId) return
    loadAbort.current?.abort()
    const controller = new AbortController()
    loadAbort.current = controller
    const requestGeneration = guard.current.begin(owner)
    if (!preserveDraft) setLoadState('loading')
    try {
      const response = await loadLawReferenceEditor({
        questionType,
        questionId,
        signal: controller.signal,
        request: (config) => api({...config, url: V3_API + config.url}),
      })
      if (!guard.current.isCurrent(owner, requestGeneration)) return
      const nextDraft = responseToDraft(response)
      setLoaded(nextDraft)
      setDraft(nextDraft)
      setExpectedRevision(response.expected_revision)
      setLoadState('ready')
      setConflict(false)
      setSourceNotEditable(false)
      toast.dismiss(conflictToastId)
    } catch (error) {
      if (!guard.current.isCurrent(owner, requestGeneration)) return
      const errorKind = classifyLawReferenceEditorError(error)
      if (errorKind === 'source_not_editable') {
        setSourceNotEditable(true)
        setConflict(false)
        toast.dismiss(conflictToastId)
      }
      if (!preserveDraft) setLoadState('error')
      toast.error(errorKind === 'source_not_editable'
        ? '此題目目前不可編輯關聯法條。'
        : <div className='flex items-center gap-2'><span>關聯法條讀取失敗；草稿已保留。</span><button type='button' className='btn btn-sm' onClick={() => void load(true)}>重新讀取</button></div>)
    }
  }, [api, conflictToastId, owner, questionId, questionType])

  useEffect(() => {
    guard.current.begin(owner)
    loadAbort.current?.abort()
    previewAbort.current?.abort()
    previewGeneration.current += 1
    setSaving(false)
    setConflict(false)
    setSourceNotEditable(false)
    setPreview(null)
    setLoaded([])
    setDraft([])
    setExpectedRevision('')
    setLoadState(questionId ? 'loading' : 'idle')
    return () => {
      loadAbort.current?.abort()
      previewAbort.current?.abort()
      toast.dismiss(conflictToastId)
    }
  }, [conflictToastId, owner, questionId])

  useEffect(() => { void load(); return () => loadAbort.current?.abort() }, [load])

  const remove = (index: number) => setDraft((items) => items.filter((_, current) => current !== index))
  const dirty = draftSignature(draft) !== draftSignature(loaded)
  const add = (provision: NewProvision) => {
    if (selectedProvisionIds.includes(provision.id)) return
    setDraft((items) => [...items, {kind: 'provision', provision}])
  }

  const openPreview = async (provisionId: number | null) => {
    if (!provisionId) return
    previewAbort.current?.abort()
    const controller = new AbortController()
    previewAbort.current = controller
    const requestGeneration = ++previewGeneration.current
    try {
      const response = await api<BatchResolveResponse>({
        method: 'POST', url: V3_API + '/law/provisions/batch-resolve', data: {items: [{key: 'preview', provision_id: provisionId}]},
        signal: controller.signal,
      })
      if (controller.signal.aborted || requestGeneration !== previewGeneration.current) return
      const resolved = response.data.items?.[0]
      if (resolved?.status !== 'resolved' || !isPreviewProvision(resolved.provision)) throw new Error('缺少條文內容')
      setPreview(resolved.provision)
    } catch {
      if (!controller.signal.aborted && requestGeneration === previewGeneration.current) toast.error('條文讀取失敗，請稍後再試。')
    }
  }

  const save = async () => {
    if (!questionId || loadState !== 'ready' || !dirty || conflict || sourceNotEditable) return
    const saveGeneration = guard.current.tryBeginSave(owner)
    if (saveGeneration === null) return
    setSaving(true)
    const result = await saveLawReferenceEditor({
      questionType, questionId, expectedRevision, items: draftReplacePayload(expectedRevision, draft).items,
      request: (config) => api({...config, url: V3_API + config.url}),
    })
    if (!guard.current.endSave(owner, saveGeneration)) return
    setSaving(false)
    if (result.kind === 'saved') {
      const nextDraft = responseToDraft(result.response)
      setLoaded(nextDraft)
      setDraft(nextDraft)
      setExpectedRevision(result.response.expected_revision)
      setConflict(false)
      toast.success('關聯法條已儲存')
      onSaved?.()
    } else if (result.kind === 'revision_conflict') {
      setConflict(true)
      toast.error(<div className='flex items-center gap-2'><span>關聯已被其他人修改！</span><button type='button' className='btn btn-sm' onClick={() => void load(true)}>重新載入</button></div>, {id: conflictToastId, duration: Infinity})
    } else if (result.kind === 'source_not_editable') {
      setSourceNotEditable(true)
      toast.error('此題目目前不可編輯關聯法條。')
    } else toast.error('關聯法條儲存失敗；草稿已保留。')
  }

  if (!questionId) return <Col xs={12} className='mt-4'><p className='text-sm text-base-content/70'>請先儲存題目後，再獨立儲存關聯法條。</p></Col>
  const disabled = saving || loadState !== 'ready' || sourceNotEditable
  return <Col xs={12} className='mt-4'>
    <div className='card border border-base-300 bg-base-100'>
      <div className='card-body gap-4 p-4 sm:p-6'>
        <div className='flex items-center justify-between gap-3'>
          <h3 className='card-title text-base'>關聯法條設定</h3>
          <span className={`badge badge-sm ${saving ? 'badge-info badge-soft' : dirty ? 'badge-warning badge-soft' : 'badge-ghost'}`}>
            {saving ? '儲存中…' : dirty ? '尚未儲存' : '已儲存'}
          </span>
        </div>
        {loadState === 'ready' && !sourceNotEditable ? <LawReferenceEditorPicker selectedProvisionIds={selectedProvisionIds} disabled={disabled}
                                                                                onSelect={add} onPreview={(provision) => void openPreview(provision.id)}/> : null}
        {loadState === 'ready' ? <div>
          <h4 className='mb-1 text-sm font-bold'>已選法條（{draft.length}）</h4>
          <ul className='list' aria-label='已選法條'>{draft.map((item, index) => {
            const provisionId = item.kind === 'existing' ? item.item.provision_id : item.provision.id
            const key = item.kind === 'existing' ? item.item.reference_link_id : item.provision.id
            return <li key={key} className='list-row flex items-center gap-3 px-2 py-3'>
              <div className='flex min-w-0 flex-1 flex-wrap items-center gap-2'>
                <button className='cursor-pointer text-left text-sm leading-relaxed hover:underline focus-visible:outline-2 focus-visible:outline-primary'
                        type='button' disabled={disabled || !provisionId} onClick={() => void openPreview(provisionId)}>{label(item)}</button>
                {item.kind === 'existing' && item.item.is_current === false ? <span className='badge badge-ghost badge-xs'>舊版</span> : null}
                {item.kind === 'existing' && item.item.link_status === 'NEEDS_REVIEW' ? <span className='badge badge-warning badge-soft badge-xs'>待確認</span> : null}
                {item.kind === 'provision' ? <span className='badge badge-success badge-soft badge-xs'>待新增</span> : null}
              </div>
              <button className='btn btn-ghost btn-circle btn-sm shrink-0 text-base-content/60 hover:bg-error/10 hover:text-error'
                      type='button' disabled={disabled} aria-label={`移除${label(item)}`} onClick={() => remove(index)}>
                <FaXmark className='size-4' aria-hidden='true'/>
              </button>
            </li>
          })}</ul>
          {draft.length === 0 ? <p className='py-5 text-center text-sm opacity-60'>尚未選取法條。儲存空清單會清除本區關聯。</p> : null}
        </div> : null}
        <div className='flex flex-wrap items-center justify-end gap-3 border-t border-base-300 pt-4'>
          <div className='flex gap-2'>
            <button className='btn btn-ghost btn-sm' type='button' disabled={saving || !dirty} onClick={() => {
              if (window.confirm('放棄尚未儲存的關聯變更？')) setDraft([...loaded])
            }}>放棄變更</button>
            <button className='btn btn-primary btn-sm' type='button' disabled={disabled || !dirty || conflict} onClick={() => void save()}>
              {saving ? <span className='loading loading-spinner loading-xs'/> : null}儲存關聯法條
            </button>
          </div>
        </div>
      </div>
    </div>
    <p className='mt-2 text-xs opacity-60'>此區獨立儲存關聯，不會儲存題目的標題或內容。</p>
    <LawReferenceEditorDetailDialog provision={preview} onHide={() => setPreview(null)}/>
  </Col>
}
