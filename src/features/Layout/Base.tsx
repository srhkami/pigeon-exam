import {Outlet, useLocation} from "react-router";
import {ReactNode, useEffect, useState} from "react";
import {LogoLink} from "@/features";
import {AllPages, MenuSelect} from "@/lib/pages.tsx";
import SidebarMenu from "@/features/Layout/SidebarMenu.tsx";
import ThemeToggle from "@/features/Layout/ThemeToggle.tsx";
import MenuUser from "@/features/User/UserProfile/MenuUser.tsx";
import SidebarLink from "@/features/Layout/SidebarLink.tsx";
import { BsLayoutSidebarInset } from "react-icons/bs";

type Props = {
  readonly children?: ReactNode;
}

export default function Base({children}: Props) {

  const {pathname} = useLocation();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // 當網址有更動時，回到頁面最上方
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  const onChange = () => {
    setDrawerOpen(p => !p)
  }

  return (
    <div className="drawer lg:drawer-open lg:px-5 xl:px-10">
      <input id="my-drawer-4" checked={drawerOpen} onChange={onChange} type="checkbox"
             className="drawer-toggle"/>
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar md:px-4 w-full sticky top-0 z-10 bg-base-200/50 backdrop-blur-sm flex">
          <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-circle mr-2">
            {/* Sidebar toggle icon */}
            <BsLayoutSidebarInset className='h-4 w-4'/>
          </label>
          <LogoLink/>
          <ThemeToggle/>
          <MenuUser/>
        </nav>
        {/* Page content here */}
        <main className="pt-4 px-2 sm:px-8 md:px-12 lg:px-10 xl:px-16 py-3 min-h-100">
          <Outlet/>
          {children}
        </main>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex flex-col min-h-full  items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow gap-2 pt-4">
            {/* List item */}
            <SidebarMenu menu={MenuSelect} drawerOpen={drawerOpen} onDrawerOpen={() => setDrawerOpen(true)}/>
            {/* List item */}
            <SidebarLink page={AllPages.about}/>
            <li>
              <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                {/* Settings icon */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round"
                     strokeWidth="2" fill="none" stroke="currentColor" className="my-1.5 inline-block size-4">
                  <path d="M20 7h-9"></path>
                  <path d="M14 17H5"></path>
                  <circle cx="17" cy="17" r="3"></circle>
                  <circle cx="7" cy="7" r="3"></circle>
                </svg>
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}