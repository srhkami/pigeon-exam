import {Link} from "react-router";
import {SelectPagesForUser} from "@/lib/pages.tsx";

type Props = {
  readonly tab: 1 | 2,
}

export default function SelectPageHeader({tab}: Props) {

  const classes = (value: 1 | 2) => tab === value ? 'tab tab-active' : 'tab';

  return (
    <div className='font-bold mb-4 border-l-4 border-l-primary pl-4 flex items-center'>
      <span className='text-2xl'>選擇題測驗</span>
      <div role="tablist" className="tabs tabs-border ml-auto">
        <Link role="tab" className={classes(1)}
              to={SelectPagesForUser.random.url}>{SelectPagesForUser.random.label}</Link>
        <Link role="tab" className={classes(2)}
              to={SelectPagesForUser.past.url}>{SelectPagesForUser.past.label}</Link>
      </div>
    </div>
  )
}