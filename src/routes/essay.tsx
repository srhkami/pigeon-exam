import {RouteObject} from "react-router";
import {EssayPagesForManager, EssayPagesForUser} from "@/lib/pages.tsx";

export const essayRouterForUser: RouteObject = {
  path: 'essay', children: [
    // 隨機測驗
    {path: 'random', element: EssayPagesForUser.random.content},
    // 題目總覽
    {
      path: 'questions', children: [
        {path: ':page', element: EssayPagesForUser.questions.content}
      ]
    },
    // 題目詳情
    {
      path: 'question', children: [
        {path: ':id', element: EssayPagesForUser.question.content}
      ]
    },
    // 紀錄列表
    {
      path: 'records', children: [
        {path: ':page', element: EssayPagesForUser.records.content}
      ]
    },
    // 紀錄詳情
    {
      path: 'record', children: [
        {path: ':id', element: EssayPagesForUser.record.content}
      ]
    },

  ]
}

export const essayRouterForManager: RouteObject = {
  path: 'essay', children: [
    // 題目列表
    {
      path: 'questions', children:
        [
          {path: ':page', element: EssayPagesForManager.questions.content}
        ]
    },
    // 題目詳情
    {
      path: 'question', children:[
        {path:':id', element: EssayPagesForManager.question.content}
      ]
    },
    // 紀錄列表
    {
      path:'records', children:[
        {path: ':page', element: EssayPagesForManager.records.content}
      ]
    },
    // 紀錄詳情
    {
      path:'record', children:[
        {path: ':id', element: EssayPagesForManager.record.content}
      ]
    },
  ]
}