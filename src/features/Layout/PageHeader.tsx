import {twMerge} from "tailwind-merge";
import clsx from "clsx";

type Props = {
  readonly title: string,
  readonly as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5',
  readonly divider?: boolean,
  readonly className?:string
}

export default function PageHeader({title, as = 'h3', divider = true, className}: Props) {

  const classes = twMerge(
    className,
    'font-bold mb-3 pl-4 border-l-4 border-l-primary',
    clsx({
      'text-4xl': as === 'h1',
      'text-3xl': as === 'h2',
      'text-2xl': as === 'h3',
      'text-xl': as === 'h4',
      'text-lg border-l-secondary': as === 'h5',
    })
  )


  return (
    <>
      <div className={classes}>
        {title}
      </div>
      {divider && <div className='divider border-secondary'></div>}
    </>
  )

}