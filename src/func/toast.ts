import toast, {Renderable, ValueOrFunction} from "react-hot-toast";

export type ToastError = {
  response: { data: { detail: string } & Record<string, string> },
  respose: { data: { detail: string } },
}

export type ToastConfig = {
  label?: string,
  loading?: string,
  success?: string,
  error?: ValueOrFunction<Renderable, ToastError>,
}

function formatToastError(err: unknown, fallback: Renderable) {
  const error = err as { response?: { data?: unknown }, respose?: { data?: unknown } };
  const data = error?.response?.data ?? error?.respose?.data;
  if (!data) return fallback;

  if (typeof data === 'string') return data;
  const payload = data as { detail?: unknown, code?: unknown };
  if (typeof payload.detail === 'string') return payload.detail;
  if (typeof payload.code === 'string') return payload.code;

  if (data && typeof data === 'object') {
    const firstMessage = Object.values(data).find((value) => typeof value === 'string' && value.trim().length > 0);
    if (typeof firstMessage === 'string') return firstMessage;

    try {
      return JSON.stringify(data);
    } catch {
      return fallback;
    }
  }

  return fallback;
}

/* 自定義封裝toast Promise組件
*  可傳入簡易預設文字，或自訂每個值
*  若無傳入其他狀態文字，則預設生成預計的載入中與錯誤提示，而成功不顯示
* */
export default async function showToast<T>(
  func: Promise<T> | (() => Promise<T>),
  option?: ToastConfig,
) {

  const label = option?.label ? option.label : '處理';
  const loadingText = option?.loading ? option.loading : label + '中...';
  const successText = option?.success ? option.success : null;
  const errorText = option?.error ? option.error : label + '失敗，請重試';

  return await toast.promise(
    func,
    {
      loading: loadingText,
      success: successText,
      error: (err) => typeof errorText === 'function'
        ? errorText(err as ToastError)
        : formatToastError(err, errorText),
    }
  )
}
