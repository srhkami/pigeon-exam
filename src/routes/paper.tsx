import {RouteObject} from "react-router";
import {AuthLayout} from "@/auth";
import {Paper, PaperRecord, PaperRecordDetail} from "@/features";
import {PaperPagesForManager} from "@/lib/pages.tsx";

export const paperRouter: RouteObject = {
  path: 'paper', children: [
    {
      path: 'manage', children: [
        {
          path: 'list', children: [
            {path: ':page', element: <AuthLayout authType='EM'>{PaperPagesForManager.paperRecordManage.content}</AuthLayout>}
          ]
        },
        {
          path: 'record', children: [
            {path: ':id', element: <AuthLayout authType='EM'><PaperRecordDetail/></AuthLayout>},
          ]
        },
      ]
    },
    {
      path: 'record', children: [
        {path: ':id', element: <AuthLayout authType='E'><PaperRecord/></AuthLayout>},
      ]
    },
    {path: ':uuid', element: <AuthLayout authType='E'><Paper/></AuthLayout>}
  ]
}
