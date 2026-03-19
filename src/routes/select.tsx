import {RouteObject} from "react-router";
import {SelectPagesForManager, SelectPagesForUser} from "@/lib/pages.tsx";

export const selectRouter: RouteObject = {
  path: 'select', children: [
    {path: 'random', element: SelectPagesForUser.selectRandom.content},
    {path: 'past', element: SelectPagesForUser.selectPast.content},
    // {
    //   path: 'logs', children: [
    //     {path: ':page', element: SelectPagesForUser.selectLogs.content}
    //   ]
    // },
    // {path: 'statistics', element: SelectPagesForUser.selectStatistics.content},
    {
      path: 'manage', children: [
        {
          path: 'questions', children:
            [
              {path: ':page', element: SelectPagesForManager.selectManage.content}
            ]
        },
        {
          path: 'records', children:
            [
              {path: ':page', element: SelectPagesForManager.selectRecordManage.content}
            ]
        },
        {
          path:'records', children:[
            // {path: ':page', element: SelectPagesForManager.selectManage.content}
          ]
        }
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