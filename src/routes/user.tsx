import {UserProfile} from "@/features";
import {RouteObject} from "react-router";
import {AuthLayout} from "@/auth";

export const user: RouteObject = {
  path: 'user',
  children: [
    {path: 'profile', element: <AuthLayout><UserProfile/></AuthLayout>},
  ]
}