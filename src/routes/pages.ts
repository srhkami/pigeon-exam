import {MEDIA_IP} from "@/utils/config.ts";

export class Page {
  code: string;
  name: string;
  icon: string;
  url: string;

  constructor(code: string, name: string, icon: string, url: string) {
    this.code = code // 頁面代稱（英文代碼，等同於key值）
    this.name = name // 頁面名稱
    this.icon = MEDIA_IP + `/media/icon/${icon}` //圖示路徑
    this.url = url // 路由路徑，由/開始
  }
}

/* 開心上班頁面 */
export const HappyPages = {
  happywork: new Page(
    'happywork',
    '開心上班資料庫',
    'dove.png',
    '/happywork/view/0',
  ),
  officialDocument: new Page(
    'officialDocument',
    '公文依據',
    'rules-book.png',
    '/happywork/view/1',
  ),
  website: new Page(
    'website',
    '實用連結',
    'cloud_link.png',
    '/happywork/view/28',
  ),
  handle: new Page(
    'handle',
    '現場處理',
    'minecraft_sword.png',
    '/happywork/view/312',
  ),
  caseDocument: new Page(
    'caseDocument',
    '辦案文檔',
    'documents.png',
    '/happywork/view/4',
  )
}

/* 警政相關頁面*/
export const PolicePages = {
  trafficpigeon: new Page(
    'trafficpigeon',
    '交通鴿手',
    'TrafficPigeon_Logo192.png',
    'https://traffic.pigeonhand.tw',
  ),
  enforcement: new Page(
    'enforcement',
    '警察執法初探',
    'police.png',
    '/enf',
  ),
  policelaw: new Page(
    'policelaw',
    '警察法規',
    'law.png',
    '/policelaw',
  ),
  sop: new Page(
    'sop',
    '作業程序',
    'backlog.png',
    '/sop',
  ),
}

/* 測驗頁面 */
export const ExamPages = {
  exam: new Page(
    'exam',
    '小試鴿手',
    'exam_a_plus.png',
    '/exam',
  ),
  examRandom: new Page(
    'examRandom',
    '隨機測驗',
    'dice.png',
    '/exam/random/select',
  ),
  examSelect: new Page(
    'examSelect',
    '選擇題',
    'select.png',
    '/exam/select/random',
  ),
  examEssay: new Page(
    'examEssay',
    '申論題',
    'left_handed.png',
    '/exam/essay/1?ordering=-year',
  ),
  examPast: new Page(
    'examPast',
    '考古題',
    'exam_history.png',
    '/exam/past',
  ),
  examSpecial: new Page(
    'examSpecial',
    '專項測驗',
    'one-page.png',
    '/',
  ),
  examStatistics: new Page(
    'examStatistics',
    '統計及分析',
    'business-report.png',
    '/exam/statistics',
  ),
}

/* 網站頁面 */
export const WebPages = {
  home: new Page(
    'home',
    '返回「鴿手」',
    'house.png',
    '/index',
  ),
  news: new Page(
    'news',
    '最新快訊',
    'house.png',
    '/index',
  ),
  about: new Page(
    'about',
    '關於本網站',
    'about.png',
    '/about',
  ),
  feedback: new Page(
    'feedback',
    '意見回饋',
    'feedback.png',
    '/feedback',
  ),
  linebot: new Page(
    'linebot',
    'Line機器人',
    'message_bot.png',
    '/linebot',
  ),
  apps: new Page(
    'apps',
    '小程式分享',
    'app_store.png',
    '/apps',
  ),
  pigeonManage: new Page(
    'pigeonManage',
    '鴿手後台',
    'PigeonManage_Logo192.png',
    'https://manage.pigeonhand.tw/',
  ),
}

export const AllPages = {...WebPages, ...PolicePages, ...HappyPages,...ExamPages}