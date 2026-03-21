import {SelectCardConfig, SelectQuestionSimpleData} from "@/types/exam-types.ts";
import {FaRegStickyNote} from "react-icons/fa";
import ArticleLink from "@/features/Link/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Link/FileLink/FileLink.tsx";
import {Badge, RichTextShow} from "@/component";
import {QsCard, QsCardOptionLabel, QsCardSource, QsCardTitle} from "@/features/Select/for-user/Question/QsCardBase.tsx";
import {QuestionRating} from "@/features";

type Props = {
  readonly q: SelectQuestionSimpleData,
  readonly a: Array<number | null>,
  readonly i: number,
  readonly config?: SelectCardConfig,
}

/**
 * 選擇題卡片 - 用來提供管理員預覽
 * @param q 選擇題的物件
 * @param a 使用者答案
 * @param record 紀錄物件
 * @param i 索引值
 * @param config 卡片設定
 * @constructor
 */
export default function QsCardForView({q,a, i, config}: Props) {

  const title = q.question.length > 35 ? q.question.slice(0, 35) + "..." : q.question

  return (
    <QsCard is_correct={a.length !== 0 && q.answer[0] === a[0]}>
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
        <div className='flex justify-between'>
          <QuestionRating correct_count={q.correct_count} total_count={q.record_count}/>
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