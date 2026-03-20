import {useForm} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {SelectQuestionSimpleData} from "@/types/exam-types.ts";
import {QsCard, QsCardOptionLabel, QsCardSource, QsCardTitle} from "@/features/Select/for-user/Question/QsCardBase.tsx";

type Props = {
  readonly q: SelectQuestionSimpleData,
  readonly i: number,
  readonly setAnswers: Dispatch<SetStateAction<Array<Array<number | null>>>>, // 設定答案
}

type FormValues = {
  selected: string
}

/**
 * 選擇題用來填寫的單一卡片
 * @param q
 * @param i
 * @param setAnswers
 * @constructor
 */
export default function QsCardForInput({q, i, setAnswers}: Props) {

  const {register, getValues} = useForm<FormValues>();

  return (
    <QsCard>
      <QsCardTitle i={i} title={q.question}/>
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
                             console.log('選擇值是：', value)
                             console.log('原值是：', v)
                             console.log('傳入索引值是：', i)
                             console.log('索引值是：', i_)
                             if (i_ === i) {
                               console.log('判定為真')
                               return [value]
                             } else {
                               console.log('判定為假')
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