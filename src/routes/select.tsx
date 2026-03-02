import {RouteObject} from "react-router";
import {AllPages} from "@/lib/pages.tsx";
import {SelectResult} from "@/features";
import {AuthLayout} from "@/auth";

export const select: RouteObject = {
  path: 'select', children: [
    {path: 'random', element: AllPages.selectRandom.content},
    {path: 'past', element: AllPages.selectPast.content},
    {
      path: 'logs', children: [
        {path: ':page', element: AllPages.selectLogs.content}
      ]
    },
    {path: 'statistics', element: AllPages.selectStatistics.content},
    {
      path: 'result', children: [
        {path: ':id', element: <AuthLayout authType='E'><SelectResult/></AuthLayout>}
      ]
    }
  ]
}