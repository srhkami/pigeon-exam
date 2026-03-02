import {MEDIA_IP} from "@/lib/config.ts";
import {ReactNode} from "react";
import {
  EssayBrowser,
  EssayLogs,
  EssayRandom,
  Home,
  SelectLogs,
  SelectPast,
  SelectRandom,
  SelectStatistics
} from "@/features";
import {AuthType} from "@/types/auth-types.ts";
import {AuthLayout} from "@/auth";


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
    this.content = this.auth ? <AuthLayout authType={this.auth}>{content}</AuthLayout> : content
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

/* 選擇題 - 使用者頁面 */
export const SelectPagesForUser = {
  selectRandom: new Page(
    'selectRandom',
    '隨機測驗',
    'dice.png',
    '/select/random',
    'E',
    <SelectRandom/>
  ),
  selectPast: new Page(
    'selectPast',
    '考古題測驗',
    'exam_history.png',
    '/select/past',
    'E',
    <SelectPast/>
  ),
  selectLogs: new Page(
    'selectStatistics',
    '測驗紀錄',
    'exam_a_plus.png',
    '/select/logs/1?ordering=-id',
    'E',
    <SelectLogs/>
  ),
  selectStatistics: new Page(
    'selectStatistics',
    '統計與分析',
    'business-report.png',
    '/select/statistics',
    'E',
    <SelectStatistics/>
  ),


  // examSpecial: new Page(
  //   'examSpecial',
  //   '專項測驗',
  //   'one-page.png',
  //   '/',
  // ),

}

/* 測驗 - 管理員頁面*/
export const ExamPagesForManager = {}


/* 申論題 - 使用者介面*/
export const EssayPagesForUser = {
  essayBrowser: new Page(
    'essayBrowser',
    '申論題總覽',
    'sign_document.png',
    '/essay/list/1?ordering=-year',
    'E',
    <EssayBrowser/>
  ),
  essayRandom: new Page(
    'essayRandom',
    '隨機出題',
    'dice.png',
    '/essay/random',
    'E',
    <EssayRandom/>
  ),
  essayLogs: new Page(
    'essayLogs',
    '作答紀錄',
    'letters.png',
    '/essay/logs/1?ordering=-id',
    'E',
    <EssayLogs/>
  ),
}

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

export const AllPages = {...WebPages, ...PolicePages, ...SelectPagesForUser, ...EssayPagesForUser}

export const MenuSelect: TSidebarMenu = {
  label: '選擇題',
  icon: 'select.png',
  list: [
    SelectPagesForUser.selectRandom,
    SelectPagesForUser.selectPast,
    SelectPagesForUser.selectLogs,
    SelectPagesForUser.selectStatistics
  ]
}

export const MenuEssay: TSidebarMenu = {
  label: '申論題',
  icon: 'left_handed.png',
  list: [
    EssayPagesForUser.essayBrowser,
    EssayPagesForUser.essayRandom,
    EssayPagesForUser.essayLogs
  ]
}