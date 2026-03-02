// 選擇題
import {JSONContent} from "@tiptap/react";
import {HappyFileLink} from "@/types/happywork-types.ts";

export type ExamSelectData = {
  id: number,
  user: number,
  user_display: string, // 出題者
  created_at: string, // 建立時間
  question: string, //題目
  question_number: number | null, //題號
  options: Array<string>, // 選項
  answer: Array<number>, // 解答
  year: string, // 年份
  source: string, // 來源
  category: string, // 類別
  subject: string, // 科目
  is_public: boolean, // 是否公開
  total_count: number, // 總答題數
  right_count: number, // 正確答題數
  article_link: Array<[string, string]>,// 法條連結，是['法規名稱','法條']組成的清單
  file_link: Array<HappyFileLink>, // 檔案連結
  comment: JSONContent | null, // 註解
  remark: string | null, // 備註
  memo_count: number, // 筆記數量
}

export type ExamSelectReadData = {
  id: number,
  question: string, //題目
  options: Array<string>, // 選項
  year: string, // 年份
  source: string, // 來源
  category: string, // 類別
  subject: string, // 科目
}

// 選擇題卡片設定
export type ExamSelectCardConfig = {
  showOptions: boolean, // 顯示選項及來源
  showRating: boolean, // 顯示題目評級
  showLinks: boolean, // 顯示關聯
  showComment: boolean, // 顯示註解
}

// 題目列表
export type QuestionsData = {
  select?: Array<number>,
  input?: Array<number>
}

// 出題試卷
export type ExamPaperData = {
  id: number,
  user: number,
  user_display: string, // 建立者
  created_at: string, // 建立時間
  title: string, // 標題
  subject: string, // 考試科目
  category: string, // 考試類科
  questions: QuestionsData,
  uuid: string,// 識別碼
  is_public: boolean, // 是否開放
  total_count: number, // 總答題數
  right_count: number, // 正確答題數
}

// 答案列表
export type AnswerData = {
  select: Array<Array<number>>,
  input: Array<string>
}

// 對錯列表
export type ResultData = {
  select: Array<boolean>,
  input: Array<boolean>
}

// 測驗結果
export type ExamResultData = {
  id: number,
  created_at: string, // 建立時間
  user: number, // 答題者
  user_display: string,
  title: string,
  subject: string, // 試卷科目
  category: string, // 試卷類科
  questions: QuestionsData,
  answers: AnswerData, // 答題列表
  result: ResultData, // 對錯列表
  total_count: number, // 總答題數
  right_count: number, // 正確答題數
  remark: string | null, // 備註
}

// 個人記錄
export type ExamLogData = {
  total_count: number,
  right_count: number,
  paper_count: number,
}

// 考古題資料
export type ExamPastData = {
  year: string,
  source: string,
  category: string,
  subject: string,
}

// 筆記資料
export type ExamMemoData = {
  id: number,
  user: number,
  user_display: string, // 出題者
  question: number, // 對應題目
  created_at: string, // 建立時間
  article_link: Array<[string, string]>,// 法條連結，是['法規名稱','法條']組成的清單
  file_link: Array<HappyFileLink>, // 檔案連結
  comment: JSONContent | null, // 註解
  remark: string | null, // 備註
}

// 筆記表單
export type ExamMemoForm = {
  user: number,
  question: number, // 對應題目
  article_link: Array<[string, string]>,// 法條連結，是['法規名稱','法條']組成的清單
  file_link: Array<HappyFileLink>, // 檔案連結
  comment: JSONContent | null, // 註解
  remark: string | null, // 備註
}

// 申論題題目
export type ExamEssayData = {
  id: number,
  user: number,
  user_display: string,
  created_at: string,
  question: string,
  sample_answer: JSONContent | null,
  year: string,
  source: string,
  category: string,
  subject: string,
  article_link: Array<[string, string]>,
  file_link: Array<HappyFileLink>,
  is_public: boolean,
  answer_count: number,
}

// 申論題題目表單
export type ExamEssayForm = {
  question?: string,
  sample_answer?: JSONContent | null,
  year?: string,
  source?: string,
  category?: string,
  subject?: string,
  is_public?: boolean,
  article_link?: Array<[string, string]>,
  file_link?: Array<HappyFileLink>,
}

// 申論題題目
export type ExamEssayAnswerData = {
  id: number,
  user: number,
  user_display: string,
  question_display:string,
  created_at: string,
  question: number,
  content: JSONContent | null,
  likes: Array<number>,
  likes_count: number,
  is_liked:boolean,
}

// 申論題卡片設定
export type ExamEssayCardConfig = {
  showDetail: boolean, // 顯示來源及答案
  showLinks: boolean, // 顯示關聯
  showSample: boolean, // 顯示擬答
}