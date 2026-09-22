import EmailForm from "@/features/User/Login/EmailForm.tsx";
import PasswordForm from "@/features/User/Login/PasswordForm.tsx";
import {HAND_SIGNUP_URL} from "@/lib/config.ts";

/* 登入的主體 */
export default function Login() {
  return (
    <div>
      <div className="tabs tabs-lift">
        <input type="radio" name="tab_login" className="tab" aria-label="驗證碼登入" defaultChecked/>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <EmailForm/>
        </div>
        <input type="radio" name="tab_login" className="tab" aria-label="密碼登入"/>
        <div className="tab-content bg-base-100 border-base-300 p-6">
          <PasswordForm/>
        </div>
      </div>
      <div className='text-xs flex justify-end items-center mt-1'>
        還沒有帳號？
        <a href={HAND_SIGNUP_URL} target='_blank' rel='noopener noreferrer' className='btn btn-sm btn-link'>
          點此註冊
        </a>
      </div>
    </div>
  )
}