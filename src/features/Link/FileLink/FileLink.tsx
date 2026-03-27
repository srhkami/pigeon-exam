
import {Link} from "react-router";
import {RiLinkM} from "react-icons/ri";
import {HappyFileLink} from "@/types/happywork-types.ts";

type Props = {
  readonly fileLink: Array<HappyFileLink>,
}

// 關聯法規的顯示及預覽
export default function FileLink({fileLink}: Props) {

  const buttons = fileLink.map((item) => {
    return (
      <Link to={item.url} target='_blank' key={item.id}
            className='btn btn-xs btn-accent mr-1 mb-1 rounded-4xl'>
        {item.title}
        <RiLinkM className='text-xs' />
      </Link>
    )
  })

  return (
    <div className='mt-1'>
      {buttons}
    </div>
  )
}
