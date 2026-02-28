import {HiMenu} from "react-icons/hi"
import BtnThemeToggle from "./BtnThemeToggle.tsx";
import MenuUser from "../features/User/UserProfile/MenuUser.tsx";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {LogoLink, ModalLogin} from "@/features";
import {useAuth} from "@/hooks";

type Props = {
  readonly sidebarShow?: 'lg' | null , // 側邊欄顯示的最小寬度
}

export default function Nav({sidebarShow='lg'}: Props) {

  const {isAuthenticated} = useAuth();
  const divClasses = twMerge(
    "w-1/2 flex items-center",
    clsx({
      "lg:hidden": sidebarShow === 'lg',
    })
  )
  const btnClasses = twMerge(
    "btn btn-square btn-ghost drawer-button mr-1",
    clsx({
      "lg:hidden": sidebarShow === 'lg',
    })
  )


  return (
    <div className="navbar md:px-6 sticky top-0 z-30 bg-base-200/50 backdrop-blur-sm">
      <div className={divClasses}>
        <label htmlFor="siderbar-toggle" className={btnClasses}>
          <HiMenu className="text-2xl"/>
        </label>
        <LogoLink/>
      </div>
      <div className="flex w-1/2 lg:w-full justify-end items-center gap-2">
        {/*<input type="text" placeholder="Search" className="input input-sm input-bordered w-24 md:w-auto"/>*/}
        {/*<ModalSearch/>*/}
        <BtnThemeToggle/>
        {isAuthenticated ? <MenuUser/> : <ModalLogin/>}
      </div>
    </div>
  )
}