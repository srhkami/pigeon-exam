import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component"
import {useAxios, useModal} from "@/hooks"
import {V3_API} from "@/lib/config.ts"
import {useEffect, useRef, useState} from "react"
import {RiExternalLinkLine} from "react-icons/ri"
import LawProvisionNodes from "./LawProvisionNodes.tsx"
import type {ExamLawReference, ExamQuestionType} from "./lawReferenceController.ts"

type Props = {
  readonly questionType: ExamQuestionType
  readonly questionId: number
  readonly refreshKey?: number
}

type PreviewState =
  | {kind: 'idle'}
  | {kind: 'loading'}
  | {kind: 'success', provision: ExamLawReference['target_provision'] & {document_title?: string}}
  | {kind: 'error'}

const referenceLabel = (reference: ExamLawReference) => `${reference.target_document.title} 第 ${reference.target_provision.ordinal_code} ${reference.target_provision.provision_type === 'point' ? '點' : '條'}`

export default function ArticleLink({questionType, questionId, refreshKey = 0}: Props) {
  const api = useAxios()
  const [references, setReferences] = useState<ExamLawReference[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [selected, setSelected] = useState<ExamLawReference | null>(null)
  const [preview, setPreview] = useState<PreviewState>({kind: 'idle'})
  const {isShow, onShow, onHide} = useModal()
  const returnFocusRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let generation = 0
    const requestGeneration = ++generation
    setState('loading')
    api<{items: ExamLawReference[]}>({
      method: 'GET',
      url: V3_API + `/exam/questions/${questionType}/${questionId}/law-references`,
      signal: controller.signal,
    }).then((response) => {
      if (controller.signal.aborted || requestGeneration !== generation) return
      setReferences(response.data.items ?? [])
      setState('ready')
    }).catch(() => {
      if (controller.signal.aborted || requestGeneration !== generation) return
      setState('error')
    })
    return () => {
      generation += 1
      controller.abort()
    }
  }, [api, questionId, questionType, refreshKey])

  useEffect(() => {
    if (!selected) {
      setPreview({kind: 'idle'})
      return
    }
    let generation = 0
    const requestGeneration = ++generation
    const controller = new AbortController()
    setPreview({kind: 'loading'})
    api<{items?: Array<{provision?: PreviewState extends {kind: 'success'} ? never : unknown}>}>({
      method: 'POST',
      url: V3_API + '/law/provisions/batch-resolve',
      data: {items: [{key: 'selected', provision_id: selected.target_provision.id}]},
      signal: controller.signal,
    }).then((response) => {
      if (controller.signal.aborted || requestGeneration !== generation) return
      const resolved = response.data.items?.[0] as {provision?: ExamLawReference['target_provision'] & {document_title?: string}} | undefined
      const provision = resolved?.provision
      if (!provision || typeof provision.id !== 'number') {
        setPreview({kind: 'error'})
        return
      }
      setPreview({kind: 'success', provision})
    }).catch(() => {
      if (!controller.signal.aborted && requestGeneration === generation) setPreview({kind: 'error'})
    })
    return () => {
      generation += 1
      controller.abort()
    }
  }, [api, selected])

  const closePreview = () => {
    onHide()
    setSelected(null)
    window.setTimeout(() => returnFocusRef.current?.focus(), 0)
  }

  if (state === 'loading') return <p className='text-sm text-base-content/70'>關聯法條載入中...</p>
  if (state === 'error') return <p role='alert' className='text-sm text-error'>關聯法條讀取失敗，請稍後再試。</p>
  if (references.length === 0) return null

  return <div>
    {references.map((reference) => <Button
      key={reference.id}
      size='xs'
      color='accent'
      className='mr-1 mt-1 rounded-4xl'
      onClick={(event) => {
        returnFocusRef.current = event.currentTarget
        setSelected(reference)
        onShow()
      }}
    >
      {referenceLabel(reference)}
      <RiExternalLinkLine className='text-xs'/>
    </Button>)}
    <Modal isShow={isShow} onHide={closePreview} closeButton size='xl'>
      <ModalHeader><ModalTitle>{selected ? referenceLabel(selected) : '條文內容'}</ModalTitle></ModalHeader>
      <ModalBody>
        {preview.kind === 'loading' ? <p>條文內容載入中...</p> : null}
        {preview.kind === 'error' ? <p role='alert' className='text-error'>條文讀取失敗，請關閉後重新選擇條文。</p> : null}
        {preview.kind === 'success' ? <LawProvisionNodes nodesJson={preview.provision.nodes_json} mdContent={preview.provision.md_content}/> : null}
      </ModalBody>
    </Modal>
  </div>
}
