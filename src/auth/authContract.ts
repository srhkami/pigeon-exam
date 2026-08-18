import {V3_USER_API} from "@/lib/config.ts";

export const V3_AUTH_ENDPOINTS = {
  loginPassword: `${V3_USER_API}/login/password`,
  loginEmail: `${V3_USER_API}/login/email`,
  refresh: `${V3_USER_API}/token/refresh`,
  verify: `${V3_USER_API}/token/verify`,
  logout: `${V3_USER_API}/logout`,
} as const;

export type Tokens = { access: string; refresh: string };

type V3Error = {
  code?: unknown;
  message?: unknown;
  details?: { fields?: Record<string, unknown> };
  request_id?: unknown;
};

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

export const isTokenPair = (value: unknown): value is Tokens => {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return isNonEmptyString(data.access) && isNonEmptyString(data.refresh);
};

export const isUserTokenVerifyResponse = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return Number.isInteger(data.id) && isNonEmptyString(data.auth) && isNonEmptyString(data.email)
    && typeof data.wait_accredit === "number" && typeof data.ai_point === "number";
};

export const isLogoutResponse = (value: unknown): value is { logged_out: true } =>
  Boolean(value && typeof value === "object" && (value as Record<string, unknown>).logged_out === true);

export const getV3AuthErrorMessage = (error: unknown, fallback = "登入失敗，請稍後再試。") => {
  const response = (error as { response?: { status?: unknown; data?: unknown } } | undefined)?.response;
  if (response?.status === 429) return "請稍後再試";
  const data = response?.data as V3Error | undefined;
  if (data?.code === "email_code_blocked") return "驗證碼錯誤次數過多。";
  if (typeof data?.message === "string" && data.message.trim()) return data.message;
  return fallback;
};
