import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios'
import {USER_API} from "@/lib/config.ts";
import toast from "react-hot-toast";
import {clearTokens, loadTokens, saveTokens, setAccess} from "@/auth/handleUser.ts";

let instance: AxiosInstance | null = null;
let refreshing = false;
let waiters: Array<(token: string) => void> = [];

// ⚠️ 用原生 axios 呼叫 refresh，避免攔截器遞迴
async function refreshAccess(): Promise<string> {
  const t = loadTokens();
  if (!t?.refresh) throw new Error("NO_REFRESH_TOKEN");
  const { data } = await axios.post(`${USER_API}/token/refresh/`, { refresh: t.refresh });
  const newAccess = data.access as string;
  const newRefresh = data.refresh as string | undefined; // ROTATE_REFRESH_TOKENS=True 時會有
  if (newRefresh) {
    // 旋轉後要存回新的 refresh，否則下一次 refresh 會用到「已黑掉」的舊 token
    saveTokens({ access: newAccess, refresh: newRefresh });
  } else {
    // 沒旋轉的設定就只更新 access
    setAccess(newAccess);
  }
  // 喚醒等待中的請求
  waiters.splice(0).forEach(fn => fn(newAccess));
  return newAccess;
}

// 小工具：安全設定 Authorization，因 Axios v1 headers 是 AxiosHeaders 物件
function setAuthHeader(cfg: InternalAxiosRequestConfig | AxiosRequestConfig, token: string) {
  // 轉成普通物件後再賦值，避免 .set() 沒有型別
  const h: Record<string, any> = cfg.headers ? (cfg.headers as any).toJSON?.() ?? cfg.headers : {};
  h["Authorization"] = `Bearer ${token}`;
  cfg.headers = h;
}

export default function useAxios(): AxiosInstance {
  if (instance) return instance;

  instance = axios.create({
    baseURL: USER_API,
    withCredentials: false,
    headers: {Accept: "application/json"},
  });

  // 請求攔截：帶上 Bearer
  instance.interceptors.request.use((cfg) => {
    const t = loadTokens();
    if (t?.access) setAuthHeader(cfg, t.access);
    return cfg;
  });

  // 回應攔截：401 → 刷新一次並重送
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;

      // 沒有回應（CORS/網路）→ 直接丟出，避免無限循環
      if (!error.response || !original) throw error;

      const status = error.response.status;

      // 避免對 refresh 本人重試、或重複重試
      const isRefreshCall = original.url?.includes("/token/refresh/");
      if (status !== 401 || original._retry || isRefreshCall) throw error;

      original._retry = true;

      try {
        if (refreshing) {
          // 等待已在進行的刷新完成
          const token = await new Promise<string>(resolve => waiters.push(resolve));
          setAuthHeader(original, token);
          return instance!(original);
        }

        refreshing = true;
        const token = await refreshAccess();
        refreshing = false;

        setAuthHeader(original, token);
        return instance!(original);
      } catch (e) {
        refreshing = false;
        waiters = []; // 避免殘留
        clearTokens();
        toast.error("登入逾期，請重新登入");
        throw e;
      }
    }
  );

  return instance;
}