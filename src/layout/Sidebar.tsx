import {ReactNode, useState} from "react";
import {AllPages, HappyPages} from "../lib/pages.ts";
import {SidebarLink, SidebarMenu,} from "@/component";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {LogoLink} from "@/features";
import {AuthComponent} from "@/auth";

type Props = {
  readonly children: ReactNode,
  readonly sidebarShow: 'lg' | null, // 側邊欄顯示的最小寬度
}

export default function Sidebar({children, sidebarShow}: Props) {

  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);
  const divClasses = twMerge(
    "drawer",
    clsx({
      "lg:drawer-open": sidebarShow === 'lg',
    })
  )
  const ulClasses = twMerge(
    "menu text-base-content w-64 p-4 overflow-auto pt-5 font-semibold",
    clsx({
      "lg:h-auto": sidebarShow === 'lg',
    })
  )

  const homeLinkClasses = twMerge(
    "hidden items-center navbar sticky top-0 z-20 w-full",
    clsx({
      'lg:flex': sidebarShow === 'lg',
    })
  )

  return (
    <div className={divClasses}>
      <input id="siderbar-toggle" type="checkbox" className="drawer-toggle" checked={isOpen}
             onChange={() => setIsOpen(!isOpen)}/>
      <div className="drawer-content">
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side min-h-screen z-40 bg-base-200/70 backdrop-blur-lg">
        <label htmlFor="siderbar-toggle" aria-label="close sidebar" className="drawer-overlay"></label>
        <aside className="menu text-base-content w-64 p-0 px-2">
          <div className={homeLinkClasses}>
            <LogoLink/>
          </div>
        </aside>
        <ul className={ulClasses}>
          {/* Sidebar content here */}
          <SidebarLink page={AllPages.news} handleSidebarClose={handleClose}/>
          <SidebarMenu
            title='開心上班資料庫'
            icon='dove.png'
            pages={[HappyPages.handle, HappyPages.website, HappyPages.caseDocument, HappyPages.officialDocument,]}
            handleSidebarClose={handleClose}
          />
          <SidebarLink page={AllPages.policelaw} handleSidebarClose={handleClose}/>
          <SidebarLink page={AllPages.sop} handleSidebarClose={handleClose}/>
          <SidebarLink page={AllPages.enforcement} handleSidebarClose={handleClose}/>
          <SidebarLink page={AllPages.trafficpigeon} handleSidebarClose={handleClose}/>
          <SidebarMenu
            title='附屬工具'
            icon='tool.png'
            pages={[AllPages.linebot, AllPages.apps]}
            handleSidebarClose={handleClose}
          />
          <AuthComponent authType='E'>
            <SidebarLink page={AllPages.exam} handleSidebarClose={handleClose}/>
          </AuthComponent>
          <SidebarLink page={AllPages.feedback} handleSidebarClose={handleClose}/>
          <SidebarLink page={AllPages.about} handleSidebarClose={handleClose}/>
          <AuthComponent authType='CM'>
            <SidebarLink page={AllPages.pigeonManage} handleSidebarClose={handleClose}/>
          </AuthComponent>
        </ul>
      </div>
    </div>
  )
}