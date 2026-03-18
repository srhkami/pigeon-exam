import {SelectQuestionData, SelectCardConfig} from "@/types/exam-types.ts";
import {FaEdit, FaRegStickyNote} from "react-icons/fa";
import ArticleLink from "@/features/Link/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Link/FileLink/FileLink.tsx";
import {Badge, Button, RichTextShow} from "@/component";
import {QsCard, QsCardOptionLabel, QsCardSource, QsCardTitle} from "@/features/Select/for-user/Question/QsCardBase.tsx";
import {useState} from "react";
import SelectEdit from "@/features/Select/for-manager/Manage/Edit/SelectEdit.tsx";

type Props = {
  readonly q: SelectQuestionData,
  readonly a: Array<number | null>,
  readonly i: number,
  readonly config?: SelectCardConfig,
  readonly onRefetch?: ()=>void,
}

/**
 * 顯示選擇題結果的卡片
 * @param q 選擇題的物件
 * @param a 使用者答案
 * @param i 索引值
 * @param config 卡片設定
 * @param onRefetch 重新整理的函數
 * @constructor
 */
export default function QsCardForEdit({q, a, i, config, onRefetch}: Props) {

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const title = q.question.length > 35 ? q.question.slice(0, 35) + "..." : q.question

  if (isEdit && onRefetch !== undefined) {
    return (
      <div className="hover:bg-base-200 card-border border-2 border-error rounded-xl my-1 relative p-2">
        <SelectEdit obj={q} onRefetch={onRefetch} setIsEdit={setIsEdit}/>
      </div>
    )
  }

  return (
    <QsCard is_correct={a.length !== 0 && q.answer[0] === a[0]}>
      {/*編輯按鈕*/}
      {onRefetch !== undefined &&
        <Button className='absolute top-1 right-1' size='sm' shape='circle'
                onClick={() => setIsEdit(true)}>
          <FaEdit/>
        </Button>
      }
      <QsCardTitle i={i} title={config?.showOptions ? q.question : title}/>
      {
        config?.showOptions &&
        <>
          <form className='pl-2'>
            {q.options.map((item, i_) => {
              return (
                <div className='flex my-1' key={item}>
                  <input type="radio" id={item} value={i_} className="radio radio-primary radio-sm"
                         disabled checked={a[0] === i_}/>
                  <QsCardOptionLabel item={item} is_correct={i_ === q.answer[0]}/>
                </div>
              )
            })}
          </form>
          <QsCardSource q={q}/>
        </>
      }
      {
        (config?.showRating || config?.showLinks || config?.showComment) &&
        <div className='divider m-0'></div>
      }
      {
        config?.showRating &&
        <div className='flex'>
          {/*<QuestionRating right_count={q.right_count} total_count={q.total_count}/>*/}
        </div>
      }
      {
        config?.showLinks &&
        <div>
          <ArticleLink articleLink={q.article_link}/>
          <FileLink fileLink={q.file_link}/>
        </div>
      }
      {
        (config?.showComment && q.comment) &&
        <div className='mt-1'>
          <Badge color='info'><FaRegStickyNote/>註解</Badge>
          <RichTextShow jsonContent={q.comment}/>
        </div>
      }
    </QsCard>
  )
}