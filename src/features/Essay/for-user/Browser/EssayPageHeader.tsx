import {Link} from "react-router";
import {EssayPagesForUser} from "@/lib/pages.tsx";

type Props = {
  readonly tab: 1 | 2,
}

export default function EssayPageHeader({tab}: Props) {

  const classes = (value: 1 | 2) => tab === value ? 'tab tab-active' : 'tab';

  return (
    <div className='font-bold mb-4 border-l-4 border-l-primary pl-4 flex items-center'>
      <span className='text-2xl'>申論題測驗</span>
      <div role="tablist" className="tabs tabs-border ml-auto">
        <Link role="tab" className={classes(1)} to={EssayPagesForUser.essayRandom.url}>隨機出題</Link>
        <Link role="tab" className={classes(2)} to={EssayPagesForUser.essayBrowser.url}>題目總覽</Link>
        {/*<Link role="tab" className={classes(3)} to='/exam/essay/logs/1?ordering=-id'>作答記錄</Link>*/}
      </div>
    </div>
  )
}