import {Page} from "@/lib/pages.tsx";
import {Link} from "react-router";

type Props = {
  readonly page: Page
}

export default function SidebarLink({page}:Props){
  return(
    <li>
      <Link to={page.url} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={page.label}>
        <img src={page.icon} alt={page.label} className='h-5 w-5'/>
        <span className="is-drawer-close:hidden">{page.label}</span>
      </Link>
    </li>
  )
}