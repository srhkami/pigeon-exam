import {Link} from "react-router";
import {Logo} from "@/features";

export default function LogoLink() {
  return (
    <Link to='/index' className='flex items-center gap-2 text-2xl font-bold'>
      <span className='w-7 mr-1'>
        <Logo/>
      </span>
      <span>
        小試鴿手
      </span>
    </Link>
  )
}