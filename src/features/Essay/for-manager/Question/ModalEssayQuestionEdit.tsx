import {useAxios, useModal} from "@/hooks"
import {Button, Col, FabAction, FormInputCol, Modal, ModalBody, ModalFooter, ModalHeader, ModalTextEditor, ModalTitle, Row} from "@/component"
import {MdAddComment} from "react-icons/md"
import {EssayQuestionData, EssayQuestionForm} from "@/types/exam-types.ts"
import {FaEdit, FaSave} from "react-icons/fa"
import {useRef, useState} from "react"
import toast from "react-hot-toast"
import {JSONContent} from "@tiptap/react"
import {SubmitHandler, useForm} from "react-hook-form"
import {EXAM_API} from "@/lib/config.ts"
import {showFormError} from "@/func"
import LawReferenceEditor from "@/features/LawReferenceEditor/LawReferenceEditor.tsx"
import {buildQuestionPayload} from "@/features/LawReferenceEditor/lawReferenceEditorController.ts"

type Props = {readonly onRefetch: () => void, readonly q?: EssayQuestionData}

function createdId(value: unknown): number | null {
  return value && typeof value === 'object' && typeof (value as {id?: unknown}).id === 'number' && Number.isSafeInteger((value as {id: number}).id) && (value as {id: number}).id > 0 ? (value as {id: number}).id : null
}

function hasHttpResponse(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'response' in error && (error as {response?: unknown}).response)
}

export default function ModalEssayQuestionEdit({onRefetch, q}: Props) {
  const api = useAxios()
  const {isShow, onShow, onHide} = useModal()
  const [createdQuestionId, setCreatedQuestionId] = useState<number | null>(null)
  const [questionUnknown, setQuestionUnknown] = useState(false)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [sample, setSample] = useState<JSONContent | null>(q?.sample_answer ?? null)
  const {register, handleSubmit, reset, setError, formState: {errors}} = useForm<EssayQuestionForm>({mode: 'onBlur', reValidateMode: 'onChange', defaultValues: q})
  const questionId = q?.id ?? createdQuestionId ?? undefined

  const save = async (formData: EssayQuestionForm) => {
    if (questionUnknown) return
    const creating = !questionId
    try {
      const response = await api({
        method: creating ? 'POST' : 'PATCH',
        url: creating ? EXAM_API + '/essay_questions/' : EXAM_API + `/essay_questions/${questionId}/`,
        data: buildQuestionPayload({...formData, sample_answer: sample} as Record<string, unknown>),
      })
      if (creating) {
        const id = createdId(response.data)
        if (!id) throw new Error('題目建立結果無法辨識')
        setCreatedQuestionId(id)
        toast.success('題目已儲存；可另外儲存關聯法條。')
      } else {
        toast.success('題目已儲存')
      }
      onRefetch()
    } catch (error) {
      if (!hasHttpResponse(error)) {
        setQuestionUnknown(true)
        onRefetch()
        toast.error('題目儲存結果未知，已停止重送；請重新整理後確認。')
        return
      }
      throw error
    }
  }

  const runSave = (formData: EssayQuestionForm) => {
    if (saving || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    void save(formData).catch((error) => showFormError(error, setError)).finally(() => {
      savingRef.current = false
      setSaving(false)
    })
  }
  const onSubmit: SubmitHandler<EssayQuestionForm> = (formData) => runSave(formData)
  const close = () => {
    if (savingRef.current) return
    if (!q) {
      reset()
      setSample(null)
      setCreatedQuestionId(null)
      setQuestionUnknown(false)
    }
    onHide()
  }

  return <>
    {q ? <Button className='absolute top-1 right-1' size='sm' shape='circle' onClick={onShow}><FaEdit/></Button> : <FabAction color='primary' onClick={onShow} label='新增題目'><MdAddComment className='text-xl'/></FabAction>}
    <Modal isShow={isShow} onHide={close} size='xl' closeButton={!saving} backdrop={false}>
      <ModalHeader><ModalTitle>{q ? '編輯申論題' : '新增申論題'}</ModalTitle></ModalHeader>
      <ModalBody><Row>
        <FormInputCol xs={6} label='出題年份*' error={errors.year?.message}><input type='number' className='input input-sm w-full' {...register('year', {required: true, maxLength: {value: 3, message: '字數勿大於3'}})}/></FormInputCol>
        <FormInputCol xs={6} label='出處*' error={errors.source?.message}><select className='select select-sm w-full' {...register('source')}><option value='三等特考'>三等特考</option><option value='四等特考'>四等特考</option><option value='其他考試'>其他考試</option><option value='老師出題'>老師出題</option></select></FormInputCol>
        <FormInputCol xs={6} label='類科*' error={errors.category?.message}><input type='text' className='input input-sm w-full' placeholder='共同/行政/刑事等' {...register('category', {maxLength: {value: 16, message: '字數勿大於16'}})}/></FormInputCol>
        <FormInputCol xs={6} label='科目*' error={errors.subject?.message}><input type='text' className='input input-sm w-full' {...register('subject', {maxLength: {value: 16, message: '字數勿大於16'}})}/></FormInputCol>
        <FormInputCol xs={12} label='題目*' error={errors.question?.message}><input className='input input-sm w-full' {...register('question', {required: true})}/></FormInputCol>
        <Col xs={12} className='divider m-0'></Col>
        <FormInputCol xs={12} label='擬答' error=''><ModalTextEditor content={sample} setContent={setSample}/></FormInputCol>
        <Col xs={12} className='divider m-0'></Col>
        <LawReferenceEditor questionType='essay' questionId={questionId} onSaved={onRefetch}/>
      </Row></ModalBody>
      <ModalFooter>
        <label className='label'><input type='checkbox' className='toggle toggle-sm checked:bg-success bg-error' {...register('is_public')}/>是否公開</label>
        {questionUnknown ? <p role='alert' className='text-sm text-error'>題目儲存結果未知；已停止重送，請先回到題目清單查證。</p> : null}
        <Button size='sm' color='success' className='ml-auto' disabled={saving || questionUnknown} onClick={handleSubmit(onSubmit)}><FaSave/>儲存題目</Button>
      </ModalFooter>
    </Modal>
  </>
}
