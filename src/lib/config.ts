/*用以儲存往網頁訊息的設定資料*/

const API_DEV_MODE: boolean = import.meta.env.DEV;
const DEV_API_PORT = import.meta.env.VITE_API_PORT ?? '8000';

// 根IP
export const ROOT_IP = API_DEV_MODE ? `http://localhost:${DEV_API_PORT}` : 'https://api.pigeonhand.tw';

// 會員註冊與實名認證統一由 Hand 正式站處理，不傳遞本站登入憑證。
export const HAND_SIGNUP_URL = 'https://pigeonhand.tw/signup';
export const HAND_ACCREDIT_URL = 'https://pigeonhand.tw/user/accredit';

// 儲存靜態媒體IP，不須以「/」開頭
export const MEDIA_IP = ROOT_IP;
// 訪問API之IP，須以「/」開頭
export const WEB_API = ROOT_IP + '/web';
export const USER_API = ROOT_IP + '/user';
export const V3_API = ROOT_IP + '/v3';
export const V3_USER_API = V3_API + '/user';
export const V3_EXAM_API = V3_API + '/exam';
export const POLICE_API = ROOT_IP + '/police';
export const EXAM_API = ROOT_IP + '/exam';
export const EXAM_API_V2 = ROOT_IP + '/v2/exam';
export const AI_API_V2 = ROOT_IP + '/v2/ai';