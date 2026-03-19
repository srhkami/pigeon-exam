// 選擇題
import {JSONContent} from "@tiptap/react";
import {HappyFileLink} from "@/types/happywork-types.ts";

// 選擇題題目
export type SelectQuestionData = {
  id: number,
  user: number,
  user_display: string, // 出題者
  created_at: string, // 建立時間
  question: string, //題目
  options: Array<string>, // 選項
  answer: Array<number>, // 解答
  year: string, // 年份
  source: string, // 來源
  category: string, // 類別
  subject: string, // 科目
  is_public: boolean, // 是否公開
  article_link: Array<[string, string]>,// 法條連結，是['法規名稱','法條']組成的清單
  file_link: Array<HappyFileLink>, // 檔案連結
  comment: JSONContent | null, // 註解
  remark: string | null, // 備註
}

// 選擇題題目（只讀）
export type SelectQuestionReadData = {
  id: number,
  question: string, //題目
  options: Array<string>, // 選項
  year: string, // 年份
  source: string, // 來源
  category: string, // 類別
  subject: string, // 科目
}

// 選擇題表單
export type SelectQuestionForm = {
  question?: string, //題目
  options?: Array<string>, // 選項
  answer?: Array<number>, // 解答
  year?: string, // 年份
  source?: string, // 題目來源
  category?: string, // 類科
  subject?: string, // 科目
  is_public?: boolean, // 是否公開
  article_link?: Array<[string, string]>// 法條連結，是['法規名稱','法條']組成的清單
  file_link?: Array<HappyFileLink>, // 檔案連結
  comment?: JSONContent | null, // 註解
  remark?: string | null, // 備註
}

// 選擇題卡片設定
export type SelectCardConfig = {
  showOptions: boolean, // 顯示選項及來源
  showRating: boolean, // 顯示題目評級
  showLinks: boolean, // 顯示關聯
  showComment: boolean, // 顯示註解
}

// 選擇題答題紀錄
export type SelectRecordData = {
  id: number,
  user: number,
  user_display: string,
  created_at: string,
  answer: Array<number | null>,
  is_correct: boolean,
  feedback_memo: string,
  feedback_score: number,
  question: SelectQuestionData,
}

// 試卷
export type PaperData = {
  id: number,
  user: number,
  user_display: string, // 建立者
  created_at: string, // 建立時間
  title: string, // 標題
  subject: string, // 考試科目
  category: string, // 考試類科
  select_questions: Array<SelectQuestionReadData>,
  select_question_ids: Array<number>,
  essay_questions: Array<EssayQuestionData>,
  essay_question_ids: Array<number>,
  uuid: string,// 識別碼
  is_public: boolean, // 是否開放
  select_score: number,
  essay_score: number,
}

// 試卷提交表單
export type PaperSubmitForm = {
  title: string,
  subject: string,
  category: string,
  select_question_ids?: Array<number>,
  select_answers?: Array<Array<number | null>>,
  select_score?: number,
  essay_question_ids?: Array<number>,
  essay_answers?: Array<string>,
  essay_score?: number,
}

// 試卷結果
export type PaperRecordData = {
  id: number,
  user: number,
  user_display: string, // 建立者
  created_at: string, // 建立時間
  title: string, // 標題
  subject: string, // 考試科目
  category: string, // 考試類科
  select_records: Array<SelectRecordData>,
  essay_records: Array<number>,
  score: number,
  remark: string,
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


// 申論題題目
export type EssayQuestionData = {
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
  record_count: number,
}

// 申論題題目表單
export type EssayQuestionForm = {
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

// 申論題答題紀錄
export type EssayRecordData = {
  id: number,
  user: number,
  user_display: string,
  question_display: string,
  created_at: string,
  question: number,
  content: JSONContent | null,
  likes: Array<number>,
  likes_count: number,
  is_liked: boolean,
}

// 申論題卡片設定
export type EssayCardConfig = {
  showDetail: boolean, // 顯示來源及答案
  showLinks: boolean, // 顯示關聯
  showSample: boolean, // 顯示擬答
}