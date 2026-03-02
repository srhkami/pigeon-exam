import {Dropdown, DropdownContent, DropdownToggle} from "@/component";
import {Link} from "react-router";
import {errorLogger, showToast} from "@/func";
import {handleLogout} from "@/auth/handleUser.ts";
import BadgeAccredit from "./BadgeAccredit.tsx";
import AuthShow from "@/auth/AuthShow.tsx";
import {useAuth} from "@/hooks";
import {ModalLogin} from "@/features";

export default function MenuUser() {

  const {onReload, userInfo, isAuthenticated} = useAuth();

  const logout = () => {
    showToast(
      handleLogout()
    )
      .catch((err) => errorLogger(err, '登出錯誤'))
      .finally(() => onReload())
  }

  if (isAuthenticated) {
    return (
      <Dropdown aligns='end'>
        <DropdownToggle shape='circle' color='primary' dropdownIcon={false}>
          {userInfo.name ? userInfo.name.slice(0, 1) : '客'}
        </DropdownToggle>
        <DropdownContent size='lg' className='z-1 mt-3 p-2 shadow font-semibold'>
          <ul className='menu w-full'>
            <li>
              <Link to='/user/accredit' className='py-2 flex justify-between'>
                實名認證
                <BadgeAccredit user={userInfo}/>
              </Link>
            </li>
            <li>
              <Link to='/user/profile' className='py-2'>
                個人資料
              </Link>
            </li>
            <div className='divider m-0 label text-xs'>權限</div>
            <AuthShow/>
            <div className='divider m-0'></div>
            <li>
              <button className='py-2 flex justify-center text-error' onClick={logout}>
                登出
              </button>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
    )
  }
  return <ModalLogin/>
}