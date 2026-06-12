type ApiErrorLike = {
  response?: {
    status?: number,
    data?: unknown,
  },
  respose?: {
    status?: number,
    data?: unknown,
  },
}

function collectMessages(value: unknown): Array<string> {
  if (typeof value === "string") {
    return value.trim() ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(item => collectMessages(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap(item => collectMessages(item));
  }

  return [];
}

export default function getApiErrorMessage(error: unknown, fallback = "操作失敗，請稍後再試"): string {
  const apiError = error as ApiErrorLike;
  const response = apiError?.response ?? apiError?.respose;
  const status = response?.status;
  const data = response?.data;

  if (status === 403) {
    return "權限不足，請確認帳號權限或重新登入。";
  }

  if (status === 404) {
    return "資料不存在或無權查看此資料。";
  }

  if (status === 429) {
    const detail = data && typeof data === "object" && "detail" in data
      ? (data as { detail?: unknown }).detail
      : undefined;
    return typeof detail === "string" && detail.trim().length > 0
      ? `操作太頻繁，請稍後再試。${detail}`
      : "操作太頻繁，請稍後再試。";
  }

  if (status === 400) {
    const messages = collectMessages(data);
    if (messages.length > 0) {
      return messages.join("、");
    }
  }

  if (typeof data === "string" && data.trim().length > 0) {
    return data;
  }

  if (data && typeof data === "object") {
    const payload = data as Record<string, unknown>;
    if (typeof payload.detail === "string" && payload.detail.trim().length > 0) {
      return payload.detail;
    }
    if (typeof payload.code === "string" && payload.code.trim().length > 0) {
      return payload.code;
    }

    const messages = collectMessages(payload);
    if (messages.length > 0) {
      return messages.join("、");
    }
  }

  return fallback;
}
