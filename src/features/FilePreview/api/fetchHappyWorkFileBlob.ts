import type {AxiosInstance} from "axios";
import {ROOT_IP} from "@/lib/config.ts";

type HappyWorkFileBlobResult = {
  blob: Blob,
  contentType: string | null,
  contentDisposition: string | null,
};

function normalizeHeaderValue(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeContentTypeValue(value: unknown): string | null {
  const header = normalizeHeaderValue(value);

  if (!header) {
    return null;
  }

  return header.toLowerCase().split(";", 1)[0].trim();
}

function getHappyWorkApiRoot(): string {
  return new URL(ROOT_IP).origin;
}

function isHappyWorkAbsoluteHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function normalizeHappyWorkFileUrl(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("檔案網址不可為空。");
  }

  if (trimmed.startsWith("/") || isHappyWorkAbsoluteHttpUrl(trimmed)) {
    const parsed = trimmed.startsWith("/") ? new URL(trimmed, ROOT_IP) : new URL(trimmed);

    if (parsed.origin !== getHappyWorkApiRoot()) {
      throw new Error("檔案網址必須來自同一個 API 根路徑。");
    }

    return parsed.toString();
  }

  throw new Error("檔案網址格式不正確。");
}

function isForbiddenDownloadFilenameChar(char: string): boolean {
  const code = char.charCodeAt(0);

  return code <= 0x1f
    || code === 0x7f
    || (code >= 0x202a && code <= 0x202e)
    || (code >= 0x2066 && code <= 0x2069)
    || char === "\\"
    || char === "/";
}

function sanitizeDownloadFilename(value: string): string {
  const cleaned = value
    .split("")
    .map(char => (isForbiddenDownloadFilenameChar(char) ? "_" : char))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return "download";
  }

  return cleaned.slice(0, 180);
}

function decodeRfc5987Value(value: string): string | null {
  const trimmed = value.trim().replace(/^"(.*)"$/, "$1");
  const match = trimmed.match(/^([^']*)'[^']*'(.*)$/);
  const encodedValue = match ? match[2] : trimmed;

  try {
    return decodeURIComponent(encodedValue);
  } catch {
    return null;
  }
}

export function getHappyWorkHttpStatus(error: unknown): number | null {
  const candidate = error as {response?: {status?: unknown}};

  return typeof candidate?.response?.status === "number" ? candidate.response.status : null;
}

export function getHappyWorkFileAccessMessage(status: number | null | undefined): string {
  switch (status) {
    case 401:
      return "此檔案需登入後才能查看，請先登入。";
    case 403:
      return "目前帳號沒有檢視此檔案的權限。";
    case 415:
      return "此檔案目前僅支援下載，無法線上預覽。";
    case 404:
      return "檔案不存在或已失效。";
    default:
      return "檔案載入失敗，請稍後再試。";
  }
}

export async function fetchHappyWorkFileBlob(api: AxiosInstance, url: string): Promise<HappyWorkFileBlobResult> {
  const normalizedUrl = normalizeHappyWorkFileUrl(url);
  const response = await api.get<Blob>(normalizedUrl, {
    responseType: "blob",
  });
  const headers = response.headers as Record<string, unknown>;

  return {
    blob: response.data,
    contentType: normalizeContentTypeValue(headers["content-type"] ?? headers["Content-Type"]),
    contentDisposition: normalizeHeaderValue(headers["content-disposition"] ?? headers["Content-Disposition"]),
  };
}

export function isHappyWorkInlinePreviewContentType(contentType: string | null | undefined): boolean {
  if (!contentType) {
    return false;
  }

  const normalized = contentType.toLowerCase().split(";", 1)[0].trim();

  return normalized === "application/pdf" || (normalized.startsWith("image/") && normalized !== "image/svg+xml");
}

export function resolveHappyWorkDownloadFilename(contentDisposition: string | null | undefined, fallbackTitle: string): string {
  const header = contentDisposition?.trim();

  if (header) {
    const starMatch = header.match(/filename\*\s*=\s*([^;]+)/i);

    if (starMatch) {
      const decoded = decodeRfc5987Value(starMatch[1]);

      if (decoded) {
        return sanitizeDownloadFilename(decoded);
      }
    }

    const plainMatch = header.match(/filename\s*=\s*([^;]+)/i);

    if (plainMatch) {
      const plainValue = plainMatch[1].trim().replace(/^"(.*)"$/, "$1");

      if (plainValue) {
        return sanitizeDownloadFilename(plainValue);
      }
    }
  }

  return sanitizeDownloadFilename(fallbackTitle);
}

export async function downloadHappyWorkFile(api: AxiosInstance, url: string, fallbackTitle: string): Promise<void> {
  const {blob, contentDisposition} = await fetchHappyWorkFileBlob(api, url);
  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = resolveHappyWorkDownloadFilename(contentDisposition, fallbackTitle);
    link.rel = "noopener";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
  }
}
