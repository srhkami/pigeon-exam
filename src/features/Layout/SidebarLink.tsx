import {Page} from "@/lib/pages.tsx";
import {useNavigate} from "react-router";
import {Dispatch, SetStateAction} from "react";

type Props = {
  readonly page: Page,
  readonly setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export default function SidebarLink({page, setDrawerOpen}: Props) {

  const navi = useNavigate();
  const onClick = () => {
    navi(page.url)
    if (window.innerWidth <= 1024) {
      setDrawerOpen(false)
    }
  }

  return (
    <li>
      <button onClick={onClick} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip={page.label}>
        <img src={page.icon} alt={page.label} className='h-5 w-5'/>
        <span className="is-drawer-close:hidden">{page.label}</span>
      </button>
    </li>
  )
}