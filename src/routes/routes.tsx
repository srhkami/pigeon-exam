import {lazy, type ReactNode, Suspense} from "react";
import {createBrowserRouter} from "react-router";
import {About, Base, ErrorAlert, FeedbackWeb, Home, Manage, UserProfile} from "@/features";
import {AuthLayout} from "@/auth";
import {selectRouterForManager, selectRouterForUser} from "@/routes/select.tsx";
import {essayRouterForManager, essayRouterForUser} from "@/routes/essay.tsx";
import {paperRouterForManager, paperRouterForUser} from "@/routes/paper.tsx";
import {AllPages} from "@/lib/pages.tsx";
import TestPage from "@/features/Layout/TestPage.tsx";

const FilePreview = lazy(() => import("@/features/FilePreview/FilePreview.tsx"));

function RouteFallback({children}: {children: ReactNode}) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

const routes = createBrowserRouter([
  {
    path: '',
    children: [
      {
        path: 'manage',
        element: <Base manage_mode={true}/>,
        errorElement: <Base><ErrorAlert errorType='noPage'/></Base>,
        children: [
          {path: '', element: <Manage/>},
          selectRouterForManager,
          essayRouterForManager,
          paperRouterForManager
        ]
      },
      {
        path: '',
        element: <Base/>,
        errorElement: <Base><ErrorAlert errorType='noPage'/></Base>,
        children: [
          {path: '', element: <Home/>},
          {path: 'about', element: <About/>},
          {path: 'feedback', element: <FeedbackWeb/>},
          {path: 'statistics', element: AllPages.statistics.content},
          {
            path: 'analyze', children: [
              {path: ':id', element: AllPages.analyze.content}
            ]
          },
          {path: 'test', element: <TestPage/>},
          {
            path: 'l', children: [
              {path: ':url', element: <RouteFallback><FilePreview code='l'/></RouteFallback>}
            ]
          },
          {
            path: 'f', children: [
              {path: ':url', element: <RouteFallback><FilePreview code='f'/></RouteFallback>}
            ]
          },
          {
            path: 'user',
            children: [
              {path: 'profile', element: <AuthLayout><UserProfile/></AuthLayout>},
            ]
          },
          selectRouterForUser,
          essayRouterForUser,
          paperRouterForUser
        ]
      }
    ]
  },
])


export default routes;