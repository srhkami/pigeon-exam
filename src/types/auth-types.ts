import {UserInfo} from "./user-types.ts";

/*權限相關類型*/

// 全域權限驗證
export type TypeAuthContext = {
  isAuthenticated: boolean,
  setIsAuthenticated: (val: boolean) => void,
  onReload: ()=>void,
  userInfo: UserInfo,
}

// 1. 創建一個 readonly 的陣列 (作為單一真理來源)
export const AUTH_CHECK_KEYS = [
  'AM', 'UM', 'TM', 'CM', 'EM','EH',
  'T', 'C', 'S', 'E', 'L'
] as const; // "as const" 非常重要，它會將內容鎖定為具體的字串字面量

// 2. 從陣列中提取出 Union Type ('AM' | 'UM' | 'TM'...)
// 各類權限
export type AuthType = typeof AUTH_CHECK_KEYS[number];

// 確認權限，數字代表位數
export type AuthCheckTarget = {
  [K in AuthType]: number;
};

// 權限位數
export const AUTH_CHECK: AuthCheckTarget = {
  L: 0, // 僅登入
  AM: 1,  // 最高管理員
  UM: 2, // 會員管理
  TM: 3, // 交通管理
  CM: 4, // 警政管理
  EM: 5, // 測驗管理
  EH: 6, // 測驗協作
  E: 13, // 測驗
  C: 14, // 警政
  T: 15, // 交通
  S: 16, // 學生
}