import {createContext, type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {AxiosError} from 'axios';
import toast from "react-hot-toast";
import {HAND_ACCREDIT_URL} from "@/lib/config.ts";
import {type UserInfo} from "@/types/user-types.ts";
import {type TypeAuthContext} from "@/types/auth-types.ts";
import {useAxios} from "@/hooks";
import {clearTokens, loadTokens} from "@/auth/handleUser.ts";
import {Button} from "@/component";
import {V3_AUTH_ENDPOINTS, isUserTokenVerifyResponse} from "@/auth/authContract.ts";

type Props = {
  children: ReactNode,
}

const noLoginUser: UserInfo = {
  id: 0,
  auth: '0000000000000000',
  email: '',
  wait_accredit: 0,
  expiry_days: null,
  bookmark: '["bk"]',
  options: {},
  name: '訪客',
  ai_point:0,
}

// 定義一個安全的初始 Context 狀態
const initialContext: TypeAuthContext = {
  isLoading: true,
  isAuthenticated: false,
  onReload: ()=>{},
  setIsAuthenticated: () => {},
  userInfo: noLoginUser, // 關鍵：這裡必須放入 noLoginUser，確保 userInfo 永遠不為 undefined

};

const AuthContext = createContext(initialContext); //還未完全測試正確錯誤
export default AuthContext;

const authorizationToken = (headers: unknown) => {
  const value = typeof (headers as {get?: unknown})?.get === 'function'
    ? (headers as {get: (name: string) => unknown}).get('Authorization')
    : (headers as {Authorization?: unknown} | undefined)?.Authorization;
  return typeof value === 'string' ? value.replace(/^Bearer /, '') : '';
};

const handleToast = (expiry_days: number | null) => {
  let tip: Array<string> = []
  if (!expiry_days) {
    return
  }
  if (expiry_days >= 0) {
    return
  }
  if (expiry_days < 0 && expiry_days >= -30) {
    tip = ['您的會員有效日已到期', `請於${30 + expiry_days}天內重新進行認證，否則將取消瀏覽權限`]
  } else {
    tip = ['您的會員有效日逾期過久', '目前已遭系統取消瀏覽權限，請重新進行認證']
  }
  toast(t => (
    <div className='w-72'>
      <div className='font-bold text-error'>
        {tip[0]}
      </div>
      <div className='text-xs mt-1'>
        {tip[1]}
      </div>
      <div className='flex justify-end mt-2'>
        <a href={HAND_ACCREDIT_URL} target='_blank' rel='noopener noreferrer' className='btn btn-sm btn-accent me-2'>
          前往認證
        </a>
        <Button size='sm' color='neutral' onClick={() => toast.dismiss(t.id)}>
          稍後再說
        </Button>
      </div>
    </div>
  ))
}

/* 全域使用的變數
*  組件流程：
*   1. 網站載入時，會先刷新一次Token
*   2. 使用新的Token，驗證並取得資料
*   3. 資料保存在變數中，僅能被組件取得
*   4. 當網站關閉時，不會儲存此資訊
* */
export const AuthProvider = ({children}: Props) => {

  const api = useAxios();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo>(noLoginUser);
  const verificationRef = useRef<{sequence: number; controller: AbortController | null}>({sequence: 0, controller: null});

  // 1. 核心驗證邏輯：現在它只負責「抓取並同步狀態」
  const verifyToken = useCallback(async () => {
    verificationRef.current.controller?.abort();
    const sequence = ++verificationRef.current.sequence;
    const controller = new AbortController();
    verificationRef.current.controller = controller;
    const isCurrent = () => sequence === verificationRef.current.sequence && !controller.signal.aborted;
    let requestAccess = loadTokens()?.access;
    const ownsCredentials = () => loadTokens()?.access === requestAccess;
    setIsLoading(true);
    setIsAuthenticated(false);
    setUserInfo(noLoginUser);
    try {
      if (!requestAccess) return;
      const res = await api<UserInfo>({
        method: 'post',
        url: V3_AUTH_ENDPOINTS.verify,
        data: {},
        timeout: 10000,
        signal: controller.signal,
      });
      requestAccess = authorizationToken(res.config.headers);
      if (!isCurrent() || !requestAccess || !ownsCredentials()) return;
      const data = res.data;
      if (!isUserTokenVerifyResponse(data)) throw new Error("auth_response_invalid");
      setUserInfo({...data});
      setIsAuthenticated(true);
      handleToast(data.expiry_days);
    } catch (err) {
      if (!isCurrent()) return;
      requestAccess = authorizationToken((err as AxiosError).config?.headers) || requestAccess;
      // 舊請求不可清除另一個登入流程剛寫入的憑證。
      if (ownsCredentials()) clearTokens();
      setUserInfo(noLoginUser);
      setIsAuthenticated(false);
    } finally {
      if (isCurrent()) setIsLoading(false);
    }
  }, [api]);

  // 2. 登出邏輯：明確、簡單
  const logout = useCallback(() => {
    verificationRef.current.controller?.abort();
    verificationRef.current.sequence++;
    setUserInfo(noLoginUser);
    setIsAuthenticated(false);
    clearTokens();
    setIsLoading(false);
  }, []);

  // 3. 初始化載入：只在組件掛載時執行一次
  useEffect(() => {
    void verifyToken();
    const verification = verificationRef.current;
    return () => {
      verification.controller?.abort();
      verification.sequence++;
    };
  }, [verifyToken]);

  // 4. 組合 Context Value
  const contextData = useMemo(() => ({
    isLoading,
    isAuthenticated,
    userInfo,
    // 讓外部直接呼叫 verifyToken 來達到「reload」的效果
    onReload: verifyToken,
    // 提供一個統一的更新入口
    setIsAuthenticated: (val: boolean) => val ? verifyToken() : logout(),
  }), [isLoading, isAuthenticated, userInfo, verifyToken, logout]);

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};