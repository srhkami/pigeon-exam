import {RouteObject} from "react-router";
import {SelectPagesForManager, SelectPagesForUser} from "@/lib/pages.tsx";
import {SelectResult, SelectResultDetail} from "@/features";
import {AuthLayout} from "@/auth";

export const selectRouter: RouteObject = {
  path: 'select', children: [
    {path: 'random', element: SelectPagesForUser.selectRandom.content},
    {path: 'past', element: SelectPagesForUser.selectPast.content},
    {
      path: 'logs', children: [
        {path: ':page', element: SelectPagesForUser.selectLogs.content}
      ]
    },
    {path: 'statistics', element: SelectPagesForUser.selectStatistics.content},
    {
      path: 'result', children: [
        {
          path: 'manage', children: [
            {path: ':page', element: SelectPagesForManager.selectResultManage.content}
          ]
        },
        {path: ':id', element: <AuthLayout authType='E'><SelectResult/></AuthLayout>},
      ]
    },
    {
      path: 'manage', children: [
        {
          path: 'question', children:
            [
              {path: ':page', element: SelectPagesForManager.selectManage.content}
            ]
        },
        {
          path: 'result', children:
            [
              {
                path: 'detail', children: [
                  {path: ':id', element: <AuthLayout authType='EH'><SelectResultDetail/></AuthLayout>},
                ]
              },
              {path: ':page', element: SelectPagesForManager.selectResultManage.content}
            ]
        }
      ]
    },

  ]
}