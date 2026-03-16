import {useForm} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {ExamSelectReadData} from "@/types/exam-types.ts";
import {QsCard, QsCardOptionLabel, QsCardSource, QsCardTitle} from "@/features/Select/for-user/Question/QsCardBase.tsx";

type Props = {
  readonly q: ExamSelectReadData,
  readonly index: number,
  readonly setAnswers: Dispatch<SetStateAction<Array<Array<number | null>>>>, // 設定答案
}

type FormValues = {
  selected: string
}

/**
 * 選擇題用來填寫的單一卡片
 * @param q
 * @param index
 * @param setAnswers
 * @constructor
 */
export default function QsCardForInput({q, index, setAnswers}: Props) {

  const {register, getValues} = useForm<FormValues>();

  return (
    <QsCard>
      <QsCardTitle i={index} title={q.question}/>
      <form className='pl-2'>
        {q.options.map((item, index) => {
          return (
            <div className='flex my-1' key={item}>
              <input type="radio" id={item} value={index} className="radio radio-primary radio-sm"
                     {...register('selected', {
                       onChange: () => {
                         const value = Number(getValues('selected'));
                         if (setAnswers !== undefined) {
                           setAnswers(p => p.map((v, i_) => {
                             if (i_ === index) {
                               return [value]
                             } else {
                               return v
                             }
                           }))
                         }
                       }
                     })}/>
              <QsCardOptionLabel item={item}/>
            </div>
          )
        })}
      </form>
      <QsCardSource q={q}/>
    </QsCard>
  )
}