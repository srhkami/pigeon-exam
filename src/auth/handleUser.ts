import axios from "axios";
import {USER_API} from "@/lib/config.ts";
import {EmailLoginForm, UserLoginForm, UserSignUpNormalForm} from "@/types/user-types.ts";

// Token的類別
type Tokens = { access: string; refresh: string };

type LoginResponse = {
  access: string;
  refresh: string;
};

// localStorage 的 key
export const LS_KEY = "ph_tokens";

// 載入token
export const loadTokens = (): Tokens | null => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "null");
  } catch {
    return null;
  }
};

// 儲存token
export const saveTokens = (t: Tokens) => localStorage.setItem(LS_KEY, JSON.stringify(t));

// 設定Access Token
export const setAccess = (access: string) => {
  const cur = loadTokens();
  if (!cur) return;
  saveTokens({...cur, access});
};

// 清除token
export const clearTokens = () => localStorage.removeItem(LS_KEY);

// 登入
export async function handleLogin(formData: UserLoginForm) {
  const {data} = await axios<LoginResponse>({
    method: "POST",
    url: USER_API + "/login/password/",
    data: formData
  });
  saveTokens(data);
}

// 信箱登入
export async function handleEmailLogin(formData: EmailLoginForm) {
  const {data} = await axios<LoginResponse>({
    method: 'POST',
    url: USER_API + '/login/email/',
    data: formData,
  });
  saveTokens(data);
}

// 註冊
export async function handleSignUp(formData: UserSignUpNormalForm) {
  const res = await axios({
    method: 'POST',
    url: USER_API + '/signup/',
    data: formData,
  });
  return res.data.email
}

// 登出
export async function handleLogout() {
  const tokens = loadTokens();
  clearTokens();
  return axios({
    method: 'POST',
    url: USER_API + '/logout/',
    data:{
      refresh: tokens?.refresh
    }
  });
}

export const unitFirstItems = [
  '內政部警政署','刑事警察局', '基隆市警察局', "新北市政府警察局", "臺北市政府警察局", "桃園市政府警察局", "新竹縣政府警察局",
  "新竹市警察局", "苗栗縣警察局", "臺中市政府警察局", "南投縣政府警察局", "彰化縣警察局", "雲林縣警察局",
  "嘉義縣警察局", "嘉義市政府警察局", "臺南市政府警察局", "高雄市政府警察局", "屏東縣政府警察局",
  "宜蘭縣政府警察局", "花蓮縣警察局", "臺東縣警察局", "連江縣警察局", "金門縣警察局", "澎湖縣政府警察局",
  "航空警察局", "鐵路警察局", "國道公路警察局", "保安警察第一總隊", "保安警察第二總隊", "保安警察第三總隊",
  "保安警察第四總隊", "保安警察第五總隊", "保安警察第六總隊", "保安警察第七總隊", "臺中港務警察總隊",
  "高雄港務警察總隊", "基隆港務警察總隊", '中央警察大學', '臺灣警察專科學校', '113年特考班', '其他警務機關', '非警職其他機關']
