import {RouteObject} from "react-router";
import {PaperPagesForManager, PaperPagesForUser} from "@/lib/pages.tsx";

export const paperRouter: RouteObject = {
  path: 'paper', children: [
    {
      path: 'records', children: [
        {path: ':page', element: PaperPagesForUser.records.content},
      ]
    },
    {
      path: 'record', children: [
        {path: ':id', element: PaperPagesForUser.record.content},
      ]
    },
    {
      path: 'manage', children: [
        {
          path: 'list', children: [
            {path: ':page', element: PaperPagesForManager.list.content}
          ]
        },
        {
          path: 'records', children: [
            {path: ':page', element: PaperPagesForUser.records.content},
          ]
        },
        {
          path: 'record', children: [
            {path: ':id', element: PaperPagesForManager.record.content}
          ]
        },
      ]
    },
    {path: ':uuid', element: PaperPagesForUser.paper.content}
  ]
}
