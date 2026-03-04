import {ReactNode} from "react";
import {handleHasAuth} from "./handleHasAuth.ts";
import {ErrorAlert} from "@/features";
import {AuthType} from "@/types/auth-types.ts";
import {useAuth} from "@/hooks";

type Props = {
  readonly children: ReactNode, // 傳入的組件
  readonly authType?: AuthType,  // 權限類型
}

/** 被此組件包裹住的其他組件，會驗證是否權限是否符合，否則顯示錯誤提示。
 *   用在有包含敏感資訊的整個頁面
 */
export default function AuthLayout({children, authType = 'L'}: Props) {

  const {userInfo, isAuthenticated} = useAuth();
  const hasAuth: boolean = handleHasAuth(userInfo.auth, authType); // 確認特定位數是否有權限值

  if (!isAuthenticated) {
    // 如果未登入
    return <ErrorAlert errorType='noLogin'/>
  }
  if ((authType === 'C' || authType === 'S' || authType === 'T') && !hasAuth) {
    // 用以確認是否有指定權限，如無則提示要認證
    return <ErrorAlert errorType='noAcc'/>
  }
  if (!hasAuth) {
    // 若是要求更進階權限，則請聯繫管理員
    return <ErrorAlert errorType='noAuth'/>
  }
  // 無錯誤，返回內容
  return <>{children}</>
}