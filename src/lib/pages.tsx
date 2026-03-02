import {MEDIA_IP} from "@/lib/config.ts";
import {ReactNode} from "react";
import {Home} from "@/features";
import {AuthType} from "@/types/auth-types.ts";
import {AuthComponent} from "@/auth";


export class Page {
  code: string;
  label: string;
  icon: string;
  url: string;
  auth?: AuthType;
  content?: ReactNode;

  constructor(code: string, label: string, icon: string, url: string, auth?: AuthType, content?: ReactNode) {
    this.code = code // 頁面代稱（英文代碼，等同於key值）
    this.label = label // 頁面名稱
    this.icon = MEDIA_IP + `/media/icon/${icon}` //圖示路徑
    this.url = url // 路由路徑，由/開始'
    this.auth = auth
    this.content = this.auth ? <AuthComponent authType={this.auth}>{content}</AuthComponent> : content
  }
}

export type TSidebarMenu = {
  label: string,
  icon: string,
  list: Page[],
}


/* 警政相關頁面*/
export const PolicePages = {
  pigeonHand: new Page(
    'pigeonHand',
    '鴿手',
    'PigeonHand_Logo192.png',
    'https://pigeonhand.tw',
  ),
  trafficpigeon: new Page(
    'trafficpigeon',
    '交通鴿手',
    'TrafficPigeon_Logo192.png',
    'https://traffic.pigeonhand.tw',
  ),
}

/* 測驗 - 使用者頁面 */
export const ExamPagesForUser = {
  selectRandom: new Page(
    'selectRandom',
    '隨機測驗',
    'dice.png',
    '/select/random',
    'S',
  ),
  selectPast: new Page(
    'examPast',
    '考古題',
    'exam_history.png',
    '/select/past',
  ),
  selectStatistics: new Page(
    'selectStatistics',
    '統計及分析',
    'business-report.png',
    '/select/statistics',
  ),
  examEssay: new Page(
    'examEssay',
    '申論題',
    'left_handed.png',
    '/exam/essay/1?ordering=-year',
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

/* 測驗 - 管理員頁面*/
export const ExamPagesForManager = {}


/* 網站頁面 */
export const WebPages = {
  home: new Page(
    'home',
    '首頁',
    'exam_a_plus.png',
    '/',
    undefined,
    <Home/>
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
}

export const AllPages = {...WebPages, ...PolicePages, ...ExamPagesForUser}

export const MenuSelect: TSidebarMenu = {
  label: '選擇題',
  icon: 'select.png',
  list: [AllPages.selectRandom, AllPages.selectPast, AllPages.selectStatistics]
}