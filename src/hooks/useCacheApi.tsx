import {useEffect, useState} from 'react'
import localforage from 'localforage'
import {useAxios} from "@/hooks";
import toast from "react-hot-toast";
import {handleError} from "@/utils/errorReport.tsx";

type Config = {
  readonly url: string,
  readonly params?: { [k: string]: string },
  readonly reload?: boolean,
}

/**
 * 能使用緩存的API請求
 * @param config.url API網址，同時為儲存的key值，盡量讓params使用字串的方式傳入，以儲存成不同資料庫
 * @param config.params GET請求的參數，預設為空
 * @param config.reload 用來偵測重新刷新的值
 * @return data 資料
 * @return setData 設定資料的函數
 * @return loading  是否還在載入中狀態
 */
export default function useCacheApi<T>(config: Config) {

  const api = useAxios();
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setData(null);
    let isMounted = true // 確認此組件是否還在

    const fetchData = async () => {
      let t: string = '';
      try {
        // 1. 讀取快取資料
        const cacheData = await localforage.getItem<T>(config.url)
        if (cacheData && isMounted) {
          setData(cacheData)
        }
        if (!cacheData) {
          t = toast.loading('載入中...');
        }

        // 2. 從 API 拿新資料
        const res = await api({
          method: "GET",
          url: config.url,
          params: config.params,
        })
        const newData: T = res.data

        // 3. 比對資料是否不同
        const isSame = JSON.stringify(newData) === JSON.stringify(cacheData)
        if ((!isSame || !cacheData) && isMounted) {
          setData(newData)
          await localforage.setItem(config.url, newData)
        }
      } catch (error) {
        handleError(error, '緩存API錯誤')
      } finally {
        if (isMounted) setLoading(false)
        toast.dismiss(t)
      }
    }

    fetchData()
    return () => {
      isMounted = false
    }
  }, [config.url, config.reload, config.params, api])

  return {data, setData, loading}

}