import {Link} from "react-router";
import {MEDIA_IP,} from "@/lib/config.ts";
import Announcement from "@/features/Home/Announcement.tsx";
import Info from "@/features/Home/Info.tsx";

export default function Home() {
  return (
    <div>
      <img src={MEDIA_IP + '/media/image/小試鴿手.jpg'} alt='無法載入' className='w-full rounded-xl mb-3'/>
      <Announcement/>
      <Info/>
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