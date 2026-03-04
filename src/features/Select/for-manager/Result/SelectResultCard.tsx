import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {ExamSelectCardConfig, ExamSelectData} from "@/types/exam-types.ts";
import {FaCheck, FaEdit, FaRegStickyNote} from "react-icons/fa";
import {Badge, Button, RichTextShow} from "@/component";
import {useState} from "react";
import SelectEdit from "@/features/Select/for-manager/Manage/Edit/SelectEdit.tsx";
import QuestionRating from "@/features/Layout/QuestionRating.tsx";
import ModalSelectMemo from "@/features/Select/for-user/Memo/ModalSelectMemo.tsx";
import ArticleLink from "@/features/Link/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Link/FileLink/FileLink.tsx";

type Props = {
  readonly q: ExamSelectData,
  readonly a: Array<number>,
  readonly i: number,
  readonly config?: ExamSelectCardConfig,
  readonly onRefetch?: ()=>void,
}

/**
 * 顯示選擇題結果的卡片
 * @param q 選擇題的物件
 * @param a 使用者答案
 * @param i 編號
 * @param config 卡片設定
 * @param onRefetch 重新整理的函數
 * @constructor
 */
export default function SelectResultCard({q, a, i, config, onRefetch}: Props) {


  const [isEdit, setIsEdit] = useState<boolean>(false);

  const title = q.question.length > 35 ? q.question.slice(0, 35) + "..." : q.question

  const classes = twMerge(
    'hover:bg-base-200 card card-border border-base-300 my-1 relative',
    clsx({
      'border-success': a.length !== 0 && q.answer[0] === a[0],
      'border-error': a.length !== 0 && q.answer[0] !== a[0],
    })
  )

  if (isEdit && onRefetch !== undefined) {
    return (
      <div className="hover:bg-base-200 card-border border-2 border-error rounded-xl my-1 relative p-2">
        <SelectEdit obj={q} onRefetch={onRefetch} setIsEdit={setIsEdit}/>
      </div>
    )
  }


  return (
    <div className={classes}>
      {/*編輯按鈕*/}
      {onRefetch !== undefined &&
        <Button className='absolute top-1 right-1' size='sm' shape='circle'
                onClick={() => setIsEdit(true)}>
          <FaEdit/>
        </Button>
      }
      {/*對或錯的圖示*/}
      {(a.length !== 0 && q.answer[0] === a[0]) &&
        <FaCircleCheck className='text-success text-xl absolute top-1 right-1'/>
      }
      {(a.length !== 0 && q.answer[0] !== a[0]) &&
        <FaCircleXmark className='text-error text-xl absolute top-1 right-1'/>
      }
      <div className='p-5'>
        <div className='font-bold'>
          <span className='mr-1'>{i + 1}. </span>
          <span>{config?.showOptions ? q.question : title}</span>
        </div>
        {
          config?.showOptions &&
          <>
            <form className='pl-2'>
              {q.options.map((item, index) => {
                const classes = twMerge(
                  'ml-2 cursor-pointer hover:font-semibold w-full',
                  clsx({
                    'text-primary': index === a[0], // 所選答案
                  })
                )
                return (
                  <div className='flex my-1' key={item}>
                    <input type="radio" id={item} value={index} className="radio radio-primary radio-sm"
                           disabled checked={a[0] === index}/>
                    <label htmlFor={item} className={classes}>
                      {index === q.answer[0] && <FaCheck className='inline mr-1'/>}
                      {item}
                    </label>
                  </div>
                )
              })}
            </form>
            <div className='text-xs flex items-center gap-1'>
              <div className='ml-auto flex gap-1'>
                <span>{q.year}年</span>
                <span>{q.source}</span>
                <span>{q.category}</span>
                <span>{q.subject}</span>
              </div>
            </div>
          </>
        }
        {
          (config?.showRating || config?.showLinks || config?.showComment) &&
          <div className='divider m-0'></div>
        }
        {
          config?.showRating &&
          <div className='flex'>
            <QuestionRating right_count={q.right_count} total_count={q.total_count} showNumber showPercent/>
            <ModalSelectMemo q={q}/>
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
      </div>
    </div>
  )
}