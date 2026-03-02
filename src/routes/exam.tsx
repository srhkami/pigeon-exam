import {RouteObject} from "react-router";
import {AuthLayout} from "@/auth";
import {
  ExamEssay,
  ExamEssayDetail,
  ExamEssayRandom,
  ExamEssaySelfAnswers,
  ExamIntro,
  ExamPaper,
  ExamResult,
  ExamSelectLogs,
  ExamSelectPast,
  ExamSelectRandom,
  ExamStatistics
} from "@/features";

export const exam: RouteObject = {
  path: 'exam', children: [
    {path: '', element: <ExamIntro/>},
    // {
    //   path: 'past', children: [
    //     {path: '', element: <AuthLayout authType='E'><SelectPast/></AuthLayout>},
    //     {path: 'paper', element: <AuthLayout authType='E'><SelectPastPaper/></AuthLayout>}
    //   ]
    // },
    {
      path: 'select', children: [
        {path: 'random', element: <AuthLayout authType='E'><ExamSelectRandom/></AuthLayout>},
        {path: 'past', element: <AuthLayout authType='E'><ExamSelectPast/></AuthLayout>},
        {
          path: 'logs', children: [
            {path: ':page', element: <AuthLayout authType='E'><ExamSelectLogs/></AuthLayout>}
          ]
        },
      ]
    },
    {
      path: 'essay', children: [
        {path: 'random', element: <AuthLayout authType='E'><ExamEssayRandom/></AuthLayout>},
        {path: ':page', element: <AuthLayout authType='E'><ExamEssay/></AuthLayout>},
        {
          path: 'logs', children: [
            {path: ':page', element: <AuthLayout authType='E'><ExamEssaySelfAnswers/></AuthLayout>}
          ]
        },
        {
          path: 'detail', children: [
            {path: ':id', element: <AuthLayout authType='E'><ExamEssayDetail/></AuthLayout>}
          ]
        }
      ]
    },
    {
      path: 'statistics', element: <AuthLayout authType='E'><ExamStatistics/></AuthLayout>
    },
    {
      path: 'paper', children: [
        {path: ':uuid', element: <AuthLayout authType='E'><ExamPaper/></AuthLayout>}
      ]
    },
    {
      path: 'result', children: [
        {path: ':id', element: <AuthLayout authType='E'><ExamResult/></AuthLayout>}
      ]
    }
  ]
}