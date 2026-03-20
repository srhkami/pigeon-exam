import {FaCircleCheck, FaCircleXmark} from "react-icons/fa6";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {SelectQuestionData, SelectQuestionSimpleData} from "@/types/exam-types.ts";
import {FaCheck} from "react-icons/fa";
import {ReactNode} from "react";


export function QsCard({children, is_correct}: { readonly children: ReactNode, readonly is_correct?: boolean }) {
  const classes = twMerge(
    'hover:bg-base-200 card card-border my-1 relative',
    clsx({
      'border-base-300': is_correct === undefined,
      'border-success': is_correct === true,
      'border-error': is_correct === false,
    })
  )

  return (
    <div className={classes}>
      {is_correct === true &&
        <FaCircleCheck className='text-success text-xl absolute top-1 right-1'/>
      }
      {is_correct === false &&
        <FaCircleXmark className='text-error text-xl absolute top-1 right-1'/>
      }
      <div className='p-5'>
        {children}
      </div>
    </div>
  )
}

export function QsCardTitle({i, title}: { readonly i: number, readonly title: string }) {
  return (
    <div className='font-bold'>
      <span className='mr-1'>{i + 1}. </span>
      <span>{title}</span>
    </div>
  )
}

export function QsCardSource({q}: { readonly q: SelectQuestionData | SelectQuestionSimpleData }) {
  return (
    <div className='text-xs flex items-center gap-1'>
      <div className='ml-auto flex gap-1'>
        <span>{q.year}年</span>
        <span>{q.source}</span>
        <span>{q.category}</span>
        <span>{q.subject}</span>
      </div>
    </div>
  )
}

export function QsCardOptionLabel({item, is_correct}: { readonly item: string, readonly is_correct?: boolean }) {

  const classes = twMerge(
    'ml-2 cursor-pointer hover:font-semibold w-full',
    clsx({
      'text-primary': is_correct, // 所選答案
    })
  )

  return (
    <label htmlFor={item} className={classes}>
      {is_correct && <FaCheck className='inline mr-1'/>}
      {item}
    </label>
  )
}
