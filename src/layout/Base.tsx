import Nav from "./Nav.tsx";
import {Outlet, useLocation} from "react-router";
import Sidebar from "./Sidebar.tsx";
import {Toaster} from "react-hot-toast";
import {ReactNode, useEffect} from "react";
import Footer from "./Footer.tsx";

type Prop = {
  children?: ReactNode,
  sidebarShow?: 'lg' | null, // 側邊欄顯示的最小寬度
}

export default function Base({children, sidebarShow = 'lg'}: Prop) {

  const {pathname} = useLocation();
  // 當網址有更動時，回到頁面最上方
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, [pathname]);

  return (
    <div className='lg:px-10 xl:px-20 2xl:px-30 min-h-[100vh]'>
      <Sidebar sidebarShow={sidebarShow}>
        <Nav sidebarShow={sidebarShow}/>
        <main className='px-2 sm:px-3 md:px-6 xl:px-10 py-3 min-h-100'>
          <Outlet/>
          {children}
        </main>
        <Footer/>
      </Sidebar>
      <Toaster position='top-center'/>
    </div>
  )
}