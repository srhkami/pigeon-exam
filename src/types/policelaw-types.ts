/* 警察法規資料庫相關類型 */

// 警察法規詳情
export type PoliceLawData = {
  id: number,
  cate_name: string,
  serial_number: string,
  law_class: string,
  law_name: string,
  release_date: string,
  content: Array<PoliceLawContent>,
}

// 警察法規條文資料
export type PoliceLawContent = {
  article: string,
  text: string,
}