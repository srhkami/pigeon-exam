import {MEDIA_IP} from "@/lib/config.ts";
import {TSidebarMenu} from "@/lib/pages.tsx";
import {Link} from "react-router";
import {Dispatch, SetStateAction, useRef} from "react";

type Props = {
  readonly menu: TSidebarMenu,
  readonly drawerOpen: boolean,
  readonly setDrawerOpen: Dispatch<SetStateAction<boolean>>,
}

export default function SidebarMenu({menu, drawerOpen, setDrawerOpen}: Props) {

  const ref = useRef<HTMLDetailsElement | null>(null);

  const onclick = () => {
    if (!drawerOpen && ref.current) {
      setDrawerOpen(true);
      ref.current.open = true;
    }
  }

  const onBtnClick = () => {
    if (drawerOpen && window.innerWidth <= 1024){
      setDrawerOpen(false);
    }
  }

  const iconClass = 'h-5 w-5'

  return (
    <li>
      {!drawerOpen &&
        <button onClick={onclick} data-tip={menu.label}>
          <img src={MEDIA_IP + `/media/icon/${menu.icon}`} alt={menu.label} className={iconClass}/>
          <span className="is-drawer-close:hidden">{menu.label}</span>
        </button>
      }
      <details ref={ref} className='is-drawer-close:hidden'>
        <summary className="is-drawer-close:tooltip is-drawer-close:tooltip-right">
          <img src={MEDIA_IP + `/media/icon/${menu.icon}`} alt={menu.label} className={iconClass}/>
          <span className="is-drawer-close:hidden">{menu.label}</span>
        </summary>
        <ul className="text-sm is-drawer-close:hidden">
          {menu.list.map(page => {
            return (
              <li key={page.url} onClick={onBtnClick}>
                <Link to={page.url}  className='f-09 flex'>
                  <img src={page.icon} alt={page.label} className='h-5 mr-1 my-auto'/>
                  {page.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </details>
    </li>
  )
}