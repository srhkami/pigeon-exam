import {useParams, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {showData} from "@/hooks/showData.ts";
import {ApiResData, ApiResInfo} from "@/types/api-types.ts";
import {useAxios} from "@/hooks/index.ts";
import {Method} from "axios";

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
 */
export default function useDataBrowser<T extends TWithId>(config: Config) {

  const api = useAxios();
  const {page} = useParams();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);   // 解析params，轉換為物件

  const [data, setData] = useState<Array<T>>([]);
  const [pageInfo, setPageInfo] = useState<ApiResInfo>({page_count: 1, total_count: 0, page_number: 1});

  // 重新載入
  const [reload, setReload] = useState(false);

  //請求資料
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

  // 取得資料並刷新
  useEffect(() => {
    showData<T>(fetchData, setData, setPageInfo)
  }, [searchParams, page, reload]);

  return {params, data, pageInfo, setReload}
}