/* 開心上班資料庫相關類型 */

// 從API取得的目錄資料
export type FolderApiData = {
  breadcrumb: Array<FolderDetailData>,
  folders: Array<FolderDetailData>,
}

// 目錄詳情
export type FolderDetailData = {
  'id': number,
  'name': string,
  'path': string,
  'depth': number,
  'numchild': number,
}

// 檔案詳情
export type FileDetailData = {
  id: number,
  user: number,
  user_display: string,
  date: number,
  title: string,
  category: number,
  category_display: string,
  file: string,
  url: string,
  review: number,
  review_display: string,
  tag: string,
  short_url: string,
  remark: string | null,
  updated_at: string,
  password: string,
}

// 檔案上傳與修改表單
export type FileForm = {
  user?: number,
  date: number,
  title: string,
  category?: number,
  upload_files?: Array<File>,
  file?: File,
  url?: string | null,
  review?: number,
  tag?: string | Array<string>,
}

// 搜尋結果
export type HappyworkSearchResultData = {
  folders: Array<FolderDetailData>,
  files: Array<FileDetailData>,
}

export type HappyFileLink = {
  id: string,
  title: string,
  url: string
}
