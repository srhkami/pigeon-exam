import {UserInfo} from "@/types/user-types.ts";
import axios from "axios";
import {WEB_API} from "@/utils/config.ts";
import {showToast} from "@/utils/handleToast.ts";
import {handleError} from "@/utils/errorReport.tsx";

// 公鑰
const VAPID_PUBLIC_KEY = "BA9proaLjvxGYWj1JWyD7xms1oZh7PzL1VRpBaVNzygiZ_BNegyZaSGXkm4Ggn_eklJTrlTzVVWXP62abQj1dpY";

// 利用base64轉碼
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
};

// ✅ 通用取得 SW 註冊
const getSWRegistration = async () => {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    return await navigator.serviceWorker.register("/sw.js");
  }
  throw new Error("您的瀏覽器不支援通知功能");
};

// 請求通知權限
export async function requestPermission() {
  showToast(
    async () => {
      if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        throw new Error('您的瀏覽器不支援通知功能')
      }
      await Notification.requestPermission()
        .then((status) => {
          if (status !== 'granted') {
            throw new Error('授權失敗，請至設定更改權限');
          }
        })
    },
    {
      success: '授權成功',
      error: err => err.toString(),
    }
  ).catch(err => handleError(err,'請求通知權限錯誤'))
}

/**
 * 訂閱通知，向後端傳送訂閱資料，儲存在資料庫
 * @param userInfo 會員資訊，僅登入後可取得
 * @param group 要訂閱的組別 0全域/1管理員
 */
export async function subscribeNotifications(userInfo: UserInfo, group: 0 | 1) {
  showToast(
    async () => {
      const registration = await getSWRegistration();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await axios({
        url: WEB_API + "/webpush/subscribe/",
        method: "POST",
        data: {
          subscription: subscription,
          user_id: userInfo.id,
          group: group,
        }
      })
    },
    {success: '訂閱成功'}
  ).catch(err =>handleError(err,'訂閱通知錯誤'));
}

/**
 * 取消訂閱通知，會刪除後端所有對應會員ID的訂閱通知資料
 * @param userInfo 會員資訊
 */
export async function unsubscribeNotifications(userInfo: UserInfo) {
  showToast(async () => {
      const registration = await getSWRegistration();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      await axios({
        url: WEB_API + "/webpush/unsubscribe/",
        method: "POST",
        data: {
          subscription: subscription,
          user_id: userInfo.id,
        }
      })

    }, {success: '取消訂閱成功'}
  ).catch(err => handleError(err,'取消訂閱通知錯誤'));
}