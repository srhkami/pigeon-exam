import {useAuth, useAxios, useModal} from "@/hooks";
import {
  Button,
  Col,
  FabAction,
  FormInputCol,
  Modal,
  ModalBody, ModalFooter,
  ModalHeader,
  ModalTextEditor,
  ModalTitle,
  Row,
} from "@/component";
import {MdAddComment} from "react-icons/md";
import {SelectQuestionData, SelectQuestionForm} from "@/types/exam-types.ts";
import {FaEdit, FaSave} from "react-icons/fa";
import SelectOptions from "@/features/Select/for-manager/Manage/Edit/SelectOptions.tsx";
import ArticleLinkEdit from "@/features/Link/ArticleLink/ArticleLinkEdit.tsx";
import FileLinkEdit from "@/features/Link/FileLink/FileLinkEdit.tsx";
import {SubmitHandler, useForm} from "react-hook-form";
import {EXAM_API} from "@/lib/config.ts";
import {showFormError, showToast} from "@/func";
import {useState} from "react";
import {HappyFileLink} from "@/types/happywork-types.ts";
import {JSONContent} from "@tiptap/react";

type Props = {
  readonly obj?: SelectQuestionData,
  readonly onRefetch: () => void,
}

/* 編輯選擇題的彈出視窗 */
export default function ModalSelectEdit({obj, onRefetch}: Props) {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal();
  const {userInfo} = useAuth();

  const [options, setOptions] = useState<Array<string>>(obj ? obj.options : []);
  const [answer, setAnswer] = useState<Array<number>>(obj ? obj.answer : []);

  const [articleLink, setArticleLink] = useState<Array<[string, string]>>(obj ? obj.article_link : []); // 關聯法條
  const [fileLink, setFileLink] = useState<Array<HappyFileLink>>(obj ? obj.file_link : []); // 關聯檔案
  const [comment, setComment] = useState<JSONContent | null>(obj?.comment ?? null); // 註釋

  const {
    register, handleSubmit, setError, setValue, watch,
    formState: {
      errors,  // 錯誤內容
    }
  } = useForm<SelectQuestionForm>({
    // 設定每當欄位改變後重新校驗
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: obj,
  });

  const [question] = watch(['question'])

  const onCheckRepeat = () => {
    if (question && !obj) {
      api<{ is_exist: boolean, id: number | null }>({
        method: "GET",
        url: EXAM_API + '/select_questions/is_exist/',
        params: {
          search: question,
        }
      }).then(res => {
        const isExist = res.data.is_exist;
        if (isExist) {
          setError('question', {message: '存在重複題目的考古題'})
        }
      })
    }
  }

  const onSubmit: SubmitHandler<SelectQuestionForm> = (formData) => {
    formData['options'] = options;
    formData['answer'] = answer;
    formData['article_link'] = articleLink;
    formData['file_link'] = fileLink;
    formData['comment'] = comment;
    if (obj) {
      showToast(
        api({
          method: 'PATCH',
          url: EXAM_API + '/select_questions/' + obj.id + '/',
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
          url: EXAM_API + '/select_questions/',
          data: {
            ...formData,
            user: userInfo.id,
          }
        }), {label: '處理', success: '新增成功'}
      )
        .then(() => {
          onRefetch();
          setValue('question', '');
          setValue('remark', '')
          setAnswer([]);
          setArticleLink([]);
          setComment(null);
        })
        .catch(err => showFormError(err, setError))
    }
  };

  return (
    <>
      {
        obj ?
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
            <ModalTitle>{obj ? '編輯選擇題' : '新增選擇題'}</ModalTitle>
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
                       {...register('question', {required: true, onBlur: onCheckRepeat})}/>
              </FormInputCol>
              <Col xs={12}>
                <SelectOptions options={options} setOptions={setOptions}
                               answer={answer} setAnswer={setAnswer}/>
              </Col>
              <ArticleLinkEdit articleLink={articleLink} setArticleLink={setArticleLink}/>
              <FileLinkEdit fileLink={fileLink} setFileLink={setFileLink}/>
              <Col xs={12} className='divider m-0'></Col>
              <FormInputCol xs={12} label='註解（提供學生檢視）' error={errors.remark?.message}>
                <ModalTextEditor content={comment} setContent={setComment}/>
              </FormInputCol>
              <FormInputCol xs={12} label='管理員筆記' error={errors.remark?.message}>
              <textarea className="textarea textarea-sm w-full"
                        {...register('remark')}/>
              </FormInputCol>
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