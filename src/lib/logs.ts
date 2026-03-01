import {TVersion} from "@/types/about-types.ts";


export const CHANGE_LOGS: Array<TVersion> = [
  {
    version: '1.1.21',
    date: '1150219',
    logs: [
      {type: 'fix', text: '【全站】改善全域權限組件。'},
    ]
  },
  {
    version: '1.1.20',
    date: '1150219',
    logs: [
      {type: 'fix', text: '【全站】加入PWA主動更新提示。'},
    ]
  },
  {
    version: '1.1.19',
    date: '1150217',
    logs: [
      {type: 'new', text: '【全站】後端遷移到新伺服器。'},
    ]
  },
  {
    version: '1.1.18',
    date: '1150131',
    logs: [
      {type: 'fix', text: '【全站】修正學生會員在側邊欄看不到書籤的問題。'},
    ]
  },
  {
    version: '1.1.17',
    date: '1150119',
    logs: [
      {type: 'info', text: '【全站】加入伺服器臨時維護提示。'},
      {type: 'fix', text: '【警察法規】修正清單無法載入的問題。'},
    ]
  },
  {
    version: '1.1.16',
    date: '1150117',
    logs: [
      {type: 'info', text: '【開心上班】改善多個後端API路由。'},
      {type: 'fix', text: '【意見回饋】修正回報內容描述。'},
      {type: 'fix', text: '【會員】修正註冊時沒有提示錯誤的問題。'},
    ]
  },
  {
    version: '1.1.15',
    date: '1150106',
    logs: [
      {type: 'info', text: '【測驗】隨機測驗/出題功能加入關鍵字篩選及無相符題目提示。'},
      {type: 'fix', text: '【全站】嘗試解決舊版網頁被緩存過久的問題。'},
    ]
  },
  {
    version: '1.1.14',
    date: '1150105',
    logs: [
      {type: 'new', text: '【測驗】小試鴿手加入申論題功能。'},
      {type: 'new', text: '【開心上班】新增「現場處理」主目錄。'},
      {type: 'info', text: '【測驗】小試鴿手考古題、測驗記錄整合到選擇題當中。'},
      {type: 'info', text: '【測驗】改善選擇題隨機測驗的篩選功能。'},
      {type: 'info', text: '【測驗】修改多個API路徑。'},
      {type: 'delete', text: '【開心上班】移除「虛擬貨幣」主目錄。'},
    ]
  },
  {
    version: '1.1.13',
    date: '1141215',
    logs: [
      {type: 'new', text: '【測驗】小試鴿手正式向學生權限開放。'},
      {type: 'new', text: '【測驗】答題結果加入筆記相關功能。'}
    ]
  },
  {
    version: '1.1.12',
    date: '1141214',
    logs: [
      {type: 'info', text: '【測驗】修改部分API網址。'},
    ]
  },
  {
    version: '1.1.11',
    date: '1141212',
    logs: [
      {type: 'info', text: '【測驗】統一測驗各功能的選擇題組件。'},
      {type: 'info', text: '【測驗】更改難易度標籤樣式、修改題目出處位置。'},
      {type: 'delete', text: '【測驗】暫時移除考古題中的題目閱覽。'},
    ]
  },
  {
    version: '1.1.10',
    date: '1141209',
    logs: [
      {type: 'info', text: '【測驗】隨機測驗會依據題庫內容自動取得選項。'},
      {type: 'info', text: '【測驗】試卷如果取得失敗會跳轉至小試鴿手首頁。'},
      {type: 'fix', text: '【測驗】修復在Safari上試卷作答不會儲存的問題。'},
    ]
  },
  {
    version: '1.1.9',
    date: '1141207',
    logs: [
      {type: 'info', text: '【測驗】現在測驗如果沒有選擇答案會無法交卷並且顯示提醒。'},
      {type: 'info', text: '【測驗】考古題列表加入緩存功能。'},
      {type: 'fix', text: '【測驗】修復隨機測驗部分題數無法出題的問題。'},
    ]
  },
  {
    version: '1.1.8',
    date: '1141204',
    logs: [
      {type: 'info', text: '【測驗】考古題閱覽加入查看題目功能。'},
    ]
  },
  {
    version: '1.1.7',
    date: '1141203',
    logs: [
      {type: 'info', text: '【測驗】考題測驗正式命名為「小試鴿手」。'},
      {type: 'info', text: '【測驗】小試鴿手加入數據統計、說明。'},
      {type: 'info', text: '【測驗】考古題測驗更名為「考古題閱覽」功能，但尚未加入查看題目功能'},
      {type: 'info', text: '【搜尋】加回法規搜尋結果會一併搜尋內文的功能，並且加入更醒目的提示。'},
    ]
  },
  {
    version: '1.1.6',
    date: '1141202',
    logs: [
      {type: 'fix', text: '【測驗】修復隨機測驗答案提示錯誤的問題。'},
    ]
  },
  {
    version: '1.1.4',
    date: '1141201',
    logs: [
      {type: 'info', text: '【測驗】隨機測驗加入「犯罪偵查」科目、及「不限」選項。'},
    ]
  },
  {
    version: '1.1.3',
    date: '1141130',
    logs: [
      {type: 'info', text: '【會員】加入「測驗協作」權限。'},
    ]
  },
  {
    version: '1.1.2',
    date: '1141129',
    logs: [
      {type: 'info', text: '【全站】改善富文本編輯器及預覽組件。'},
      {type: 'info', text: '【測驗】改善測驗結果註解呈現效果。'},
      {type: 'info', text: '【測驗】隨機測驗不再預測出1題。'},
      {type: 'delete', text: '【搜尋】移除法規搜尋結果會一併搜尋內文的功能。'},
    ]
  },
  {
    version: '1.1.1',
    date: '1141128',
    logs: [
      {type: 'info', text: '【測驗】隨機測驗現在可以一次出更多題目。'},
    ]
  },
  {
    version: '1.1.0',
    date: '1141126',
    logs: [
      {type: 'new', text: '【測驗】加入考題測驗功能。'},
      {type: 'new', text: '【會員】加入「測驗」權限。'},
      {type: 'new', text: '【會員】會員選單內現在可以查看自己所有的權限。'},
      {type: 'new', text: '【SOP】作業程序現在有獨立頁面，並且開放學生權限瀏覽。'},
      {type: 'info', text: '【全站】調整側邊欄順序。'},
      {type: 'fix', text: '【意見回饋】修復聯繫網站作者文字提示不會變動的問題。'},
      {type: 'delete', text: '【管理系統】移除管理系統，相關功能移植到鴿手後台中。'}
    ]
  },
  {
    version: '1.0.19',
    date: '1141031',
    logs: [
      {type: 'fix', text: '【會員】修復會員認證無法送出表單的問題。'}
    ]
  },
  {
    version: '1.0.18',
    date: '1141031',
    logs: [
      {type: 'info', text: '【管理系統】社群通報使用醒目顏色。'},
      {type: 'info', text: '【管理系統】會員篩選新增7日內登入'},
      {type: 'fix', text: '【管理系統】修正學生會員數及社群成員數顯示錯誤問題。'}
    ]
  },
  {
    version: '1.0.17',
    date: '1141025',
    logs: [
      {type: 'info', text: '【會員】學生會員開放使用交通相關權限。'},
      {type: 'fix', text: '【會員】修正會員重新進行實名認證，會刪除社群紀錄的問題。'},
    ]
  },
  {
    version: '1.0.16',
    date: '1140919',
    logs: [
      {type: 'info', text: '【開心上班】移除文書例稿目錄。'},
      {type: 'fix', text: '【開心上班】修復編輯標籤外框沒有圓角的問題。'},
    ]
  },
  {
    version: '1.0.15',
    date: '1140916',
    logs: [
      {type: 'info', text: '【法規】處於搜尋內文狀態時，加入醒目的取消搜尋按鈕。'},
      {type: 'fix', text: '【程式分享】修復無法按照更新日期排序的問題。'},
    ]
  },
  {
    version: '1.0.14',
    date: '1140825',
    logs: [
      {type: 'new', text: '【管理系統】執法初探加入同步資料功能。'},
      {type: 'new', text: '【管理系統】會員管理能看到加入社群的紀錄。'},
      {type: 'info', text: '【全站】改變權限驗證的方式，重新使用localStorge。'},
    ]
  },
  {
    version: '1.0.13',
    date: '1140816',
    logs: [
      {type: 'new', text: '【全站】加入「錯誤」回報功能。'},
      {type: 'fix', text: '【管理系統】修復新增小程式時不會儲存作者的問題。'}
    ]
  },
  {
    version: '1.0.12',
    date: '1140810',
    logs: [
      {type: 'new', text: '【全站】加入「小程式分享」頁面。'},
      {type: 'fix', text: '【管理系統】修復開心上班管理同步資料庫時，資料沒即時更新的問題。'},
    ]
  },
  {
    version: '1.0.11',
    date: '114087',
    logs: [
      {type: 'new', text: '【全站】底端欄按鈕加入說明文字。'},
      {type: 'info', text: '【管理系統】改善文字編輯器在手機上的使用體驗。'},
      {type: 'fix', text: '【法規】修復法規換行錯誤的問題。'},
    ]
  },
  {
    version: '1.0.10',
    date: '1140803',
    logs: [
      {type: 'new', text: '【管理系統】後台管理加入存取緩存功能。'},
    ]
  },
  {
    version: '1.0.9',
    date: '1140801',
    logs: [
      {type: 'fix', text: '【管理系統】修復後台管理無法儲存的問題。'},
    ]
  },
  {
    version: '1.0.8',
    date: '1140727',
    logs: [
      {type: 'fix', text: '【會員】改善註冊時輸入密碼的提示。'},
      {type: 'fix', text: '【檔案預覽】修復無法取得檔案的問題。'},
    ]
  },
  {
    version: '1.0.7',
    date: '1140723',
    logs: [
      {type: 'new', text: '【執法初探】開放給具有學生權限以上會員瀏覽。'},
      {type: 'info', text: '【搜尋】提供更明確的分類、折疊功能。'},
      {type: 'fix', text: '【檔案預覽】修復部分PDF文字無法顯示的問題。'},
    ]
  },
  {
    version: '1.0.6',
    date: '1140723',
    logs: [
      {type: 'new', text: '【管理系統】加入編輯會員資料功能。'},
      {type: 'info', text: '【管理系統】改善管理介面，統一按鈕至底端欄。'},
      {type: 'fix', text: '【管理系統】修復無法顯示學生會員數的問題。'},
    ]
  },
  {
    version: '1.0.5',
    date: '1140722',
    logs: [
      {type: 'info', text: '【全站】將交通相關功能權限獨立區分。'},
      {type: 'info', text: '【全站】持續改善底端欄及按鈕的樣式。'},
    ]
  },
  {
    version: '1.0.4',
    date: '1140718',
    logs: [
      {type: 'new', text: '【會員】新增「書籤」功能，可將常用法規加入書籤。'},
      {type: 'new', text: '【法規】新增「搜尋條文」功能。'},
      {type: 'new', text: '【搜尋】全站搜尋的結果會直接帶入條文搜尋。'},
      {type: 'info', text: '【全站】統一底端欄及按鈕的樣式。'},
      {type: 'info', text: '【執法初探】加入刑事訴訟法區塊。'},
      {type: 'fix', text: '【法規】修復警察法規切換類別時，會暫時顯示上次類別的問題。'},
    ]
  },
  {
    version: '1.0.3',
    date: '1140716',
    logs: [
      {type: 'info', text: '【管理系統】改善審核會員認證的方式，現在可以動態更改設定。'},
      {type: 'info', text: '【管理系統】改善執法初探新增資料時，不再每次關閉視窗。'},
      {type: 'info', text: '【管理系統】開心上班管理加入搜尋檔案及資料夾功能。'},
      {type: 'info', text: '【管理系統】開心上班管理操作欄位移至螢幕下方，並固定懸浮於最上層。'},
      {type: 'info', text: '【管理系統】改善多處按鈕圖標。'},
      {type: 'fix', text: '【管理系統】修正開心上班管理無法上傳的問題。'},
    ]
  },
  {
    version: '1.0.2',
    date: '1140714',
    logs: [
      {type: 'info', text: '【全站】法規資料庫及搜尋功能開放給「學生」權限使用。'},
    ]
  },
  {
    version: '1.0.1',
    date: '1140713',
    logs: [
      {type: 'new', text: '【管理系統】加入支援拖曳排序的清單。'},
      {type: 'new', text: '【管理系統】加入執法初探獨立編輯頁面。'},
      {type: 'fix', text: '【檔案預覽】修正無法下載檔案的問題。'},
    ]
  },
  {
    version: '1.0.0',
    date: '1140712',
    logs: [
      {type: 'new', text: '【全站】移植「開心上班資料庫」。'},
      {type: 'new', text: '【全站】新增「警察法規資料庫」功能。'},
      {type: 'new', text: '【全站】新增「警察執法初探」功能（暫未開放使用）。'},
      {type: 'new', text: '【會員】升級會員資料庫，與「交通鴿手」共用會員系統。'},
    ]
  }
]

export const APP_VER = CHANGE_LOGS[0].version;
export const UPDATE_AT = CHANGE_LOGS[0].date;