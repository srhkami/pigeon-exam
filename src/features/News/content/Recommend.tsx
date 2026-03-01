import {MEDIA_IP, WEB_API} from "@/lib/config.ts";
import {useCacheApi} from "@/hooks";
import {Link} from "react-router";
import {FaFile} from "react-icons/fa6";
import {SopLinkDataWithID} from "@/types/sop-type.ts";

export default function Recommend() {

  const {data} = useCacheApi<Array<SopLinkDataWithID>>({url: WEB_API +'/cache/get/?key=pigeon-hand-recommend'})

  console.log(data)

  const items = data?.map((item) => {

    return (
      <Link to={item.url ?? '/'} key={item.id} className='list-row hover:bg-base-200 items-center'>
        <FaFile className='h-4 w-4'/>
        <div className="list-col-grow font-semibold w-full">
          <div>{item.label}</div>
        </div>
      </Link>
    )
  })

  return (
    <div className='card bg-base-100 h-full'>
      <div className='card-body'>
        <div className='flex justify-center items-center text-lg font-bold'>
          <img src={MEDIA_IP + '/media/icon/important.png'} alt="" className='h-6 me-2'/>
          重要資料
        </div>
        <ul className='list'>
          {items}
        </ul>
      </div>
    </div>
  )
}