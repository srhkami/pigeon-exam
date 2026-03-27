import {JSONContent} from "@tiptap/react";
import {HappyFileLink} from "@/types/happywork-types.ts";

/*===============*/
/* 選擇題 */
/*===============*/

// 選擇題題目（只讀）
export interface SelectQuestionReadData {
  id: number,
  question: string, //題目
  options: Array<string>, // 選項
  year: string, // 年份
  source: string, // 來源
  category: string, // 類別
  subject: string, // 科目
}

export interface SelectQuestionSimpleData extends SelectQuestionReadData {
  answer: Array<number>, // 解答
  article_link: Array<[string, string]>,// 法條連結，是['法規名稱','法條']組成的清單
  file_link: Array<HappyFileLink>, // 檔案連結
  comment: JSONContent | null, // 註解
  record_count: number,
  correct_count: number,
}

// 選擇題答題紀錄（輕量級）
export interface SelectRecordSimpleData {
  id: number,
  user: number,
  user_display: string,
  created_at: string,
  answer: Array<number | null>,
  is_correct: boolean,
}

// 選擇題題目（全般）
export interface SelectQuestionData extends SelectQuestionSimpleData {
  user: number,
  created_at: string, // 建立時間
  is_public: boolean, // 是否公開
  remark: string | null, // 備註
  user_display: string, // 出題者
  records: Array<SelectRecordSimpleData>,
}

// 選擇題答題紀錄（全般）
export interface SelectRecordData extends SelectRecordSimpleData {
  created_at: string,
  feedback_memo: string,
  feedback_score: number,
  question: SelectQuestionSimpleData,
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


/*===============*/
/* 申論題 */
/*===============*/

// 申論題題目（輕量級）
export interface EssayQuestionSimpleData {
  id: number,
  question: string,
  year: string,
  source: string,
  category: string,
  subject: string,
}

// 申論題作答紀錄（輕量級）
export interface EssayRecordSimpleData {
  id: number,
  user: number,
  user_display: string,
  content: string,
  is_public: boolean,
  is_anonymous: boolean,
}

// 申論題題目
export interface EssayQuestionData extends EssayQuestionSimpleData {
  user: number,
  user_display: string,
  created_at: string,
  sample_answer: JSONContent | null,
  article_link: Array<[string, string]>,
  file_link: Array<HappyFileLink>,
  is_public: boolean,
  records: Array<EssayRecordSimpleData>,
  record_count: number,
}

// 申論題作答紀錄
export interface EssayRecordData extends EssayRecordSimpleData {
  created_at: string,
  question: EssayQuestionSimpleData,
  question_id: number,
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

// 申論題卡片設定
export type EssayCardConfig = {
  showDetail: boolean, // 顯示來源及答案
  showLinks: boolean, // 顯示關聯
  showSample: boolean, // 顯示擬答
}


/*===============*/
/* 試卷 */
/*===============*/

// 試卷（只讀）
export interface PaperReadData {
  user_display: string, // 建立者
  title: string, // 標題
  subject: string, // 考試科目
  category: string, // 考試類科
  select_questions: Array<SelectQuestionReadData>,
  select_question_ids: Array<number>,
  essay_questions: Array<EssayQuestionSimpleData>,
  essay_question_ids: Array<number>,
  uuid: string,// 識別碼
  is_public: boolean, // 是否開放
  select_score: number,
  essay_score: number,
}

// 試卷
export interface PaperData extends PaperReadData {
  id: number,
  user: number,
  created_at: string, // 建立時間
  select_questions: Array<SelectQuestionSimpleData>,
  select_question_ids: Array<number>,
}

// 試卷編輯表單
export type PaperEditForm = {
  id?: number|null,
  title?: string, // 標題
  subject?: string, // 考試科目
  category?: string, // 考試類別
  select_question_ids?: Array<number>,
  essay_question_ids?: Array<number>,
  select_score?: number,
  essay_score?: number,
}


// 試卷提交表單
export type PaperSubmitForm = {
  title: string,
  subject: string,
  category: string,
  select_question_ids: Array<number>,
  select_answers: Array<Array<number | null>>,
  select_score?: number,
  essay_question_ids: Array<number>,
  essay_answers: Array<string>,
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

export type RatioData = {
  label: string,
  correct_count: number,
  total_count: number,
}

// 個人記錄
export type LogData = {
  select_logs: Array<RatioData>,
}

// 考古題資料
export  type ExamPastData = {
  year: string,
  source: string,
  category: string,
  subject: string,
}


export type StatsData = {
  period: string,
  correct_rate: number,
}
export type TrendData = {
  total_count: number,
  correct_count: number,
  stats: Array<StatsData>
}
