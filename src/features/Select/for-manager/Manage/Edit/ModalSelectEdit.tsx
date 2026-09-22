import {useAxios, useModal} from "@/hooks"
import {Button, Col, FabAction, FormInputCol, Modal, ModalBody, ModalFooter, ModalHeader, ModalTextEditor, ModalTitle, Row} from "@/component"
import {MdAddComment} from "react-icons/md"
import {SelectQuestionData, SelectQuestionForm} from "@/types/exam-types.ts"
import {FaEdit, FaSave} from "react-icons/fa"
import ArticleLinkEdit from "@/features/Link/ArticleLink/ArticleLinkEdit.tsx"
import FileLinkEdit from "@/features/Link/FileLink/FileLinkEdit.tsx"
import {SubmitHandler, useForm} from "react-hook-form"
import {EXAM_API} from "@/lib/config.ts"
import {showFormError} from "@/func"
import {useRef, useState} from "react"
import toast from "react-hot-toast"
import {HappyFileLink} from "@/types/happywork-types.ts"
import {JSONContent} from "@tiptap/react"
import SelectOptions from "./SelectOptions.tsx"
import {referenceItemsForPut, saveQuestionAndReferences, type LawReferenceItem, type LawReferenceLoadState} from "@/features/Link/ArticleLink/lawReferenceController.ts"

type Props = {readonly obj?: SelectQuestionData, readonly onRefetch: () => void}

export default function ModalSelectEdit({obj, onRefetch}: Props) {
  const api = useAxios()
  const {isShow, onShow, onHide} = useModal()
  const [options, setOptions] = useState<Array<string>>(obj ? obj.options : [])
  const [answer, setAnswer] = useState<Array<number>>(obj ? obj.answer : [])
  const [referenceItems, setReferenceItems] = useState<LawReferenceItem[]>([])
  const [lawReferencesState, setLawReferencesState] = useState<LawReferenceLoadState>(obj ? 'loading' : 'ready')
  const [pendingQuestionId, setPendingQuestionId] = useState<number | null>(null)
  const [questionUnknown, setQuestionUnknown] = useState(false)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [fileLink, setFileLink] = useState<Array<HappyFileLink>>(obj ? obj.file_link : [])
  const [comment, setComment] = useState<JSONContent | null>(obj?.comment ?? null)
  const {register, handleSubmit, setError, setValue, watch, formState: {errors}} = useForm<SelectQuestionForm>({mode: 'onBlur', reValidateMode: 'onChange', defaultValues: obj})
  const [question] = watch(['question'])

  const onCheckRepeat = () => {
    if (question && !obj) api<{is_exist: boolean}>({method: 'GET', url: EXAM_API + '/select_questions/is_exist/', params: {search: question}}).then((res) => {
      if (res.data.is_exist) setError('question', {message: '存在重複題目的考古題'})
    })
  }

  const save = async (formData: SelectQuestionForm, retryQuestionId?: number) => {
    if (questionUnknown) return
    const questionPayload = {...formData, options, answer, file_link: fileLink, comment} as Record<string, unknown>
    const result = await saveQuestionAndReferences({
      questionType: 'select',
      questionUrl: obj ? EXAM_API + `/select_questions/${obj.id}/` : EXAM_API + '/select_questions/',
      questionMethod: obj ? 'PATCH' : 'POST',
      questionPayload,
      referenceItems: referenceItemsForPut(referenceItems),
      retryQuestionId,
      questionOutcomeUnknown: questionUnknown,
      request: (config) => api(config),
    })
    if (result.kind === 'saved') {
      toast.success('儲存成功')
      setPendingQuestionId(null)
      onRefetch()
      if (obj) onHide()
      else {
        setValue('question', '')
        setValue('remark', '')
        setAnswer([])
        setReferenceItems([])
        setComment(null)
      }
      return
    }
    if (result.kind === 'links_failed') {
      setPendingQuestionId(result.questionId)
      toast.error('題目已儲存，關聯法條尚未儲存')
      return
    }
    if (result.kind === 'question_unknown') {
      setQuestionUnknown(true)
      onRefetch()
      toast.error('題目建立結果未知，請先確認是否已建立後再試。')
      return
    }
    toast.error('儲存失敗，請稍後再試。')
  }

  const runSave = (formData: SelectQuestionForm, retryQuestionId?: number) => {
    if (saving) return
    if (savingRef.current) return
    savingRef.current = true
    setSaving(true)
    void save(formData, retryQuestionId)
      .catch((error) => showFormError(error, setError))
      .finally(() => {
        savingRef.current = false
        setSaving(false)
      })
  }
  const onSubmit: SubmitHandler<SelectQuestionForm> = (formData) => runSave(formData)
  const retryLinks = () => runSave({}, pendingQuestionId ?? undefined)

  return <>
    {obj ? <Button className='absolute top-1 right-1' size='sm' shape='circle' onClick={onShow}><FaEdit/></Button> : <FabAction color='primary' onClick={onShow} label='新增題目'><MdAddComment className='text-xl'/></FabAction>}
    <Modal isShow={isShow} onHide={onHide} size='xl' closeButton backdrop={false}>
      <ModalHeader><ModalTitle>{obj ? '編輯選擇題' : '新增選擇題'}</ModalTitle></ModalHeader>
      <ModalBody><Row>
        <FormInputCol xs={6} label='出題年份*' error={errors.year?.message}><input type='number' className='input input-sm w-full' {...register('year', {required: true, maxLength: {value: 3, message: '字數勿大於3'}})}/></FormInputCol>
        <FormInputCol xs={6} label='出處*' error={errors.source?.message}><select className='select select-sm w-full' {...register('source')}><option value='三等特考'>三等特考</option><option value='四等特考'>四等特考</option><option value='其他考試'>其他考試</option><option value='老師出題'>老師出題</option></select></FormInputCol>
        <FormInputCol xs={6} label='類科*' error={errors.category?.message}><input type='text' className='input input-sm w-full' placeholder='共同/行政/刑事等' {...register('category', {maxLength: {value: 16, message: '字數勿大於16'}})}/></FormInputCol>
        <FormInputCol xs={6} label='科目*' error={errors.subject?.message}><input type='text' className='input input-sm w-full' {...register('subject', {maxLength: {value: 16, message: '字數勿大於16'}})}/></FormInputCol>
        <FormInputCol xs={12} label='題目*' error={errors.question?.message}><input className='input input-sm w-full' {...register('question', {required: true, onBlur: onCheckRepeat})}/></FormInputCol>
        <Col xs={12}><SelectOptions options={options} setOptions={setOptions} answer={answer} setAnswer={setAnswer}/></Col>
        <ArticleLinkEdit questionType='select' questionId={obj?.id} items={referenceItems} onChange={setReferenceItems} onLoadStateChange={setLawReferencesState}/>
        <FileLinkEdit fileLink={fileLink} setFileLink={setFileLink}/>
        <Col xs={12} className='divider m-0'></Col>
        <FormInputCol xs={12} label='註解（提供學生檢視）' error={errors.remark?.message}><ModalTextEditor content={comment} setContent={setComment}/></FormInputCol>
        <FormInputCol xs={12} label='管理員筆記' error={errors.remark?.message}><textarea className='textarea textarea-sm w-full' {...register('remark')}/></FormInputCol>
      </Row></ModalBody>
      <ModalFooter>
        <label className='label'><input type='checkbox' className='toggle toggle-sm checked:bg-success bg-error' {...register('is_public')}/>是否公開</label>
        {questionUnknown ? <p role='alert' className='text-sm text-error'>題目儲存結果未知；已停止重送，請先回到題目清單查證。</p> : null}
        {pendingQuestionId ? <Button size='sm' color='warning' disabled={saving} onClick={retryLinks}>重試儲存關聯法條</Button> : null}
        <Button size='sm' color='success' className='ml-auto' disabled={saving || questionUnknown || Boolean(pendingQuestionId) || lawReferencesState !== 'ready'} onClick={handleSubmit(onSubmit)}><FaSave/>儲存</Button>
      </ModalFooter>
    </Modal>
  </>
}
