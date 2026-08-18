import axios from "axios";
import {USER_API} from "@/lib/config.ts";
import {isLogoutResponse, isTokenPair, type Tokens, V3_AUTH_ENDPOINTS} from "@/auth/authContract.ts";
import {EmailLoginForm, UserLoginForm, UserSignUpNormalForm} from "@/types/user-types.ts";

export const LS_KEY = "ph_tokens";

export const loadTokens = (): Tokens | null => {
  try {
    const tokens: unknown = JSON.parse(localStorage.getItem(LS_KEY) || "null");
    return isTokenPair(tokens) ? tokens : null;
  } catch {
    return null;
  }
};

export const saveTokens = (tokens: unknown) => {
  if (!isTokenPair(tokens)) throw new Error("auth_response_invalid");
  localStorage.setItem(LS_KEY, JSON.stringify(tokens));
};

export const clearTokens = () => localStorage.removeItem(LS_KEY);

export async function handleLogin(formData: UserLoginForm) {
  const {data} = await axios<unknown>({method: "POST", url: V3_AUTH_ENDPOINTS.loginPassword, data: formData});
  saveTokens(data);
}

export async function handleEmailLogin(formData: EmailLoginForm) {
  const {data} = await axios<unknown>({method: "POST", url: V3_AUTH_ENDPOINTS.loginEmail, data: formData});
  saveTokens(data);
}

export async function handleSignUp(formData: UserSignUpNormalForm) {
  const res = await axios({method: 'POST', url: USER_API + '/signup/', data: formData});
  return res.data.email;
}

export async function handleLogout() {
  const tokens = loadTokens();
  clearTokens();
  const response = await axios({method: 'POST', url: V3_AUTH_ENDPOINTS.logout, data: {refresh: tokens?.refresh}});
  if (!isLogoutResponse(response.data)) throw new Error("auth_response_invalid");
  return response;
}

export const unitFirstItems = [
  '內政部警政署','刑事警察局', '基隆市警察局', "新北市政府警察局", "臺北市政府警察局", "桃園市政府警察局", "新竹縣政府警察局",
  "新竹市警察局", "苗栗縣警察局", "臺中市警察局", "南投縣警察局", "彰化縣警察局", "雲林縣警察局",
  "嘉義縣警察局", "嘉義市警察局", "臺南市警察局", "高雄市警察局", "屏東縣警察局",
  "宜蘭縣警察局", "花蓮縣警察局", "臺東縣警察局", "連江縣警察局", "金門縣警察局", "澎湖縣警察局",
  "航空警察局", "鐵路警察局", "國道公路警察局", "保安警察第一總隊", "保安警察第二總隊", "保安警察第三總隊",
  "保安警察第四總隊", "保安警察第五總隊", "保安警察第六總隊", "保安警察第七總隊", "臺中港務警察總隊",
  "高雄港務警察總隊", "基隆港務警察總隊", '中央警察大學', '臺灣警察專科學校', '113年特考班', '其他警務機關', '非警職其他機關'];
