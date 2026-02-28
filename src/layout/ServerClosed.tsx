import {ErrorAlert} from "@/layout/index.ts";

export default function ServerClosed(){
  return(
    <ErrorAlert
    option={{
      color:'error',
      header:'伺服器維護中',
      message:'鴿手伺服器正在維護升級中，預計115/02/17 23時維護完畢，造成不便敬請見諒！'
    }}
    />
  )
}