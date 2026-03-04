import {RouteObject} from "react-router";
import {EssayPagesForUser, SelectPagesForManager} from "@/lib/pages.tsx";
import {EssayDetail} from "@/features";
import {AuthLayout} from "@/auth";

export const essayRouter: RouteObject = {
  path: 'essay', children: [
    {path: 'random', element: EssayPagesForUser.essayRandom.content},
    {path: 'list', element: EssayPagesForUser.essayBrowser.content},
    {
      path: 'logs', children: [
        {path: ':page', element: EssayPagesForUser.essayLogs.content}
      ]
    },
    {
      path: 'detail', children: [
        {path: ':id', element: <AuthLayout authType='E'><EssayDetail/></AuthLayout>}
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
      ]
    }
  ]
}