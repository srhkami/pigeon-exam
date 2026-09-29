import {useAxios, useModal} from "@/hooks"
import {Button, Col, FabAction, FormInputCol, Modal, ModalBody, ModalFooter, ModalHeader, ModalTextEditor, ModalTitle, Row} from "@/component"
import {MdAddComment} from "react-icons/md"
import {SelectQuestionData, SelectQuestionForm} from "@/types/exam-types.ts"
import {FaEdit, FaSave} from "react-icons/fa"
import {SubmitHandler, useForm} from "react-hook-form"
import {EXAM_API} from "@/lib/config.ts"
import {showFormError} from "@/func"
import {useRef, useState} from "react"
import toast from "react-hot-toast"
import {JSONContent} from "@tiptap/react"
import SelectOptions from "./SelectOptions.tsx"
import LawReferenceEditor from "@/features/LawReferenceEditor/LawReferenceEditor.tsx"
import {buildQuestionPayload} from "@/features/LawReferenceEditor/lawReferenceEditorController.ts"

type Props = {readonly obj?: SelectQuestionData, readonly onRefetch: () => void}

function createdId(value: unknown): number | null {
  return value && typeof value === 'object' && typeof (value as {id?: unknown}).id === 'number' && Number.isSafeInteger((value as {id: number}).id) && (value as {id: number}).id > 0 ? (value as {id: number}).id : null
}

function hasHttpResponse(error: unknown) {
  return Boolean(error && typeof error === 'object' && 'response' in error && (error as {response?: unknown}).response)
}

export default function ModalSelectEdit({obj, onRefetch}: Props) {
  const api = useAxios()
  const {isShow, onShow, onHide} = useModal()
  const [options, setOptions] = useState<Array<string>>(obj ? obj.options : [])
  const [answer, setAnswer] = useState<Array<number>>(obj ? obj.answer : [])
  const [createdQuestionId, setCreatedQuestionId] = useState<number | null>(null)
  const [questionUnknown, setQuestionUnknown] = useState(false)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [comment, setComment] = useState<JSONContent | null>(obj?.comment ?? null)
  const {register, handleSubmit, reset, setError, watch, formState: {errors}} = useForm<SelectQuestionForm>({mode: 'onBlur', reValidateMode: 'onChange', defaultValues: obj})
  const [question] = watch(['question'])
  const questionId = obj?.id ?? createdQuestionId ?? undefined

  const onCheckRepeat = () => {
    if (question && !obj) api<{is_exist: boolean}>({method: 'GET', url: EXAM_API + '/select_questions/is_exist/', params: {search: question}}).then((res) => {
      if (res.data.is_exist) setError('question', {message: '存在重複題目的考古題'})
    })
  }

  const save = async (formData: SelectQuestionForm) => {
    if (questionUnknown) return
    const creating = !questionId
    try {
      const response = await api({
        method: creating ? 'POST' : 'PATCH',
        url: creating ? EXAM_API + '/select_questions/' : EXAM_API + `/select_questions/${questionId}/`,
        data: buildQuestionPayload({...formData, options, answer, comment} as Record<string, unknown>),
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

  const runSave = (formData: SelectQuestionForm) => {
    if (saving || savingRef.current) return
    savingRef.current = true
    setSaving(true)
    void save(formData).catch((error) => showFormError(error, setError)).finally(() => {
      savingRef.current = false
      setSaving(false)
    })
  }
  const onSubmit: SubmitHandler<SelectQuestionForm> = (formData) => runSave(formData)
  const close = () => {
    if (savingRef.current) return
    if (!obj) {
      reset()
      setOptions([])
      setAnswer([])
      setComment(null)
      setCreatedQuestionId(null)
      setQuestionUnknown(false)
    }
    onHide()
  }

  return <>
    {obj ? <Button className='absolute top-1 right-1' size='sm' shape='circle' onClick={onShow}><FaEdit/></Button> : <FabAction color='primary' onClick={onShow} label='新增題目'><MdAddComment className='text-xl'/></FabAction>}
    <Modal isShow={isShow} onHide={close} size='xl' closeButton={!saving} backdrop={false}>
      <ModalHeader><ModalTitle>{obj ? '編輯選擇題' : '新增選擇題'}</ModalTitle></ModalHeader>
      <ModalBody><Row>
        <FormInputCol xs={6} label='出題年份*' error={errors.year?.message}><input type='number' className='input input-sm w-full' {...register('year', {required: true, maxLength: {value: 3, message: '字數勿大於3'}})}/></FormInputCol>
        <FormInputCol xs={6} label='出處*' error={errors.source?.message}><select className='select select-sm w-full' {...register('source')}><option value='三等特考'>三等特考</option><option value='四等特考'>四等特考</option><option value='其他考試'>其他考試</option><option value='老師出題'>老師出題</option></select></FormInputCol>
        <FormInputCol xs={6} label='類科*' error={errors.category?.message}><input type='text' className='input input-sm w-full' placeholder='共同/行政/刑事等' {...register('category', {maxLength: {value: 16, message: '字數勿大於16'}})}/></FormInputCol>
        <FormInputCol xs={6} label='科目*' error={errors.subject?.message}><input type='text' className='input input-sm w-full' {...register('subject', {maxLength: {value: 16, message: '字數勿大於16'}})}/></FormInputCol>
        <FormInputCol xs={12} label='題目*' error={errors.question?.message}><input className='input input-sm w-full' {...register('question', {required: true, onBlur: onCheckRepeat})}/></FormInputCol>
        <Col xs={12}><SelectOptions options={options} setOptions={setOptions} answer={answer} setAnswer={setAnswer}/></Col>
        <LawReferenceEditor questionType='select' questionId={questionId} onSaved={onRefetch}/>
        <Col xs={12} className='divider m-0'></Col>
        <FormInputCol xs={12} label='註解（提供學生檢視）' error={errors.remark?.message}><ModalTextEditor content={comment} setContent={setComment}/></FormInputCol>
        <FormInputCol xs={12} label='管理員筆記' error={errors.remark?.message}><textarea className='textarea textarea-sm w-full' {...register('remark')}/></FormInputCol>
      </Row></ModalBody>
      <ModalFooter>
        <label className='label'><input type='checkbox' className='toggle toggle-sm checked:bg-success bg-error' {...register('is_public')}/>是否公開</label>
        {questionUnknown ? <p role='alert' className='text-sm text-error'>題目儲存結果未知；已停止重送，請先回到題目清單查證。</p> : null}
        <Button size='sm' color='success' className='ml-auto' disabled={saving || questionUnknown} onClick={handleSubmit(onSubmit)}><FaSave/>儲存題目</Button>
      </ModalFooter>
    </Modal>
  </>
}
