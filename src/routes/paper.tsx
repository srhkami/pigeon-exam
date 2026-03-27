import {RouteObject} from "react-router";
import {PaperPagesForManager, PaperPagesForUser} from "@/lib/pages.tsx";

export const paperRouterForUser: RouteObject = {
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
    {path: ':uuid', element: PaperPagesForUser.paper.content}
  ]
}

export const paperRouterForManager: RouteObject = {
  path: 'paper', children: [
    {path: 'add', element: PaperPagesForManager.edit.content},
    {
      path: 'list', children: [
        {path: ':page', element: PaperPagesForManager.list.content}
      ]
    },
    {
      path: 'detail', children: [
        {path: ':id', element: PaperPagesForManager.detail.content}
      ]
    },
    {
      path: 'edit', children: [
        {path: ':id', element: PaperPagesForManager.edit.content}
      ]
    },
    {
      path: 'records', children: [
        {path: ':page', element: PaperPagesForManager.records.content},
      ]
    },
    {
      path: 'record', children: [
        {path: ':id', element: PaperPagesForManager.record.content}
      ]
    },
  ]
}