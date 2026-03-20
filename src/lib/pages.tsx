import {MEDIA_IP} from "@/lib/config.ts";
import {ReactNode} from "react";
import {
  About,
  EssayBrowser,
  EssayManage,
  EssayRandom,
  FeedbackWeb,
  Home,
  Paper,
  PaperRecord, PaperRecordDetail, PaperRecords,
  PaperRecordsManage,
  SelectPast,
  SelectQuestionManage,
  SelectRandom
} from "@/features";
import {AuthType} from "@/types/auth-types.ts";
import {AuthLayout} from "@/auth";
import SelectRecordManage from "@/features/Select/for-manager/Manage/SelectRecordManage.tsx";
import SelectRecords from "@/features/Select/for-user/Record/SelectRecords.tsx";


export class Page {
  label: string;
  icon: string;
  url: string;
  auth?: AuthType;
  content?: ReactNode;

  constructor(label: string, icon: string, url: string, auth?: AuthType, content?: ReactNode) {
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
    '鴿手',
    'PigeonHand_Logo192.png',
    'https://pigeonhand.tw',
  ),
  trafficpigeon: new Page(
    '交通鴿手',
    'TrafficPigeon_Logo192.png',
    'https://traffic.pigeonhand.tw',
  ),
}

/* 選擇題 - 使用者頁面 */
export const SelectPagesForUser = {
  random: new Page(
    '自動出題',
    'dice.png',
    '/select/random',
    'E',
    <SelectRandom/>
  ),
  past: new Page(
    '考古題總覽',
    'exam_history.png',
    '/select/past',
    'E',
    <SelectPast/>
  ),
  records: new Page(
    '作答紀錄',
    'exam_a_plus.png',
    '/select/records/1?ordering=-id',
    'E',
    <SelectRecords/>
  ),
  // selectStatistics: new Page(
  //   'selectStatistics',
  //   '統計與分析',
  //   'business-report.png',
  //   '/select/statistics',
  //   'E',
  //   <SelectStatistics/>
  // ),
}

/* 選擇題 - 管理員頁面 */
export const SelectPagesForManager = {
  questions: new Page(
    '題目管理',
    'questions.png',
    '/select/manage/questions/1?ordering=-id',
    'EH',
    <SelectQuestionManage/>
  ),
  records: new Page(
    '紀錄查閱',
    'exam_a_plus.png',
    '/select/manage/records/1?ordering=-id',
    'EH',
    <SelectRecordManage/>
  ),
}

/* 申論題 - 使用者介面*/
export const EssayPagesForUser = {
  random: new Page(
    '自動出題',
    'dice.png',
    '/essay/random',
    'E',
    <EssayRandom/>
  ),
  questions: new Page(
    '題目總覽',
    'sign_document.png',
    '/essay/questions/1?ordering=-year',
    'E',
    <EssayBrowser/>
  ),
  question: new Page(
    '題目詳情',
    'sign_document.png',
    '/essay/question',
    'E',
    <EssayBrowser/>
  ),
  records: new Page(
    '作答紀錄',
    'sign_document.png',
    '/essay/records/1?ordering=-id',
    'E',
    <EssayBrowser/>
  ),
  record: new Page(
    '紀錄詳情',
    'sign_document.png',
    '/essay/record',
    'E',
    <EssayBrowser/>
  ),
}

/* 申論題 - 管理員介面*/
export const EssayPagesForManager = {
  questions: new Page(
    '題目管理',
    'sign_document.png',
    '/essay/manage/questions/1?ordering=-year',
    'EH',
    <EssayManage/>
  ),
  question: new Page(
    '題目詳情',
    'sign_document.png',
    '/essay/manage/question',
    'EH',
    null
  ),
  records: new Page(
    '紀錄查閱',
    'sign_document.png',
    '/essay/manage/records/1?ordering=-year',
    'EM',
    null
  ),
  record: new Page(
    '紀錄詳情',
    'sign_document.png',
    '/essay/manage/record',
    'EM',
    null
  ),
}

/* 試卷 - 使用者介面 */
export const PaperPagesForUser = {
  paper: new Page(
    '試卷頁面',
    '',
    '/paper',
    'E',
    <Paper/>
  ),
  records: new Page(
    '測驗紀錄',
    'letters.png',
    '/paper/records/1?ordering=-id',
    'E',
    <PaperRecords/>
  ),
  record: new Page(
    '測驗紀錄詳情',
    '',
    '/paper/record',
    'E',
    <PaperRecord/>
  ),
}

/* 試卷 - 管理員介面 */
export const PaperPagesForManager = {
  list: new Page(
    '試卷管理',
    'letters.png',
    '/paper/manage/list/1?ordering=-id',
    'EM',
    null
  ),
  records: new Page(
    '測驗紀錄查閱',
    'letters.png',
    '/paper/manage/records/1?ordering=-id',
    'EM',
    <PaperRecordsManage/>
  ),
  record: new Page(
    '測驗紀錄詳情',
    'letters.png',
    '/paper/manage/record',
    'EM',
    <PaperRecordDetail/>,
  ),
}

/* 網站頁面 */
export const WebPages = {
  home: new Page(
    '首頁',
    'exam_a_plus.png',
    '/',
    undefined,
    <Home/>
  ),
  about: new Page(
    '關於本網站',
    'about.png',
    '/about',
    undefined,
    <About/>
  ),
  feedback: new Page(
    '意見回饋',
    'feedback.png',
    '/feedback',
    undefined,
    <FeedbackWeb/>
  ),
}

export const AllPages = {...WebPages, ...PolicePages,}

export const MenuSelect: TSidebarMenu = {
  label: '選擇題',
  icon: 'select.png',
  list: [
    SelectPagesForUser.random,
    SelectPagesForUser.past,
    SelectPagesForUser.records,
  ],
}

export const MenuEssay: TSidebarMenu = {
  label: '申論題',
  icon: 'left_handed.png',
  list: [
    EssayPagesForUser.random,
    EssayPagesForUser.questions,
    EssayPagesForUser.records,
  ],
}

export const MenuPaper: TSidebarMenu = {
  label: '測驗',
  icon: 'left_handed.png',
  list: [
    PaperPagesForUser.records
  ],
}

export const MenuSelectManage: TSidebarMenu = {
  label: '選擇題管理',
  icon: 'exam.png',
  list: [
    SelectPagesForManager.questions,
    SelectPagesForManager.records,
  ],
}

export const MenuEssayManage: TSidebarMenu = {
  label: '申論題管理',
  icon: 'exam.png',
  list: [
    EssayPagesForManager.questions,
    EssayPagesForManager.record,
  ]
}

export const MenuPaperManage: TSidebarMenu = {
  label: '試卷管理',
  icon: 'exam.png',
  list: [
    PaperPagesForManager.list,
    PaperPagesForManager.records,
  ],
}