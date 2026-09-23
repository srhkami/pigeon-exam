import axios, {AxiosHeaders, CanceledError, type AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig} from "axios";
import {ROOT_IP} from "@/lib/config.ts";
import toast from "react-hot-toast";
import {clearTokens, loadTokens, saveTokens} from "@/auth/handleUser.ts";
import {isTokenPair, V3_AUTH_ENDPOINTS} from "@/auth/authContract.ts";
import {createRefreshCoordinator} from "@/auth/refreshCoordinator.ts";

type ReplayControlledRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  /** 用於可能計費的明確提交；不更新認證，也不重送原請求。 */
  skipAuthReplay?: boolean
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuthReplay?: boolean
  }
}

let instance: AxiosInstance | null = null;
let refreshCoordinator = createRefreshCoordinator();
let refreshOwner: {access: string; refresh: string} | null = null;
let lastRefresh: {previousAccess: string; access: string; refresh: string} | null = null;

function setAuthHeader(cfg: InternalAxiosRequestConfig | AxiosRequestConfig, token: string) {
  if (cfg.headers instanceof AxiosHeaders) {
    cfg.headers.set("Authorization", `Bearer ${token}`);
    return;
  }
  cfg.headers = {...(cfg.headers ?? {}), Authorization: `Bearer ${token}`};
}

async function refreshAccess(): Promise<string> {
  const tokens = loadTokens();
  if (!tokens) throw new Error("NO_REFRESH_TOKEN");
  const {data} = await axios.post<unknown>(V3_AUTH_ENDPOINTS.refresh, {refresh: tokens.refresh}, {timeout: 10000});
  const current = loadTokens();
  if (current?.access !== tokens.access || current?.refresh !== tokens.refresh) throw new CanceledError('登入狀態已變更');
  if (!isTokenPair(data)) throw new Error("auth_response_invalid");
  saveTokens(data);
  lastRefresh = {previousAccess: tokens.access, ...data};
  return data.access;
}

export default function useAxios(): AxiosInstance {
  if (instance) return instance;
  // 共用所有 API 領域；根路徑不可被加上會員專屬的 /user 前綴。
  instance = axios.create({baseURL: ROOT_IP, withCredentials: false, headers: {Accept: "application/json"}});
  instance.interceptors.request.use((cfg) => {
    const tokens = loadTokens();
    if (tokens?.access) setAuthHeader(cfg, tokens.access);
    return cfg;
  });
  instance.interceptors.response.use((res) => res, async (error: AxiosError) => {
    const original = error.config as ReplayControlledRequestConfig | undefined;
    if (!error.response || !original) throw error;
    if (error.response.status !== 401 || original._retry || original.skipAuthReplay || original.url?.includes("/token/refresh")) throw error;
    const failedAccess = original.headers.get('Authorization');
    const refreshTokens = loadTokens();
    if (original.signal?.aborted || !refreshTokens) throw new CanceledError('登入狀態已變更');
    original._retry = true;
    if (failedAccess !== `Bearer ${refreshTokens.access}`) {
      // 只接受本實例剛完成、且仍屬目前憑證對的更新；不可把舊請求換成另一個會員重送。
      if (failedAccess !== `Bearer ${lastRefresh?.previousAccess}` || lastRefresh?.access !== refreshTokens.access || lastRefresh.refresh !== refreshTokens.refresh) throw new CanceledError('登入狀態已變更');
      setAuthHeader(original, refreshTokens.access);
      return instance!(original);
    }
    if (refreshOwner?.access !== refreshTokens.access || refreshOwner?.refresh !== refreshTokens.refresh) {
      refreshCoordinator = createRefreshCoordinator();
      refreshOwner = refreshTokens;
    }
    const token = await refreshCoordinator.run(refreshAccess, () => {
      const current = loadTokens();
      if (current?.access !== refreshTokens.access || current?.refresh !== refreshTokens.refresh) return;
      clearTokens();
      toast.error("登入逾期，請重新登入");
    });
    if (original.signal?.aborted || loadTokens()?.access !== token) throw new CanceledError('登入狀態已變更');
    setAuthHeader(original, token);
    return instance!(original);
  });
  return instance;
}
