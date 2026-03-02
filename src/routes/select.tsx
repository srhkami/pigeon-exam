import {RouteObject} from "react-router";
import {SelectPagesForUser} from "@/lib/pages.tsx";
import {SelectResult} from "@/features";
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
        {path: ':id', element: <AuthLayout authType='E'><SelectResult/></AuthLayout>}
      ]
    }
  ]
}