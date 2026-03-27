import {MEDIA_IP} from "@/lib/config.ts";
import {ReactNode} from "react";
import {
  About,
  AnalyzeReport,
  EssayQuestion,
  EssayQuestions, EssayQuestionsManage,
  EssayRandom,
  EssayRecords, EssayRecordsManage,
  FeedbackWeb,
  Paper,
  PaperDetail,
  PaperEdit,
  PaperManage,
  PaperRecord,
  PaperRecordDetail,
  PaperRecords,
  PaperRecordsManage,
  SelectPast,
  SelectQuestionManage,
  SelectRandom,
  Statistics
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
    'exam-history_1.png',
    '/select/past',
    'E',
    <SelectPast/>
  ),
  records: new Page(
    '作答紀錄',
    'exam_results_1.png',
    '/select/records/1?ordering=-id',
    'E',
    <SelectRecords/>
  ),
}

/* 選擇題 - 管理員頁面 */
export const SelectPagesForManager = {
  questions: new Page(
    '題目管理',
    'questions.png',
    '/manage/select/questions/1?ordering=-id',
    'EH',
    <SelectQuestionManage/>
  ),
  records: new Page(
    '紀錄查閱',
    'exam_results_3.png',
    '/manage/select/records/1?ordering=-id',
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
    <EssayQuestions/>
  ),
  question: new Page(
    '題目詳情',
    '',
    '/essay/question',
    'E',
    <EssayQuestion/>
  ),
  records: new Page(
    '作答紀錄',
    'exam_history_2.png',
    '/essay/records/1?ordering=-id',
    'E',
    <EssayRecords/>
  ),
  record: new Page(
    '紀錄詳情',
    '',
    '/essay/record',
    'E',
    null
  ),
}

/* 申論題 - 管理員介面*/
export const EssayPagesForManager = {
  questions: new Page(
    '題目管理',
    'sign_document.png',
    '/manage/essay/questions/1?ordering=-year',
    'EH',
    <EssayQuestionsManage/>
  ),
  question: new Page(
    '題目詳情',
    '',
    '/manage/essay/question',
    'EH',
    null
  ),
  records: new Page(
    '紀錄查閱',
    'exam_results_0.png',
    '/manage/essay/records/1?ordering=-year',
    'EM',
    <EssayRecordsManage/>
  ),
  record: new Page(
    '紀錄詳情',
    '',
    '/manage/essay/record',
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
    'agreement.png',
    '/manage/paper/list/1?ordering=-id',
    'EM',
    <PaperManage/>
  ),
  detail: new Page(
    '試卷詳情',
    '',
    '/manage/paper/detail',
    'EM',
    <PaperDetail/>
  ),
  edit: new Page(
    '試卷編輯',
    '',
    '/manage/paper/edit',
    'EM',
    <PaperEdit/>
  ),
  records: new Page(
    '測驗紀錄查閱',
    'letters.png',
    '/manage/paper/records/1?ordering=-id',
    'EM',
    <PaperRecordsManage/>
  ),
  record: new Page(
    '測驗紀錄詳情',
    '',
    '/manage/paper/record',
    'EM',
    <PaperRecordDetail/>,
  ),
}

/* 網站頁面 */
export const WebPages = {
  statistics: new Page(
    '統計與分析',
    'business_report.png',
    '/statistics',
    'E',
    <Statistics/>
  ),
  analyze: new Page(
    'AI分析結果',
    '',
    '/analyze',
    "L",
    <AnalyzeReport/>
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
  home: new Page(
    '切換 考生模式',
    'transfer.png',
    '/',
    undefined,
    null
  ),
  manage: new Page(
    '切換 管理模式',
    'transfer.png',
    '/manage',
    'EH',
    null
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
  icon: 'exam_a_plus.png',
  list: [
    PaperPagesForUser.records
  ],
}

export const MenuSelectManage: TSidebarMenu = {
  label: '選擇題管理',
  icon: 'select.png',
  list: [
    SelectPagesForManager.questions,
    SelectPagesForManager.records,
  ],
}

export const MenuEssayManage: TSidebarMenu = {
  label: '申論題管理',
  icon: 'left_handed.png',
  list: [
    EssayPagesForManager.questions,
    EssayPagesForManager.records,
  ]
}

export const MenuPaperManage: TSidebarMenu = {
  label: '試卷管理',
  icon: 'exam_a_plus.png',
  list: [
    PaperPagesForManager.list,
    PaperPagesForManager.records,
  ],
}