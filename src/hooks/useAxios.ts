import axios, {AxiosHeaders, type AxiosError, type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig} from "axios";
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
const refreshCoordinator = createRefreshCoordinator();

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
  const {data} = await axios.post<unknown>(V3_AUTH_ENDPOINTS.refresh, {refresh: tokens.refresh});
  if (!isTokenPair(data)) throw new Error("auth_response_invalid");
  saveTokens(data);
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
    original._retry = true;
    const token = await refreshCoordinator.run(refreshAccess, () => {
      clearTokens();
      toast.error("登入逾期，請重新登入");
    });
    setAuthHeader(original, token);
    return instance!(original);
  });
  return instance;
}
