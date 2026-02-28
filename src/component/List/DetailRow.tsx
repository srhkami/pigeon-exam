import {ReactNode} from "react";

type Props = {
  readonly start: ReactNode,
  readonly center?: ReactNode,
  readonly end?: ReactNode,
}

export default function DetailRow({start, center, end}: Props) {

  if (!center && !end) {
    return (
      <li className="list-row flex p-2 gap-0">
        <div className='w-full flex items-center font-semibold'>
          {start}
        </div>
      </li>
    )
  }

  if (center && !end) {
    return (
      <li className="list-row flex p-2 gap-0">
        <div className='w-3/12 flex items-center font-semibold'>
          {start}
        </div>
        <div className='w-9/12 flex items-center whitespace-pre-wrap'>
          {center}
        </div>
      </li>
    )
  }

  if (!center && end) {
    return (
      <li className="list-row flex p-2 gap-0">
        <div className='w-8/12 flex items-center font-semibold'>
          {start}
        </div>
        <div className='w-4/12 flex items-center justify-end'>
          {end}
        </div>
      </li>
    )
  }

  return (
    <li className="list-row flex p-2 gap-0">
      <div className='w-3/12 flex items-center font-semibold'>
        {start}
      </div>
      <div className='w-7/12 flex items-center'>
        {center}
      </div>
      <div className='w-2/12 flex items-center justify-end'>
        {end}
      </div>
    </li>
  )
}