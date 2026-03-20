import {RouteObject} from "react-router";
import {SelectPagesForManager, SelectPagesForUser} from "@/lib/pages.tsx";

export const selectRouter: RouteObject = {
  path: 'select', children: [
    // 隨機測驗
    {path: 'random', element: SelectPagesForUser.random.content},
    // 考古題總覽
    {path: 'past', element: SelectPagesForUser.past.content},
    // 紀錄列表
    {
      path: 'records', children:
        [
          {path: ':page', element: SelectPagesForUser.records.content}
        ]
    },
    // {
    //   path: 'logs', children: [
    //     {path: ':page', element: SelectPagesForUser.selectLogs.content}
    //   ]
    // },
    // {path: 'statistics', element: SelectPagesForUser.selectStatistics.content},
    // 管理功能
    {
      path: 'manage', children: [
        // 題目列表
        {
          path: 'questions', children:
            [
              {path: ':page', element: SelectPagesForManager.questions.content}
            ]
        },
        // 紀錄列表
        {
          path: 'records', children:
            [
              {path: ':page', element: SelectPagesForManager.records.content}
            ]
        },

        // {
        //   path: 'result', children:
        //     [
        //       {
        //         path: 'detail', children: [
        //           {path: ':id', element: <AuthLayout authType='EH'><SelectResultDetail/></AuthLayout>},
        //         ]
        //       },
        //       {path: ':page', element: SelectPagesForManager.selectResultManage.content}
        //     ]
        // }
      ]
    },
  ]
}