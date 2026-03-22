import {Outlet, useLocation} from "react-router";
import {ReactNode, useEffect, useState} from "react";
import {LogoLink} from "@/features";
import {
  AllPages,
  MenuEssay,
  MenuEssayManage,
  MenuPaper,
  MenuPaperManage,
  MenuSelect,
  MenuSelectManage
} from "@/lib/pages.tsx";
import SidebarMenu from "@/features/Layout/SidebarMenu.tsx";
import ThemeToggle from "@/features/Layout/ThemeToggle.tsx";
import MenuUser from "@/features/User/UserProfile/MenuUser.tsx";
import SidebarLink from "@/features/Layout/SidebarLink.tsx";
import {BsLayoutSidebarInset} from "react-icons/bs";
import {Toaster} from "react-hot-toast";
import {AuthComponent} from "@/auth";
import Footer from "@/features/Layout/Footer.tsx";
import {Badge} from "@/component";

type Props = {
  readonly children?: ReactNode;
  readonly manage_mode?: boolean;
}

export default function Base({children, manage_mode = false}: Props) {

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
          {manage_mode && <Badge style='outline' className='ml-1'>管理</Badge>}
          <ThemeToggle/>
          <MenuUser/>
        </nav>
        {/* Page content here */}
        <main className="pt-4 px-2 sm:px-12 md:px-18 lg:px-24">
          <Outlet/>
          {children}
        </main>
        <Footer/>
      </div>
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="flex flex-col min-h-full  items-start bg-base-200 is-drawer-close:w-16 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow gap-2 pt-4">
            {
              manage_mode ?
                <>
                  <SidebarLink page={AllPages.home} setDrawerOpen={setDrawerOpen}/>
                  <AuthComponent authType='EH'>
                    <SidebarMenu menu={MenuSelectManage} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                  </AuthComponent>
                  <AuthComponent authType='EH'>
                    <SidebarMenu menu={MenuEssayManage} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                  </AuthComponent>
                  <AuthComponent authType='EM'>
                    <SidebarMenu menu={MenuPaperManage} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                  </AuthComponent>
                </>
                :
                <>
                  <AuthComponent authType='EH'>
                    <SidebarLink page={AllPages.manage} setDrawerOpen={setDrawerOpen}/>
                  </AuthComponent>
                  <SidebarMenu menu={MenuSelect} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                  <SidebarMenu menu={MenuEssay} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                  <SidebarMenu menu={MenuPaper} drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen}/>
                  <SidebarLink page={AllPages.statistics} setDrawerOpen={setDrawerOpen}/>
                  <SidebarLink page={AllPages.feedback} setDrawerOpen={setDrawerOpen}/>
                </>
            }
            <SidebarLink page={AllPages.about} setDrawerOpen={setDrawerOpen}/>
          </ul>
        </div>
      </div>
      <Toaster position='bottom-right'/>
    </div>
  )
}