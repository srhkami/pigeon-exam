import {showToast} from "@/utils/handleToast.ts";
import {handleError} from "@/utils/errorReport.tsx";

export function copyText(text: string) {

  showToast(
    navigator.clipboard.writeText(text),
    {
      success: '複製成功',
      error: '複製失敗'
    }
  ).catch(err => handleError(err,'複製文字錯誤'));
}