import {useParams, useSearchParams} from "react-router";
import {useQuery, keepPreviousData} from '@tanstack/react-query';
import {ApiResData, ApiResInfo} from "@/types/api-types.ts";
import {useAxios} from "@/hooks/index.ts";
import {Method} from "axios";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {errorLogger} from "@/func";

type TWithId = { id: number };

type Config = {
  url: string,
  pageSize?: number,
  defaultParams?: { [k: string]: string },
  method?: Method,
}

/**
 * 資料列表檢視頁取得資料及提供資料的hook
 * @T 是個包含id的類型，且要從ApiResData去取得
 * @param config.url 網址
 * @param config.pageSize 每頁顯示的數量
 * @param config.defaultParams 預設傳遞的參數
 * @param config.method 請求方式
 * @return params 頁面的參數物件
 * @return data 資料列表
 * @return pageInfo 頁面的資訊，總頁數、資料總數、當前頁碼
 * @return setReload 重新送出請求的函數
 * @return isLoading 是否載入中
 * @return isFetching 是否取得資料中
 * @return isError 是否錯誤
 * @return error 錯誤內容
 */
export default function useDataBrowser<T extends TWithId>(config: Config) {

  const api = useAxios();
  const {page} = useParams();
  const [searchParams] = useSearchParams();
  const [reload, setReload] = useState<boolean>(false);

  const params = Object.fromEntries(searchParams);   // 解析params，轉換為物件
  const pageNumber = Number(page) || 1;
  const pageSize = config.pageSize ?? 30;

  // 請求資料的函數
  const fetchData: () => Promise<ApiResData<Array<T>>> = async () => {
    const res = await api<ApiResData<Array<T>>>({
      method: config.method ?? 'GET',
      url: config.url,
      params: {
        ...config.defaultParams,
        ...params,
        page_size: config.pageSize ?? 30, //單頁顯示數量
        page: page, // 當前頁碼
      }
    })
    return res.data;
  }

  // 使用useQuery
  const {
    data: apiRes,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    // 當這些變數改變時，自動重新觸發請求
    queryKey: [config.url, params, pageNumber, pageSize, reload],
    // 請求的函數
    queryFn: fetchData,
    // 換頁時保留舊資料，直到新資料載入完成 (避免畫面閃爍)
    placeholderData: keepPreviousData,
    // 結構共享，自動比對新舊資料
    structuralSharing: true,
    retry: 1,
  })

  // 載入中及錯誤提示
  useEffect(() => {
    if (isFetching) {
      toast.loading('資料載入中')
    }
    if (!isFetching) {
      toast.dismiss()
    }
    if (isError && error) {
      errorLogger(error, '取得資料錯誤')
    }
  }, [isFetching, isError, error, reload]);

  // 整理回傳的變數
  const data = apiRes?.results ?? []
  const pageInfo: ApiResInfo = {
    page_count: apiRes?.page_count ?? 1,
    total_count: apiRes?.total_count ?? 0,
    page_number: apiRes?.page_number ?? pageNumber,
  }

  return {
    params,
    data,
    pageInfo,
    setReload,
    onRefetch: refetch,
    isLoading,
    isFetching,
    isError,
    error
  }
}