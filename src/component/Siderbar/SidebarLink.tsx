import {Link} from "react-router";
import {Page} from "@/lib/pages.ts";

type Props = {
  readonly page: Page, // 頁面物件
  readonly handleSidebarClose: () => void,
}

export default function SidebarLink({page, handleSidebarClose}: Props) {
  return (
    <li className='my-1'>
      <Link to={page.url} className='flex' onClick={handleSidebarClose}>
        <img src={page.icon} alt='X' className='h-5 my-auto mr-2'/>
        {page.name}
      </Link>
    </li>
  )
}