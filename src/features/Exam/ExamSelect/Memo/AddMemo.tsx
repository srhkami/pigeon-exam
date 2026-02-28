import {useAuth, useAxios} from "@/hooks";
import {Dispatch, SetStateAction, useState} from "react";
import {Button, Col, FormInputCol, ModalTextEditor, Row} from "@/component";
import ArticleLinkEdit from "@/features/Exam/tools/ArticleLink/ArticleLinkEdit.tsx";
import FileLinkEdit from "@/features/Exam/tools/FileLink/FileLinkEdit.tsx";
import {ExamMemoForm} from "@/types/exam-types.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {showToast} from "@/utils/handleToast.ts";
import {POLICE_API} from "@/utils/config.ts";
import {HappyFileLink} from "@/types/enforcement-types.ts";
import {JSONContent} from "@tiptap/react";
import {FaPlusCircle, FaSave} from "react-icons/fa";

type Props = {
  readonly question_id: number,
  readonly setReload: Dispatch<SetStateAction<boolean>>,
}

export default function AddMemo({question_id, setReload}: Props) {

  const api = useAxios();
  const {userInfo} = useAuth();
  const [isShow, setIsShow] = useState<boolean>(false);

  const [articleLink, setArticleLink] = useState<Array<[string, string]>>([]); // 關聯法條
  const [fileLink, setFileLink] = useState<Array<HappyFileLink>>([]); // 關聯檔案
  const [comment, setComment] = useState<JSONContent | null>(null); // 註釋

  const {register, handleSubmit, formState: {errors}} = useForm<ExamMemoForm>({
    // 設定每當欄位改變後重新校驗
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit: SubmitHandler<ExamMemoForm> = (formData) => {
    formData.user = userInfo.id;
    formData.question = question_id;
    formData['article_link'] = articleLink;
    formData['file_link'] = fileLink;
    formData['comment'] = comment;
    showToast(
      api({
        url: POLICE_API + '/exam_select_memo/',
        method: "POST",
        data: formData,
      }), {success: '儲存成功', error: (err) => JSON.stringify(err.response.data)}
    ).then(() => {
      setReload(true);
      setIsShow(false);
    })
  }

  return (
    <>
      {!isShow &&
        <div className='my-2'>
          <Button size='sm' color='primary' shape='block' onClick={() => setIsShow(true)}>
            <FaPlusCircle />新增筆記
          </Button>
        </div>
      }
      {isShow &&
        <Row className='hover:bg-base-200 card-border border-2 border-error rounded-xl my-2 p-4'>
          <ArticleLinkEdit articleLink={articleLink} setArticleLink={setArticleLink}/>
          <FileLinkEdit fileLink={fileLink} setFileLink={setFileLink}/>
          <Col xs={12} className='divider m-0'></Col>
          <FormInputCol xs={12} label='註解（所有人皆可檢視）' error={errors.remark?.message}>
            <ModalTextEditor content={comment} setContent={setComment}/>
          </FormInputCol>
          <FormInputCol xs={12} label='個人備註' error={errors.remark?.message}>
              <textarea className="textarea textarea-sm w-full"
                        {...register('remark')}/>
          </FormInputCol>
          <Col xs={12} className='mt-4'>
            <Button size='sm' color='success' shape='block' onClick={handleSubmit(onSubmit)}>
              <FaSave/>儲存
            </Button>
          </Col>
        </Row>
      }
    </>
  )
}