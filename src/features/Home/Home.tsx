import {Link} from "react-router";
import {MEDIA_IP, POLICE_API} from "@/lib/config.ts";
import {useCacheApi} from "@/hooks";

type ExamInfo = {
  select_count: number,
  essay_count: number
  essay_answer_count: number
  result_count: number,
}

/**
 * 考古題的入口頁面
 * @constructor
 */
export default function Home() {

  const {data} = useCacheApi<ExamInfo>({url: POLICE_API + "/exam/home_info/"});

  return (
    <div>
      <img src={MEDIA_IP + '/media/image/小試鴿手.jpg'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <div className="stats shadow w-full shadow-lg mb-3">
        <div className="stat place-items-center">
          <div className="stat-title">已蒐錄選擇題</div>
          <div className="stat-value text-primary">
            {data?.select_count}
            <span className='text-lg ml-1'>題</span>
          </div>
          <div className="stat-desc text-success">提供測驗 {data?.result_count} 次</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">已蒐錄申論題</div>
          <div className="stat-value text-primary">
            {data?.essay_count}
            <span className='text-lg ml-1'>題</span>
          </div>
          <div className="stat-desc text-success">提供作答 {data?.essay_answer_count} 題</div>
        </div>
      </div>

      <img src={MEDIA_IP + '/media/image/小試鴿手_03.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <img src={MEDIA_IP + '/media/image/小試鴿手_04.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <img src={MEDIA_IP + '/media/image/小試鴿手_05.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <img src={MEDIA_IP + '/media/image/小試鴿手_21.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <img src={MEDIA_IP + '/media/image/小試鴿手_22.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <div className='divider'></div>
      <div className='font-bold'>
        本功能題庫由桃園市政府警察局陳芳振與中央警察大學張維容、陳文雄老師共同彙整，提供中央警察大學學生無償使用。
        <br/>若您有意願參與題庫編輯工作、幫助後進，歡迎<Link to='/feedback/web?option=4'
                                                           className='link'>與我們聯繫</Link>。
      </div>
    </div>
  )
}