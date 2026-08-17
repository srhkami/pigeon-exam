import {TVersion} from "@/types/about-types.ts";


export const CHANGE_LOGS: Array<TVersion> = [
  {
    version: '1.0.2',
    date: '1150814',
    logs: [
      {type: 'info', text: '【全站】移除錯誤回報機制。'},
    ]
  },
  {
    version: '1.0.1',
    date: '1150331',
    logs: [
      {type: 'fix', text: '【測驗】修復測驗儲存後，作答選項與儲存結果不符合的問題。'},
    ]
  },
  {
    version: '1.0.0',
    date: '1150327',
    logs: [
      {type: 'new', text: '【全站】將所有功能從鴿手網站中遷移過來。'},
      {type: 'new', text: '【選擇題】【學生】出題加入「排除作答過的題目」及「只選曾作錯的題目」進階選項。'},
      {type: 'new', text: '【選擇題】【學生】現在單題作答也會儲存紀錄。'},
      {type: 'new', text: '【選擇題】【學生】加入作答紀錄瀏覽功能。'},
      {type: 'new', text: '【申論題】【學生】回答加入「公開」及「匿名」的選項。'},
      {type: 'info', text: '【申論題】【學生】回答格式改為純文字，並支援 MD 格式預覽。'},
      {type: 'info', text: '【申論題】【老師】對學生的作答紀錄加入評分及評語功能。'},
      {type: 'delete', text: '【申論題】【學生】移除按讚功能。'},
      {type: 'delete', text: '【測驗】【學生】之前的紀錄因格式不共通，無法續用，所有紀錄轉移至選擇題。'},
      {type: 'new', text: '【統計分析】【學生】加入作答統計、答題趨勢、AI 分析功能。'},
    ]
  }
]

export const APP_VER = CHANGE_LOGS[0].version;
export const UPDATE_AT = CHANGE_LOGS[0].date;