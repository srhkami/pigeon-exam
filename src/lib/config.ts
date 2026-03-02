/*用以儲存往網頁訊息的設定資料*/

const DEV_MODE: boolean = true;

// 根IP
export const ROOT_IP = DEV_MODE ? 'http://localhost:8000' : 'https://api.pigeonhand.tw';  // 正式環境


// 儲存靜態媒體IP，不須以「/」開頭
export const MEDIA_IP = ROOT_IP;
// 訪問API之IP，須以「/」開頭
export const WEB_API = ROOT_IP + '/web';
export const USER_API = ROOT_IP + '/user';
export const POLICE_API = ROOT_IP + '/police';
export const TRAFFIC_API = ROOT_IP + '/traffic';