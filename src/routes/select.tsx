import {RouteObject} from "react-router";
import {AuthLayout} from "@/auth";
import {
  ExamResult,
  ExamSelectPast,
  ExamSelectRandom,
  ExamStatistics
} from "@/features";

export const select: RouteObject = {
  path: 'select', children: [
    {path: 'random', element: <AuthLayout authType='E'><ExamSelectRandom/></AuthLayout>},
    {path: 'past', element: <AuthLayout authType='E'><ExamSelectPast/></AuthLayout>},
    {
      path: 'statistics', element: <AuthLayout authType='E'><ExamStatistics/></AuthLayout>
    },
    {
      path: 'result', children: [
        {path: ':id', element: <AuthLayout authType='E'><ExamResult/></AuthLayout>}
      ]
    }
  ]
}