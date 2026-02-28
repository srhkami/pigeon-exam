import {ReactNode} from "react";
import {handleHasAuth} from "./handleHasAuth.ts";
import {AuthType} from "@/types/auth-types.ts";
import {useAuth} from "@/hooks";

type AppProps = {
  readonly authType?: AuthType,  // 權限類別
  readonly isManager?: boolean, // 是否允許管理員檢視
  readonly errorContent?: ReactNode, // 出錯時顯示的組件(可留空，則不顯示任何組件)
  readonly children: ReactNode, // 傳入的子組件
}

/* 傳入此組件的子組件，會驗證是否登入、有無權限  */
export default function AuthComponent({ authType = 'L', isManager = false, children, errorContent = <></> }: AppProps) {

  const { userInfo } = useAuth();
  let hasAuth: boolean = handleHasAuth(userInfo.auth, authType); // 確認是否有對應權限

  if (isManager) {
    // 管理員組件，只須確認有對應權限即可放行，不必驗證認證狀態
    hasAuth = userInfo.auth.slice(0, 6).includes('1');
  }

  if (hasAuth) { return <>{children}</> }
  return <>{errorContent}</>
}
