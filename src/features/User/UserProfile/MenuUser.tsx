import {Dropdown, DropdownContent, DropdownToggle} from "@/component";
import {Link} from "react-router";
import {showToast} from "@/func";
import {handleLogout} from "@/auth/handleUser.ts";
import BadgeAccredit from "./BadgeAccredit.tsx";
import AuthShow from "@/auth/AuthShow.tsx";
import {useAuth} from "@/hooks";
import {ModalLogin} from "@/features";
import {HAND_ACCREDIT_URL} from "@/lib/config.ts";
import {useRef} from "react";
import Loading from "@/component/Loading/Loading.tsx";

export default function MenuUser() {

  const {setIsAuthenticated, userInfo, isAuthenticated, isLoading} = useAuth();
  const memberRef = useRef<HTMLDivElement>(null);

  const logout = () => {
    const request = handleLogout();
    setIsAuthenticated(false);
    showToast(request).catch(() => undefined);
  }

  return <div ref={memberRef} tabIndex={-1} aria-label='會員入口'>
    {isLoading ? <div className='size-11 flex items-center justify-center' role='status' aria-label='載入中'><Loading size='sm'/></div> : isAuthenticated ? (
      <Dropdown aligns='end'>
        <DropdownToggle shape='circle' color='primary' dropdownIcon={false}>
          {userInfo.name ? userInfo.name.slice(0, 1) : '客'}
        </DropdownToggle>
        <DropdownContent size='lg' className='z-1 mt-3 p-2 shadow font-semibold'>
          <ul className='menu w-full'>
            <li>
              <a href={HAND_ACCREDIT_URL} target='_blank' rel='noopener noreferrer' className='py-2 flex justify-between'>
                實名認證
                <BadgeAccredit user={userInfo}/>
              </a>
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
    ) : null}
    <ModalLogin hideTrigger={isLoading || isAuthenticated} returnFocusRef={memberRef}/>
  </div>
}