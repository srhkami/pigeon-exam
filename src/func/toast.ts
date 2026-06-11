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
      error: errorText,
    }
  )
}