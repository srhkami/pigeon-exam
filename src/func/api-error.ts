type ApiResponse = {
  readonly status?: unknown,
  readonly data?: unknown,
}

type ApiErrorLike = {
  readonly response?: ApiResponse,
}

type ServerMessageMap = {
  readonly [status: number]: {
    readonly [key: string]: {
      readonly [context: string]: Readonly<Record<string, string>>,
    },
  },
};

export type UserFacingErrorOptions = {
  readonly fallback?: string,
  readonly context?: string,
  readonly codeMessages?: Readonly<Record<string, string>>,
  readonly serverMessages?: ServerMessageMap,
}

function getResponse(error: unknown): ApiResponse | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const apiError = error as ApiErrorLike;
  return apiError.response;
}

function getRecord(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Readonly<Record<string, unknown>>
    : undefined;
}

export function getUserFacingErrorMessage(error: unknown, options: UserFacingErrorOptions = {}): string {
  const fallback = options.fallback ?? "操作失敗，請稍後再試。";
  const response = getResponse(error);
  const status = response?.status;

  if (status === 401) return "登入已逾期，請重新登入。";
  if (status === 403) return "權限不足，請確認帳號權限或重新登入。";
  if (status === 404) return "資料不存在或無權查看此資料。";
  if (status === 429) return "操作太頻繁，請稍後再試。";
  if (status === 500) return "伺服器暫時無法處理，請稍後再試。";

  const data = getRecord(response?.data);
  const code = data?.code;
  if (typeof code === "string" && options.codeMessages?.[code]) {
    return options.codeMessages[code];
  }

  const key = typeof code === "string" ? "code" : "detail";
  const value = data?.[key];
  if (typeof status === "number" && typeof value === "string" && options.context) {
    const message = options.serverMessages?.[status]?.[key]?.[options.context]?.[value];
    if (message) return message;
  }

  return fallback;
}

export default function getApiErrorMessage(error: unknown, fallback = "操作失敗，請稍後再試。"): string {
  return getUserFacingErrorMessage(error, {fallback});
}