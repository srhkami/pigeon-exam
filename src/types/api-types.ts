/* API相關的類型 */

//DRF Viewset API 返回的頁面資訊
export type ApiResInfo = {
  "total_count": number,
  "page_count": number,
  "page_number": number,
}

//DRF Viewset API 返回的格式
export type ApiResData<T> = {
  "next": string | null,
  "previous": string | null,
  "results": T,
} & ApiResInfo

// 向API傳送的關鍵字表單
export type ApiKeywordForm = {
  keyword: string,
}

export type ApiFilterKey = {
  search?: string,
  ordering?: string,
  review?: string,
  accredit_status?: string,
  community_join_at__isnull?: string,
  accredit_expiry?: string,
  mode?: string,
  auth?: string,
  last_login_after?: string,
  year?: string,
  source?: string,
  category?: string,
  subject?: string,
  is_public?: string,
  status?: string,
  title?: string,
}

// 定義單個選項的結構
type FilterOption = {
  label: string; // 按鈕上顯示的文字 (例如: "從新到舊")
  value: string; // 實際送出的值 (例如: "-id")
}

/**
 * 定義整個篩選群組的結構
 * @param title 標題 (例如: "排序")
 * @param fieldName 對應到 useForm 的欄位名稱 (例如: "ordering")
 * @options 該群組下的選項列表
 */
export type FilterConfig = {
  title: string;
  fieldName: keyof ApiFilterKey;
  options: FilterOption[];
}

// 推送消息表單
export type WebPushForm = {
  to_user_id?: number, // 預設不指定會員
  group?: number, // 預設全域推送
  payload: {
    title: string,
    body: string,
    icon: '/icons/Logo192.png',
    url: string,
  }
}