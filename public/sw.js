import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'

// --------------- 1. 基礎設定 & PWA 更新機制 ---------------

// 讓 Service Worker 安裝後立即接管頁面 (解決更新需重整兩次的問題)
self.skipWaiting()
clientsClaim()

// 清除舊版本的快取
cleanupOutdatedCaches()

// 預先快取 Vite 打包出來的檔案 (插件會自動把檔案列表替換掉 self.__WB_MANIFEST)
precacheAndRoute(self.__WB_MANIFEST)


// --------------- 2. 解決 iOS 網頁不更新的關鍵策略 ---------------
// 針對 HTML (導航請求) 強制使用「網路優先」，確保用戶永遠看到新版

registerRoute(
  // 過濾條件：是導航請求 (navigate) 且不是 API 或其他特定路徑
  ({ request, url }) => {
    return request.mode === 'navigate'
  },
  new NetworkFirst({
    cacheName: 'pages-cache',
    plugins: [
      // 可選：設定過期時間
      {
        cacheWillUpdate: async ({ response }) => {
          if (response && response.status === 200) {
            return response;
          }
          return null;
        }
      }
    ]
  })
);


// --------------- 3. 您的自定義推播邏輯 (直接貼上) ---------------

// 監聽推送事件
self.addEventListener('push', function (event) {
  const data = event.data?.json() || {}

  self.registration.showNotification(data.title || '新通知', {
    body: data.body || '您有新訊息',
    icon: '/icons/Logo192.png', // 確保這些圖片在 public 資料夾存在
    // badge: '/icons/Logo512.png',
    data: data.url || '/',
  })
})

/**
 * 處理點擊事件
 * 當傳入url時，點擊會跳轉至該網址
 */
self.addEventListener('notificationclick', function (event) {
  const url = event.notification.data || '/'
  event.notification.close()

  // 優化：如果該頁面已經打開，則聚焦該視窗，否則開啟新視窗
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // 嘗試尋找已經打開的網址
      for (let client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // 如果沒找到，則開啟新視窗
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})