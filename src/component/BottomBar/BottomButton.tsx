import {Button} from "@/component";
import type {ButtonHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

type Props = {
  color?: "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error",
  style?: "outline" | "dash" | "soft" | "ghost" | "link",
  disabled?: boolean,
  label?: string,
}

export default function BottomButton({
                                       color,
                                       style = 'ghost',
                                       disabled = false,
                                       label = '',
                                       onClick,
                                       type,
                                       className,
                                       title,
                                       children
                                     }: Props & ButtonHTMLAttributes<HTMLButtonElement>) {

  const classes = twMerge('mx-1 flex-col gap-0', className)

  return (
    <Button shape='circle' style={style} color={color} type={type}
            disabled={disabled} title={title}
            className={classes} onClick={onClick}>
      {children}
      {label && <span className='text-[8px]'>{label}</span>}
    </Button>
  )
}