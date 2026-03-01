import {useAxios} from "@/hooks/index.ts";
import {showToast} from "@/func";
import {useEffect, useState} from "react";

type Config = {
  url: string,
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  params?: unknown,
  data?: unknown,
  label?: string,
  successText?: string,
  reload?: boolean,
  init?: boolean,
}

/**
 * 使用快顯通知的API請求
 * @param config.url API網址
 * @param config.method 請求方法，預設為GET
 * @param config.params 請求參數
 * @param config.data 請求資料
 * @param config.label 快顯通知的基礎文字
 * @param config.successText 快顯通知的成功文字
 * @param config.reload 用來偵測刷新的布林值
 * @return data 從API取得的資料
 * @return isLoading  是否還在載入中狀態
 */

export default function useToastApi<T = unknown>(config: Config) {

  const api = useAxios();
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (config.init === false) {
      return;
    }
    setIsLoading(true);
    showToast(
      api<T>({
        url: config.url,
        method: config.method ?? 'GET',
        params: config.params ?? {},
        data: config.data ?? {},
      }),
      {
        label: config.label ?? '載入',
        success: config.successText,
        error: (err) => JSON.stringify(err.response.data),
      }
    )
      .then(res => setData(res.data))
  }, [api, config]);

  return {data, isLoading};
}