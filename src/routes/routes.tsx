import {createBrowserRouter} from "react-router";
import {feedback} from "./feedback.tsx";
import {user} from "./user.tsx";
import {ErrorAlert} from "@/layout";
import {Base, About, FilePreview, Home} from "@/features";
import {select} from "@/routes/select.tsx";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Base/>,
    errorElement: <Base><ErrorAlert errorType='noPage'/></Base>,
    children: [
      {path: '', element: <Home/>},
      {path: 'index', element: <Home/>},
      {path: 'about', element: <About/>},
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
      user,
      feedback,
      select,
    ]
  },

])

export default routes;