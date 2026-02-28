import {HTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";

type Props = {
  readonly icon?: null | 'arrow' | 'plus',
  readonly border?: boolean,
  readonly defaultChecked?: boolean,
  readonly inputName?: string, // 如果傳入了Name，則使用單選模式(radio)，以轉化為手風琴組件
}

export default function Collapse({
                                   icon = null,
                                   border = true,
                                   defaultChecked = false,
                                   inputName,
                                   className,
                                   children
                                 }: Props & HTMLAttributes<HTMLDivElement>) {

  const classes = twMerge(
    'collapse',
    className,
    clsx({
      'collapse-arrow': icon === 'arrow',
      'collapse-plus': icon === 'plus',
      'border-base-300 border': border,
    })
  )

  return (
    <div className={classes}>
      {inputName ?
        <input type="radio" name={inputName} defaultChecked={defaultChecked}/>
        :
        <input type="checkbox" defaultChecked={defaultChecked}/>}
      {children}
    </div>
  )
}