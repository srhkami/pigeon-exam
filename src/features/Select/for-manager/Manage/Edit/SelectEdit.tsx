import {useAuth, useAxios} from "@/hooks";
import {Dispatch, SetStateAction, useState} from "react";
import {JSONContent} from "@tiptap/react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ExamSelectData, ExamSelectForm} from "@/types/exam-types.ts";
import {Button, Col, FormInputCol, ModalTextEditor, Row} from "@/component";
import {FaSave} from "react-icons/fa";
import {PageHeader} from "@/layout";
import {HiXMark} from "react-icons/hi2";
import {HappyFileLink} from "@/types/happywork-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {showFormError, showToast} from "@/func";
import SelectOptions from "@/features/Select/for-manager/Manage/Edit/SelectOptions.tsx";
import ArticleLinkEdit from "@/features/Link/ArticleLink/ArticleLinkEdit.tsx";
import FileLinkEdit from "@/features/Link/FileLink/FileLinkEdit.tsx";

type Props = {
  readonly obj?: ExamSelectData,
  readonly onRefetch: ()=>void,
  readonly setIsEdit?: Dispatch<SetStateAction<boolean>>,
}

export default function SelectEdit({obj, onRefetch, setIsEdit}: Props) {

  const api = useAxios();
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
  } = useForm<ExamSelectForm>({
    // 設定每當欄位改變後重新校驗
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: obj,
  });

  const [question] = watch(['question'])

  const onCheckRepeat = () => {
    if (question) {
      api<{ is_exist: boolean, id: number | null }>({
        method: "GET",
        url: POLICE_API + '/exam_select/is_exist/',
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

  const onSubmit: SubmitHandler<ExamSelectForm> = (formData) => {
    formData['options'] = options;
    formData['answer'] = answer;
    formData['article_link'] = articleLink;
    formData['file_link'] = fileLink;
    formData['comment'] = comment;
    if (obj) {
      showToast(
        api({
          method: 'PATCH',
          url: POLICE_API + '/exam_select/' + obj.id + '/',
          data: formData
        }), {label: '處理', success: '儲存成功'}
      )
        .then(() => {
          onRefetch();
          if (setIsEdit !== undefined) {
            setIsEdit(false);
          }
        })
        .catch(err => showFormError(err, setError))
    } else {
      showToast(
        api({
          method: 'POST',
          url: POLICE_API + '/exam_select/',
          data: {
            ...formData,
            user: userInfo.id,
          }
        }), {label: '處理', success: '新增成功'}
      )
        .then(() => {
          onRefetch();
          setValue('question', '');
          setValue('question_number', null);
          setValue('remark', '')
          setAnswer([]);
          setArticleLink([]);
          setComment(null);
        })
        .catch(err => showFormError(err, setError))
    }
  };

  const onClose = () => {
    if (setIsEdit !== undefined) {
      setIsEdit(false);
    }
  }

  return (
    <Row>
      {obj &&
        <Col xs={12}>
          <PageHeader title={'編輯題目 ' + obj.id} as='h4' divider={false}/>
        </Col>
      }
      <FormInputCol xs={6} md={4} label='是否公開*' error={errors.is_public?.message}>
        <input type='checkbox' className='toggle toggle-sm checked:bg-success bg-error'
               {...register('is_public')}/>
      </FormInputCol>
      <FormInputCol xs={6} md={4} label='出題年份*' error={errors.year?.message}>
        <input type="number" className="input input-sm w-full"
               {...register('year', {required: true, maxLength: {value: 3, message: '字數勿大於3'}})}/>
      </FormInputCol>
      <FormInputCol xs={6} md={4} label='題號*' error={errors.question_number?.message}>
        <input type="number" className="input input-sm w-full" placeholder='原試卷中的題號'
               {...register('question_number', {maxLength: {value: 16, message: '字數勿大於16'},})}/>
      </FormInputCol>
      <FormInputCol xs={6} md={4} label='出處*' error={errors.source?.message}>
        <select className='select select-sm w-full' {...register('source')}>
          <option value='三等特考'>三等特考</option>
          <option value='四等特考'>四等特考</option>
          <option value='其他考試'>其他考試</option>
          <option value='老師出題'>老師出題</option>
        </select>
      </FormInputCol>
      <FormInputCol xs={6} md={4} label='類科*' error={errors.category?.message}>
        <input type="text" className="input input-sm w-full" placeholder='共同/行政/刑事等'
               {...register('category', {maxLength: {value: 16, message: '字數勿大於16'}})}/>
      </FormInputCol>
      <FormInputCol xs={6} md={4} label='科目*' error={errors.subject?.message}>
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
      <Col xs={12} className='mt-4 flex'>
        {obj &&
        <Button size='sm' color='warning' onClick={onClose}>
          <HiXMark/>取消
        </Button>
        }
        <Button size='sm' color='success' className='ml-auto' onClick={handleSubmit(onSubmit)}>
          <FaSave/>儲存
        </Button>
      </Col>
    </Row>
  )
}