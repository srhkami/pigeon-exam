import {createContext, type ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {Link} from "react-router";
import {type UserInfo} from "@/types/user-types.ts";
import {type TypeAuthContext} from "@/types/auth-types.ts";
import {useAxios} from "@/hooks";
import {clearTokens, loadTokens} from "@/auth/handleUser.ts";
import {Button} from "@/component";
import {USER_API} from "@/lib/config.ts";

type Props = {
  children: ReactNode,
}

const noLoginUser: UserInfo = {
  id: 0,
  auth: '00000000',
  email: '',
  wait_accredit: 0,
  expiry_days: null,
  bookmark: '["bk"]',
  options: {},
  name: '訪客'
}

// 定義一個安全的初始 Context 狀態
const initialContext: TypeAuthContext = {
  isAuthenticated: false,
  onReload: ()=>{},
  setIsAuthenticated: (_: boolean) => {},
  userInfo: noLoginUser, // 關鍵：這裡必須放入 noLoginUser，確保 userInfo 永遠不為 undefined

};

const AuthContext = createContext(initialContext); //還未完全測試正確錯誤
export default AuthContext;

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
        <Link to='/user/accredit' className='btn btn-sm btn-accent me-2'>
          前往認證
        </Link>
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

  // 1. 核心驗證邏輯：現在它只負責「抓取並同步狀態」
  const verifyToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api<UserInfo>({
        method: 'post',
        url: USER_API + '/token/verify/',
      });
      const data = res.data;
      setUserInfo({ ...data }); // 建議簡化展開
      setIsAuthenticated(true);
      handleToast(data.expiry_days);
    } catch (err) {
      console.error('驗證失敗', err);
      setUserInfo(noLoginUser);
      setIsAuthenticated(false);
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // 2. 登出邏輯：明確、簡單
  const logout = useCallback(() => {
    setUserInfo(noLoginUser);
    setIsAuthenticated(false);
    clearTokens();
    setIsLoading(false);
  }, []);

  // 3. 初始化載入：只在組件掛載時執行一次
  useEffect(() => {
    const t = loadTokens();
    if (t?.access) {
      verifyToken();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 這裡通常只需執行一次

  // 4. 組合 Context Value
  const contextData = useMemo(() => ({
    isAuthenticated,
    userInfo,
    // 讓外部直接呼叫 verifyToken 來達到「reload」的效果
    onReload: verifyToken,
    // 提供一個統一的更新入口
    setIsAuthenticated: (val: boolean) => val ? verifyToken() : logout(),
  }), [isAuthenticated, userInfo, verifyToken, logout]);

  return (
    <AuthContext.Provider value={contextData}>
      {/* todo:建議：讀取中時顯示 Loading Spinner，而不是 null，體驗較好 */}
      {isLoading ? null : children}
    </AuthContext.Provider>
  );
};