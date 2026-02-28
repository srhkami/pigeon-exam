/* 會員相關類型*/

// 網站裡的會員資訊
export type UserInfo = {
  id: number,
  auth: string,
  email: string,
  wait_accredit: 0 | 1,
  expiry_days: number | null,
  bookmark: string | null,
  name: string | null,
  options: UserOptions,
}

// 會員個人選項
export type UserOptions = {
  traffic_bookmark?: Array<string>,
  law_bookmark?: Array<{ id: number, title: string }>,
}

// 會員詳情
export type UserDetailData = {
  id: number,
  email: string,
  auth: string,
  wait_accredit: 0 | 1,
  accredit_expiry: string | null,
  expiry_days: number | null,
  bookmark: string,
  options: UserOptions,
  name: string,
  unit_first: string,
  unit_second: string,
  unit_third: string,
  line_id: string,
  phone: string,
  job_title: string,
  user_file: string,
  line_connect: string,
  created_at: string,
  last_login_at: string,
  remark: string,
  who_accredit: string,
  accredited_at: string,
  community_join_at: string,
  community_log: Array<string>,
}

// 登入表單
export type UserLoginForm = {
  email: string,
  password: string,
}

// 信箱登入表單
export type EmailLoginForm = {
  email: string,
  code: string,
}

// 一般會員註冊表單
export type UserSignUpNormalForm = {
  // username: string,
  email: string,
  code: string,
  password: string,
  password_confirm: string,
  name: string,
  remark?: string,
}

// 會員認證表單
export type UserAccreditForm = {
  name: string,
  accredit_status?: number,
  upload_files?: Array<File>,
  user_file?: File,
  unit_first: string,
  unit_second: string,
  unit_third: string,
  phone: string,
  line_id: string,
  job_title: string,
  community_join_at?: string,
  community_log?: string,
  wait_accredit: 0 | 1,
} // 類別：實名認證表單
// 警職人員註冊表單

// 警職人員註冊表單
export type UserSignUpPoliceForm = UserSignUpNormalForm & UserAccreditForm


// 傳送Email的表單內容
export type EmailSendForm = {
  to_address: string,
  subject: string,
  text_body: string,
}

// 審核會員認證的表（僅限審核當下，故無法授予更高權限）
export type AccreditForm = {
  id: string,
  isPass: boolean, //是否通過，通過則延長期限，並更改權限
  isStudent?: boolean, // 是否僅為學生
  // new_auth: '0001' | '0011' | '0111'
  label: string;  // 提示
  text_body: string; // 信件內容
  accredit_expiry: string | null;
}

// 單位統計
export type UnitStatisticsData = [{
  unit_first: string,
  count: number,
  second_unit_sort: [{
    unit_second: string,
    count: number
  }]
}]

// 會員管理頁面所獲得的資訊
export type UserManageData = {
  accredited_users_count: number,
  community_users_count: number,
  student_users_count: number,
  wait_accredit_users_count: number,
  feedback_web_count: number,
  feedback_community_count: number,
  error_log_count: number,
  unit_statistics: UnitStatisticsData,
  seven_days_users: number,
  thirty_days_users: number,
}

// 管理員列表的資訊
export type ManagerInfoData = {
  'name': string,
  'unit_first': string,
  'unit_second': string,
}