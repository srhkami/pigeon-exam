import PDFViewer from "./PDFViewer.tsx";
import {MEDIA_IP} from "@/lib/config.ts";

type Props = {
  readonly fileName: string,
  readonly title: string
}

/* 顯示檔案及按鈕的區域 */
export default function ShowFile({fileName, title}: Props) {

  const fileExtension = fileName.split('.').pop()?.toUpperCase() ?? '';

  if (fileExtension === 'PDF') {
    return (
      <PDFViewer url={MEDIA_IP + fileName}/>
    )
  } else if (fileExtension === 'JPG' || fileExtension === 'JPEG' || fileExtension === 'PNG') {
    return (
      <div className='w-full rounded p-3'>
        <img src={MEDIA_IP + fileName} alt='圖片預覽' className='w-full'/>
      </div>
    )
  } else {
    return (
      <div className='card bg-base-100 border-base-300'>
        <div className='card-body'>
          <div className='text-xl'>您即將開啟……</div>
          <div>{title}</div>
          <div className='divider'></div>
          <div>
            此檔案類型不支援預覽，請點擊右下角「下載」按鈕，使用相關軟體開啟；若手機無法支援，請使用電腦開啟。
          </div>
        </div>
      </div>
    )
  }
}