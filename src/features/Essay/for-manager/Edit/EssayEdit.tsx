import {useAuth, useAxios} from "@/hooks";
import {Dispatch, SetStateAction, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ExamEssayData, ExamEssayForm} from "@/types/exam-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {showFormError, showToast} from "@/func";
import {Button, Col, FormInputCol, ModalTextEditor, Row} from "@/component";
import {FaSave} from "react-icons/fa";
import {PageHeader} from "@/layout";
import {HiXMark} from "react-icons/hi2";
import {JSONContent} from "@tiptap/react";
import ArticleLinkEdit from "@/features/Link/ArticleLink/ArticleLinkEdit.tsx";
import FileLinkEdit from "@/features/Link/FileLink/FileLinkEdit.tsx";
import {HappyFileLink} from "@/types/happywork-types.ts";

type Props = {
  readonly obj?: ExamEssayData,
  readonly onRefetch: ()=>void,
  readonly setIsEdit?: Dispatch<SetStateAction<boolean>>,
}

export default function EssayEdit({obj, onRefetch, setIsEdit}: Props) {

  const api = useAxios();
  const {userInfo} = useAuth();

  const [articleLink, setArticleLink] = useState<Array<[string, string]>>(obj ? obj.article_link : []); // 關聯法條
  const [fileLink, setFileLink] = useState<Array<HappyFileLink>>(obj ? obj.file_link : []); // 關聯檔案
  const [sample, setSample] = useState<JSONContent | null>(obj?.sample_answer ?? null); // 註釋

  const {
    register, handleSubmit, setError, setValue,
    formState: {
      errors,  // 錯誤內容
    }
  } = useForm<ExamEssayForm>({
    // 設定每當欄位改變後重新校驗
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: obj,
  });

  const onSubmit: SubmitHandler<ExamEssayForm> = (formData) => {
    formData['sample_answer'] = sample;
    formData['article_link'] = articleLink;
    formData['file_link'] = fileLink;
    if (obj) {
      showToast(
        api({
          method: 'PATCH',
          url: POLICE_API + '/exam_essay/' + obj.id + '/',
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
          url: POLICE_API + '/exam_essay/',
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

  const onClose = () => {
    if (setIsEdit !== undefined) {
      setIsEdit(false);
    }
  }

  return (
    <Row>
      {obj &&
        <Col xs={12}>
          <PageHeader title={'編輯申論題 ' + obj.id} as='h4' divider={false}/>
        </Col>
      }
      <FormInputCol xs={12} label='是否公開*' error={errors.is_public?.message}>
        <input type='checkbox' className='toggle toggle-sm checked:bg-success bg-error'
               {...register('is_public')}/>
      </FormInputCol>
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