import {createBrowserRouter} from "react-router";
import {feedback} from "./feedback.tsx";
import {user} from "./user.tsx";
import {exam} from "./exam.tsx";
import {ErrorAlert} from "@/layout";
import {Base, About, FilePreview, News} from "@/features";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <Base/>,
    errorElement: <Base><ErrorAlert errorType='noPage'/></Base>,
    children: [
      {path: 'index', element: <News/>},
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
      exam,
    ]
  },

])

export default routes;