import {RouteObject} from "react-router";
import {FeedbackWeb} from "@/features";

export const feedback: RouteObject = {
  path: 'feedback',
  children: [
    {path: '', element: <FeedbackWeb/>},
  ],
}