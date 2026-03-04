import {twMerge} from "tailwind-merge";
import clsx from "clsx";

type Props = {
  readonly title: string,
  readonly as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5',
  readonly divider?: boolean,
}

export default function PageHeader({title, as = 'h3', divider = true}: Props) {

  const classes = twMerge(
    'font-bold mb-3 border-l-4 border-l-primary pl-4',
    clsx({
      'text-4xl': as === 'h1',
      'text-3xl': as === 'h2',
      'text-2xl': as === 'h3',
      'text-xl': as === 'h4',
      'text-lg': as === 'h5',
    })
  )


  return (
    <>
      <div className={classes}>
        {title}
      </div>
      {divider && <div className='divider'></div>}
    </>
  )

}