import {showToast} from "@/func";

export default function copy(text: string) {
  showToast(
    navigator.clipboard.writeText(text),
    {
      success: '複製成功',
      error: '複製失敗'
    }
  ).catch(() => undefined);
}