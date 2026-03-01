import {MEDIA_IP} from "@/lib/config.ts";
import {ReactNode} from "react";

type Page = {
  code: string,
  label: string,
  icon: string,
  url: string,
  content: ReactNode,
}

type PageList = {

  pages: Page[]
}

export const studentPages:


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


/* 警政相關頁面*/
export const PolicePages = {
  trafficpigeon: new Page(
    'trafficpigeon',
    '交通鴿手',
    'TrafficPigeon_Logo192.png',
    'https://traffic.pigeonhand.tw',
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