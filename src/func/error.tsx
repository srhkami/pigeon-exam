import toast from "react-hot-toast";
import {ErrorLogToast} from "@/features";

export default function errorLogger(error: any, errorType: string = '未分類錯誤') {
  console.log(errorType, error);
  toast((t) => (
    <ErrorLogToast toastId={t.id} error={error} errorType={errorType}/>
  ))
}