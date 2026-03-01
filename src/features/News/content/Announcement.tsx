import {Link} from "react-router";
import {useCacheApi} from "@/hooks";
import {MEDIA_IP, WEB_API} from "@/lib/config.ts";
import {type Notice} from "@/types/media-types.ts";

export default function Announcement(){

  const {data} = useCacheApi<Array<Notice>>({url: WEB_API +'/cache/get/?key=pigeon-hand-notice'})

  const items = data?.map((item) => {
    return(
      <Link to={item.link} key={item.id} className='list-row hover:bg-base-200 flex items-center'>
        <div className="list-col-grow font-semibold w-full">
          <div className='text-xs opacity-70'>
            {item.date}
          </div>
          <div>
            {item.text}
          </div>
        </div>
      </Link>
    )
  })

  return(
    <div className='card bg-base-100 h-full'>
      <div className='card-body'>
        <div className='flex justify-center items-center text-lg font-bold'>
          <img src={MEDIA_IP + '/media/icon/announcement.png'} alt="" className='h-6 me-2'/>
          公告
        </div>
        <ul className='list'>
          {items}
        </ul>
      </div>
    </div>
  )
}