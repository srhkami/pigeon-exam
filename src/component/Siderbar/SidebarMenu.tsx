import {Page} from "@/routes/pages.ts";
import {useEffect, useRef, useState} from "react";
import {Link} from "react-router";
import {MEDIA_IP} from "@/utils/config.ts";

type Props = {
  readonly title: string, // 選單標題
  readonly icon: string, // 選單圖標名稱
  readonly pages: Array<Page>, // 頁面列表
  readonly handleSidebarClose: () => void,
}

/* 側邊欄的伸縮選單 */
export default function SidebarMenu({title, icon, pages, handleSidebarClose}: Props) {

  const ref = useRef<HTMLDetailsElement>(null)
  const [open, setOpen] = useState(false);

  // 讀取初始值
  useEffect(() => {
    if (localStorage.getItem(title) === 'true'){
      setOpen(true)
    }
  }, []);
  // 切換時儲存值
  const handleToggle = () => {
    if (ref.current) {
      const current = ref.current.open
      localStorage.setItem(title, current.toString())
      setOpen(current)
    }
  }

  const menuItems = pages?.map(page => {
    return (
      <li key={page.name}>
        <Link to={page.url} className='f-09 flex' onClick={handleSidebarClose}>
          <img src={page.icon} alt={page.name} className='h-5 mr-1 my-auto'/>
          {page.name}
        </Link>
      </li>
    )
  })

  return (
    <li className='my-1'>
      <details ref={ref} open={open} onToggle={handleToggle}>
        <summary>
          <img src={MEDIA_IP + `/media/icon/${icon}`} alt={title} className='h-5 my-auto mr-2'/>
          {title}
        </summary>
        <ul className="text-sm">
          {menuItems}
        </ul>
      </details>
    </li>
  )
}