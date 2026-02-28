import {HTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";

export default function CollapseTitle({className, children}: Readonly<HTMLAttributes<HTMLDivElement>>) {

  const classes = twMerge(
    'collapse-title font-semibold px-6',
    className,
  )

  return (
    <div className={classes}>
      {children}
    </div>
  )
}