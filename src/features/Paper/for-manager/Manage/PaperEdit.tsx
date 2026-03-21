import {
  Collapse,
  CollapseContent,
  CollapseTitle,
  DnDList,
  DnDListItem,
  FabAction,
  FloatingActionButton,
  FormInputCol,
  Row
} from "@/component";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {RiEdit2Fill} from "react-icons/ri";
import {FaSave} from "react-icons/fa";
import {useAxios} from "@/hooks";
import {useNavigate, useParams} from "react-router";
import {PaperData, PaperEditForm, SelectQuestionSimpleData} from "@/types/exam-types.ts";
import {showToast} from "@/func";
import {EXAM_API, EXAM_API_V2} from "@/lib/config.ts";
import QsCardForView from "@/features/Select/for-manager/Question/QsCardForView.tsx";
import ModalAddSelectQuestion from "@/features/Paper/for-manager/Manage/ModalAddSelectQuestion.tsx";

/* 編輯試卷的頁面 */
export default function PaperEdit() {

  const {id} = useParams();
  const api = useAxios();
  const navi = useNavigate();
  const [selectQuestions, setSelectQuestions] = useState<Array<SelectQuestionSimpleData>>([]);
  const {register, handleSubmit, setValue, formState: {errors}} = useForm<PaperEditForm>()

  useEffect(() => {
    // 如果有傳入ID，則為編輯頁面，取得原題目
    if (id) {
      showToast(
        async () => await api<PaperData>({
          method: "GET",
          url: EXAM_API + '/papers/' + id + '/',
        })
        , {label: '載入'}
      )
        .then(res => {
          setValue('title', res.data.title);
          setValue('category', res.data.category);
          setValue('subject', res.data.subject);
          setSelectQuestions(res.data.select_questions)
        })
    }
  }, []);

  // 儲存
  const onSave: SubmitHandler<PaperEditForm> = (formData) => {
    // 將題目轉換為ID清單
    formData.select_question_ids = selectQuestions.map(q => q.id);
    formData.essay_question_ids = []; //todo: 為未來申論題做準備
    formData.id = id ? Number(id) : null
    showToast(
      api({
        method: 'POST',
        url: EXAM_API_V2 + '/paper/save',
        data: formData
      }), {label: '儲存', success: '儲存成功'}
    )
      .then(res => navi('/manage/paper/detail/' + res.data.id))
  }

  const items = selectQuestions.map((q, i) => {

    // 刪除項目
    const onDelete = () => {
      setSelectQuestions(p => p.filter((_, i_) => i !== i_))
    }

    return (
      <DnDListItem key={q.id} id={q.id} onDelete={onDelete}>
        <QsCardForView
          q={q}
          i={i}
          a={q.answer}
          config={{showOptions: true, showRating: true, showComment: false, showLinks: false}}
        />
      </DnDListItem>
    )
  })

  return (
    <>
      <div className='text-3xl font-bold mb-3 border-l-4 border-l-primary pl-4'>
        編輯試卷
      </div>
      <div className='divider'></div>
      <Collapse icon='arrow' defaultChecked>
        <CollapseTitle>
          注意事項
        </CollapseTitle>
        <CollapseContent>
          <ol className='list pl-4 italic text-sm font-semibold'>
            <li className='list-decimal pl-1 my-1'>為避免排版出錯，請盡量使用電腦版網頁編輯。</li>
            <li className='list-decimal pl-1 my-1'>請點擊右下角按鈕加入題目或暫存試卷。</li>
            <li className='list-decimal pl-1 my-1'>試卷可於「暫存」後繼續編輯；「發佈」後則無法再次修改。</li>
            <li className='list-decimal pl-1 my-1'>試卷不會主動公開，須由老師提供連結給學生填寫。</li>
          </ol>
        </CollapseContent>
      </Collapse>
      <Row>
        <FormInputCol xs={12} label='標題*' error={errors.title?.message}>
          <input className='input input-sm w-full' placeholder='請輸入此份試卷的敘述'
                 {...register('title', {required: '此欄位必填'})}/>
        </FormInputCol>
        <FormInputCol xs={12} md={6} label='類科（可留空）' error={errors.category?.message}>
          <input className='input input-sm w-full' placeholder='提供給哪個科系的學生'
                 {...register('category')}/>
        </FormInputCol>
        <FormInputCol xs={12} md={6} label='科目（可留空）' error={errors.subject?.message}>
          <input className='input input-sm w-full' placeholder='測驗哪種科目'
                 {...register('subject')}/>
        </FormInputCol>
      </Row>
      <div className='divider'></div>
      <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
        選擇題預覽 （共 {selectQuestions.length} 題）
      </div>
      <DnDList items={selectQuestions} setItems={setSelectQuestions}>
        {items}
      </DnDList>
      <FloatingActionButton
        buttonContent={<RiEdit2Fill/>}
        color='primary'
        closeButton
      >
        <FabAction color='success' label='暫存試卷' onClick={handleSubmit(onSave)}>
          <FaSave/>
        </FabAction>
        <ModalAddSelectQuestion setSelectQuestions={setSelectQuestions}/>
      </FloatingActionButton>
    </>
  )
}