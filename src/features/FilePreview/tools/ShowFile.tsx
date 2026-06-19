import {useEffect, useState} from "react";
import PDFViewer from "./PDFViewer.tsx";
import {useAxios} from "@/hooks";
import {
  fetchHappyWorkFileBlob,
  getHappyWorkFileAccessMessage,
  getHappyWorkHttpStatus,
  isHappyWorkInlinePreviewContentType,
} from "../api/fetchHappyWorkFileBlob.ts";

type Props = {
  readonly previewUrl?: string | null,
  readonly title: string
}

/* 顯示檔案及按鈕的區域 */
export default function ShowFile({previewUrl, title}: Props) {
  const api = useAxios();
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    let currentObjectUrl: string | null = null;

    setObjectUrl(null);
    setContentType(null);
    setErrorStatus(null);

    if (!previewUrl) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    setIsLoading(true);

    void fetchHappyWorkFileBlob(api, previewUrl)
      .then(({blob, contentType: nextContentType}) => {
        if (!active) {
          return;
        }

        if (!isHappyWorkInlinePreviewContentType(nextContentType)) {
          setErrorStatus(415);
          setIsLoading(false);
          return;
        }

        currentObjectUrl = URL.createObjectURL(blob);
        setObjectUrl(currentObjectUrl);
        setContentType(nextContentType);
        setIsLoading(false);
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setErrorStatus(getHappyWorkHttpStatus(error) ?? 0);
        setIsLoading(false);
      });

    return () => {
      active = false;

      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [api, previewUrl]);

  if (!previewUrl || errorStatus === 415) {
    return (
      <div className='card bg-base-100 border-base-300'>
        <div className='card-body'>
          <div className='text-xl'>您即將開啟……</div>
          <div>{title}</div>
          <div className='divider'></div>
          <div>此檔案目前僅支援下載，請使用下方下載按鈕。</div>
        </div>
      </div>
    )
  }

  if (errorStatus !== null) {
    return (
      <div className='card bg-base-100 border-base-300'>
        <div className='card-body'>
          <div className='text-xl'>您即將開啟……</div>
          <div>{title}</div>
          <div className='divider'></div>
          <div>{getHappyWorkFileAccessMessage(errorStatus)}</div>
        </div>
      </div>
    )
  }

  if (isLoading || !objectUrl) {
    return (
      <div className='card bg-base-100 border-base-300'>
        <div className='card-body'>
          <div className='text-xl'>檔案載入中……</div>
          <div>{title}</div>
        </div>
      </div>
    )
  }

  if (contentType === "application/pdf") {
    return <PDFViewer url={objectUrl}/>
  }

  return (
    <div className='w-full rounded p-3'>
      <img src={objectUrl} alt={`${title} 預覽`} className='w-full'/>
    </div>
  )
}
