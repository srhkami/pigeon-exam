import {useAuth, useAxios, useModal} from "@/hooks";
import {
  Button,
  Col,
  FabAction,
  FormInputCol,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTextEditor,
  ModalTitle,
  Row,
} from "@/component";
import {MdAddComment} from "react-icons/md";
import {EssayQuestionData, EssayQuestionForm} from "@/types/exam-types.ts";
import {FaEdit, FaSave} from "react-icons/fa";
import ArticleLinkEdit from "@/features/Link/ArticleLink/ArticleLinkEdit.tsx";
import FileLinkEdit from "@/features/Link/FileLink/FileLinkEdit.tsx";
import {useState} from "react";
import {HappyFileLink} from "@/types/happywork-types.ts";
import {JSONContent} from "@tiptap/react";
import {SubmitHandler, useForm} from "react-hook-form";
import {showFormError, showToast} from "@/func";
import {EXAM_API} from "@/lib/config.ts";

type Props = {
  readonly onRefetch: () => void,
  readonly q?: EssayQuestionData,
}

/* 新增申論題目的彈出視窗 */
export default function ModalEssayEdit({onRefetch, q}: Props) {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal();
  const {userInfo} = useAuth();

  const [articleLink, setArticleLink] = useState<Array<[string, string]>>(q ? q.article_link : []); // 關聯法條
  const [fileLink, setFileLink] = useState<Array<HappyFileLink>>(q ? q.file_link : []); // 關聯檔案
  const [sample, setSample] = useState<JSONContent | null>(q?.sample_answer ?? null); // 註釋

  const {
    register, handleSubmit, setError, setValue,
    formState: {
      errors,  // 錯誤內容
    }
  } = useForm<EssayQuestionForm>({
    // 設定每當欄位改變後重新校驗
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: q,
  });

  const onSubmit: SubmitHandler<EssayQuestionForm> = (formData) => {
    formData['sample_answer'] = sample;
    formData['article_link'] = articleLink;
    formData['file_link'] = fileLink;
    if (q) {
      showToast(
        api({
          method: 'PATCH',
          url: EXAM_API + '/essay_questions/' + q.id + '/',
          data: formData
        }), {label: '處理', success: '儲存成功'}
      )
        .then(() => {
          onRefetch();
          onHide();
        })
        .catch(err => showFormError(err, setError))
    } else {
      showToast(
        api({
          method: 'POST',
          url: EXAM_API + '/essay_questions/',
          data: {
            ...formData,
            user: userInfo.id,
          }
        }), {label: '處理', success: '新增成功'}
      )
        .then(() => {
          onRefetch();
          setValue('question', '');
        })
        .catch(err => showFormError(err, setError))
    }
  };

  return (
    <>
      {q ?
        <Button className='absolute top-1 right-1' size='sm' shape='circle'
                onClick={onShow}>
          <FaEdit/>
        </Button>
        :
        <FabAction color='primary' onClick={onShow} label='新增題目'>
          <MdAddComment className='text-xl'/>
        </FabAction>
      }
      <Modal isShow={isShow} onHide={onHide} size='xl' closeButton backdrop={false}>
        <ModalHeader>
          <ModalTitle>{q ? '編輯申論題' : '新增申論題'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <Row>
            <FormInputCol xs={6} label='出題年份*' error={errors.year?.message}>
              <input type="number" className="input input-sm w-full"
                     {...register('year', {required: true, maxLength: {value: 3, message: '字數勿大於3'}})}/>
            </FormInputCol>
            <FormInputCol xs={6} label='出處*' error={errors.source?.message}>
              <select className='select select-sm w-full' {...register('source')}>
                <option value='三等特考'>三等特考</option>
                <option value='四等特考'>四等特考</option>
                <option value='其他考試'>其他考試</option>
                <option value='老師出題'>老師出題</option>
              </select>
            </FormInputCol>
            <FormInputCol xs={6} label='類科*' error={errors.category?.message}>
              <input type="text" className="input input-sm w-full" placeholder='共同/行政/刑事等'
                     {...register('category', {maxLength: {value: 16, message: '字數勿大於16'}})}/>
            </FormInputCol>
            <FormInputCol xs={6} label='科目*' error={errors.subject?.message}>
              <input type="text" className="input input-sm w-full"
                     {...register('subject', {maxLength: {value: 16, message: '字數勿大於16'}})}/>
            </FormInputCol>
            <FormInputCol xs={12} label='題目*' error={errors.question?.message}>
              <input className="input input-sm w-full"
                     {...register('question', {required: true})}/>
            </FormInputCol>
            <Col xs={12} className='divider m-0'></Col>
            <FormInputCol xs={12} label='擬答' error={''}>
              <ModalTextEditor content={sample} setContent={setSample}/>
            </FormInputCol>
            <Col xs={12} className='divider m-0'></Col>
            <ArticleLinkEdit articleLink={articleLink} setArticleLink={setArticleLink}/>
            <FileLinkEdit fileLink={fileLink} setFileLink={setFileLink}/>
          </Row>
        </ModalBody>
        <ModalFooter>
          <label className='label'>
            <input type='checkbox' className='toggle toggle-sm checked:bg-success bg-error'
                   {...register('is_public')}/>
            是否公開
          </label>
          <Button size='sm' color='success' className='ml-auto' onClick={handleSubmit(onSubmit)}>
            <FaSave/>儲存
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}