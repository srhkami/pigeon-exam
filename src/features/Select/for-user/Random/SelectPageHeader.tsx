import {Link} from "react-router";

type Props = {
  readonly tab: 1 | 2,
}

export default function SelectPageHeader({tab}: Props) {

  const classes = (value: 1 | 2) => tab === value ? 'tab tab-active' : 'tab';

  return (
    <div className='font-bold mb-4 border-l-4 border-l-primary pl-4 flex items-center'>
      <span className='text-2xl'>選擇題測驗</span>
      <div role="tablist" className="tabs tabs-border ml-auto">
        <Link role="tab" className={classes(1)} to='/select/random'>隨機出題</Link>
        <Link role="tab" className={classes(2)} to='/select/past'>考古題總覽</Link>
      </div>
    </div>
  )
}