import {showToast} from "@/func";
import {errorLogger} from "@/func/index.ts";

export default function copyText(text: string) {
  showToast(
    navigator.clipboard.writeText(text),
    {
      success: '複製成功',
      error: '複製失敗'
    }
  ).catch(err => errorLogger(err,'複製文字錯誤'));
}