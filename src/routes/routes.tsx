import {createBrowserRouter} from "react-router";
import {About, Base, ErrorAlert, FeedbackWeb, FilePreview, Home, UserProfile} from "@/features";
import {AuthLayout} from "@/auth";
import {selectRouterForManager, selectRouterForUser} from "@/routes/select.tsx";
import {essayRouterForManager, essayRouterForUser} from "@/routes/essay.tsx";
import {paperRouterForManager, paperRouterForUser} from "@/routes/paper.tsx";
import {AllPages} from "@/lib/pages.tsx";
import TestPage from "@/features/Layout/TestPage.tsx";

const routes = createBrowserRouter([
  {
    path: '',
    children: [
      {
        path: 'manage',
        element: <Base manage_mode={true}/>,
        errorElement: <Base><ErrorAlert errorType='noPage'/></Base>,
        children: [
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
          {path: 'index', element: <Home/>},
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
              {path: ':url', element: <FilePreview code='l'/>}
            ]
          },
          {
            path: 'f', children: [
              {path: ':url', element: <FilePreview code='f'/>}
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