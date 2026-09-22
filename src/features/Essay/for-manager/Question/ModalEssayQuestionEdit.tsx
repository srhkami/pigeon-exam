import {useAxios, useModal} from "@/hooks"
import {Button, Col, FabAction, FormInputCol, Modal, ModalBody, ModalFooter, ModalHeader, ModalTextEditor, ModalTitle, Row} from "@/component"
import {MdAddComment} from "react-icons/md"
import {EssayQuestionData, EssayQuestionForm} from "@/types/exam-types.ts"
import {FaEdit, FaSave} from "react-icons/fa"
import ArticleLinkEdit from "@/features/Link/ArticleLink/ArticleLinkEdit.tsx"
import {useRef, useState} from "react"
import toast from "react-hot-toast"
import {JSONContent} from "@tiptap/react"
import {SubmitHandler, useForm} from "react-hook-form"
import {EXAM_API} from "@/lib/config.ts"
import {showFormError} from "@/func"
import {referenceItemsForPut, saveQuestionAndReferences, type LawReferenceItem, type LawReferenceLoadState} from "@/features/Link/ArticleLink/lawReferenceController.ts"

type Props = {readonly onRefetch: () => void, readonly q?: EssayQuestionData}

export default function ModalEssayQuestionEdit({onRefetch, q}: Props) {
  const api = useAxios()
  const {isShow, onShow, onHide} = useModal()
  const [referenceItems, setReferenceItems] = useState<LawReferenceItem[]>([])
  const [lawReferencesState, setLawReferencesState] = useState<LawReferenceLoadState>(q ? 'loading' : 'ready')
  const [pendingQuestionId, setPendingQuestionId] = useState<number | null>(null)
  const [questionUnknown, setQuestionUnknown] = useState(false)
  const [saving, setSaving] = useState(false)
  const savingRef = useRef(false)
  const [sample, setSample] = useState<JSONContent | null>(q?.sample_answer ?? null)
  const {register, handleSubmit, setError, setValue, formState: {errors}} = useForm<EssayQuestionForm>({mode: 'onBlur', reValidateMode: 'onChange', defaultValues: q})

  const save = async (formData: EssayQuestionForm, retryQuestionId?: number) => {
    if (questionUnknown) return
    const questionPayload = {...formData, sample_answer: sample} as Record<string, unknown>
    const result = await saveQuestionAndReferences({
      questionType: 'essay',
      questionUrl: q ? EXAM_API + `/essay_questions/${q.id}/` : EXAM_API + '/essay_questions/',
      questionMethod: q ? 'PATCH' : 'POST',
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
      if (q) onHide()
      else {
        setValue('question', '')
        setReferenceItems([])
        setSample(null)
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

  const runSave = (formData: EssayQuestionForm, retryQuestionId?: number) => {
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
  const onSubmit: SubmitHandler<EssayQuestionForm> = (formData) => runSave(formData)
  const retryLinks = () => runSave({}, pendingQuestionId ?? undefined)

  return <>
    {q ? <Button className='absolute top-1 right-1' size='sm' shape='circle' onClick={onShow}><FaEdit/></Button> : <FabAction color='primary' onClick={onShow} label='新增題目'><MdAddComment className='text-xl'/></FabAction>}
    <Modal isShow={isShow} onHide={onHide} size='xl' closeButton backdrop={false}>
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
        <ArticleLinkEdit questionType='essay' questionId={q?.id} items={referenceItems} onChange={setReferenceItems} onLoadStateChange={setLawReferencesState}/>
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
