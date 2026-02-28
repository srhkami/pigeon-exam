import {useForm} from "react-hook-form";
import {Dispatch, SetStateAction} from "react";
import {ExamSelectReadData} from "@/types/exam-types.ts";

type Props = {
  readonly q: ExamSelectReadData,
  readonly index: number,
  readonly setAnswers : Dispatch<SetStateAction<Array<Array<number | null>>>>, // 設定答案
}

type FormValues = {
  selected: string
}

/**
 * 選擇題的單一卡片
 * @param q
 * @param reload
 * @constructor
 */
export default function SelectCard({q, index, setAnswers}: Props) {

  const {register,getValues} = useForm<FormValues>();

  return (
    <div className='card card-border border-base-300 my-1 relative'>
      <div className='card-body'>
        <div className='font-bold'>
          <span className='mr-2'>{index+1}. </span>
          <span>{q.question}</span>
        </div>
        <form className='pl-2'>
          {q.options.map((item, index_) => {
            return (
              <div className='flex my-1' key={item}>
                <input type="radio" id={item} value={index_} className="radio radio-primary radio-sm"
                       {...register('selected',{
                         onChange:()=>{
                           const value = Number(getValues('selected'));
                           setAnswers(p=> p.map((v,i)=>{
                             if (i===index){
                               return [value]
                             }else{
                               return v
                             }
                           }))
                         }
                       })}/>
                <label htmlFor={item} className='ml-2 cursor-pointer hover:font-semibold w-full'>
                  {item}
                </label>
              </div>
            )
          })}
        </form>
        <div className='text-xs flex justify-end gap-1 italic opacity-70'>
          <span>{q.year}年</span>
          <span>{q.source}</span>
          <span>{q.category}</span>
          <span>{q.subject}</span>
        </div>
      </div>
    </div>
  )
}