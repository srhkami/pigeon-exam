import {RouteObject} from "react-router";
import {HappyworkView} from "@/features";
import {AuthLayout} from "@/auth";

export const happywork: RouteObject = {
  path: 'happywork', children: [
    {
      path: 'view', children: [
        {path: ':id', element: <AuthLayout authType='C'><HappyworkView/></AuthLayout>}
      ]
    },
  ]
}