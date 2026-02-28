import {Dispatch, SetStateAction} from "react";
import isEqual from "fast-deep-equal";
import {ApiResData, ApiResInfo} from "@/types/api-types.ts";
import {showToast} from "@/utils/handleToast.ts";

type TWithId = { id: number };

/**
 * 把從API取得的資料，經比對後刷新顯示
 * @param fetchData 取得資料的Promise函數，通常是useAxios的API，返回res.data
 * @param setData 設定Data狀態
 * @param setPageInfo 設定頁面資訊
 */
export function showData<T extends TWithId>(
  fetchData: () => Promise<ApiResData<Array<T>>>,
  setData: Dispatch<SetStateAction<Array<T>>>,
  setPageInfo: Dispatch<SetStateAction<ApiResInfo>>,
) {
  showToast(
    async () => {
      const resData = await fetchData();
      const newItems = resData.results;
      setPageInfo({
        page_count: resData.page_count,
        page_number: resData.page_number,
        total_count: resData.total_count,
      });
      setData(prevItems => {
        // 建立一個映射以方便比對
        const prevMap = new Map(prevItems.map(item => [item.id, item]));
        // 建立一個最後輸出的清單
        const updated: Array<T> = [];
        // 處理新增與更新
        for (const newItem of newItems) {
          const prevItem = prevMap.get(newItem.id);
          if (!prevItem || !isEqual(prevItem, newItem)) {
            updated.push(newItem); // 新增或已變更
          } else {
            updated.push(prevItem); // 沒變則保留原參考
          }
        }
        return updated;
      });
    }, {baseText: '載入'}
  ).catch(err => console.error('取得資料錯誤:', err))
}
