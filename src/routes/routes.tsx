import {createBrowserRouter} from "react-router";import {ErrorAlert} from "@/features";
import {Base, About, FilePreview, Home, UserProfile, FeedbackWeb, SelectPaper} from "@/features";
import {AuthLayout} from "@/auth";
import {selectRouter} from "@/routes/select.tsx";
import {essayRouter} from "@/routes/essay.tsx";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Base/>,
    errorElement: <Base><ErrorAlert errorType='noPage'/></Base>,
    children: [
      {path: '', element: <Home/>},
      {path: 'index', element: <Home/>},
      {path: 'about', element: <About/>},
      {path: 'feedback', element: <FeedbackWeb/>},
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
      {
        path: 'paper', children: [
          {path: ':uuid', element: <AuthLayout authType='E'><SelectPaper/></AuthLayout>}
        ]
      },
      selectRouter,
      essayRouter,
    ]
  },
])


export default routes;