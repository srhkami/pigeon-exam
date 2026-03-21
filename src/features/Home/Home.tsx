import {Link} from "react-router";
import {EXAM_API_V2, MEDIA_IP,} from "@/lib/config.ts";
import {useCacheApi} from "@/hooks";

type ExamInfo = {
  select_count: number,
  select_record_count: number,
  essay_count: number
  essay_record_count: number
}

/**
 * 考古題的入口頁面
 * @constructor
 */
export default function Home() {

  const {data} = useCacheApi<ExamInfo>({url: EXAM_API_V2 + "/user_info"});

  return (
    <div>
      <img src={MEDIA_IP + '/media/image/小試鴿手.jpg'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <div className="stats shadow-lg w-full mb-3">
        <div className="stat place-items-center">
          <div className="stat-title">蒐錄選擇題</div>
          <div className="stat-value text-primary">
            {data?.select_count}
            <span className='text-lg ml-1'>題</span>
          </div>
          <div className="stat-desc text-success">累積作答 {data?.select_record_count} 題</div>
        </div>
        <div className="stat place-items-center">
          <div className="stat-title">蒐錄申論題</div>
          <div className="stat-value text-primary">
            {data?.essay_count}
            <span className='text-lg ml-1'>題</span>
          </div>
          <div className="stat-desc text-success">累積作答 {data?.essay_record_count} 題</div>
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