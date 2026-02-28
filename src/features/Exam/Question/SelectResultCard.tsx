import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {ExamSelectCardConfig, ExamSelectData} from "@/types/exam-types.ts";
import QuestionRating from "@/features/Exam/tools/QuestionRating.tsx";
import {FaCheck, FaRegStickyNote} from "react-icons/fa";
import ArticleLink from "@/features/Exam/tools/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Exam/tools/FileLink/FileLink.tsx";
import {Badge, RichTextShow} from "@/component";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";
import ModalSelectMemo from "@/features/Exam/ExamSelect/Memo/ModalSelectMemo.tsx";

type Props = {
  readonly q: ExamSelectData,
  readonly a?: Array<number | null>,
  readonly i: number,
  readonly config?: ExamSelectCardConfig,
  readonly setAnswers?: Dispatch<SetStateAction<Array<Array<number | null>>>>, // 設定答案
}

type FormValues = {
  selected: string
}

/**
 * 顯示選擇題結果的卡片
 * @param q 選擇題的物件
 * @param a 使用者答案
 * @param i 索引值
 * @param config 卡片設定
 * @param setAnswers 設定答案的函數
 * @constructor
 */
export default function SelectResultCard({q, a, i, config, setAnswers}: Props) {

  const {register, getValues} = useForm<FormValues>();

  const title = q.question.length > 35 ? q.question.slice(0, 35) + "..." : q.question

  // 沒有傳入答案，為填寫模式
  // 要同時傳入設定答案的函數
  if (a === undefined) {
    return (
      <div className='card card-border border-base-300 my-1 relative'>
        <div className='p-5'>
          <div className='font-bold'>
            <span className='mr-1'>{i + 1}. </span>
            <span>{config?.showOptions ? q.question : title}</span>
          </div>
          <form className='pl-2'>
            {q.options.map((item, index) => {
              const classes = twMerge(
                'ml-2 cursor-pointer hover:font-semibold w-full',
              )
              return (
                <div className='flex my-1' key={item}>
                  <input type="radio" id={q.id.toString() + item} value={index} className="radio radio-primary radio-sm"
                         {...register('selected', {
                           onChange: () => {
                             const value = Number(getValues('selected'));
                             if (setAnswers !== undefined) {
                               setAnswers(p => p.map((v, i_) => {
                                 if (i_ === i) {
                                   return [value]
                                 } else {
                                   return v
                                 }
                               }))
                             }
                           }
                         })}/>
                  <label htmlFor={q.id.toString() + item} className={classes}>
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
        </div>
      </div>
    )
  }


  const classes = twMerge(
    'hover:bg-base-200 card card-border border-base-300 my-1 relative',
    clsx({
      'border-success': a.length !== 0 && q.answer[0] === a[0],
      'border-error': a.length !== 0 && q.answer[0] !== a[0],
    })
  )

  return (
    <div className={classes}>
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
            <QuestionRating right_count={q.right_count} total_count={q.total_count}/>
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