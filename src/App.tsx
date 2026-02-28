import {AuthProvider} from "@/auth/AuthContext.tsx";
import {RouterProvider} from "react-router";
import routes from "@/routes/routes.tsx";
import {useEffect} from "react";
import AOS from 'aos'
import 'aos/dist/aos.css'
import 'keen-slider/keen-slider.min.css'
import ReloadPrompt from "@/layout/ReloadPrompt.tsx";

export default function App(){

  useEffect(() => {
    AOS.init({
      once: false, // 每次進入畫面都觸發動畫
      mirror: true, // 向上滾動時也觸發（需配合動畫類型）
    });
  }, [])

  return(
    <AuthProvider>
      <RouterProvider router={routes}/>
      <ReloadPrompt/>
    </AuthProvider>
  )
}