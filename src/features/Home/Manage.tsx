import {ErrorAlert} from "@/features";

export default function Manage(){
  return(
    <ErrorAlert option={{
      color:'info',
      header:'本頁尚未有功能',
      message:'請點擊側邊欄進入各類管理功能',
    }}/>
  )
}