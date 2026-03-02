import {Link} from "react-router";

type Props = {
  readonly tab: 1 | 2 | 3,
}

export default function EssayPageHeader({tab}: Props) {

  const classes = (value: 1 | 2 | 3) => tab === value ? 'tab tab-active' : 'tab';

  return (
    <div className='font-bold mb-4 border-l-4 border-l-primary pl-4 flex items-center'>
      <span className='text-2xl'>申論題</span>
      <div role="tablist" className="tabs tabs-border ml-auto">
        <Link role="tab" className={classes(1)} to='/exam/essay/1?ordering=-year'>題目總覽</Link>
        <Link role="tab" className={classes(2)} to='/exam/essay/random'>隨機出題</Link>
        <Link role="tab" className={classes(3)} to='/exam/essay/logs/1?ordering=-id'>作答記錄</Link>
      </div>
    </div>
  )
}