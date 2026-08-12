import {ReactNode, useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router";
import {IoArrowBackOutline, IoShareSocial} from "react-icons/io5";
import {FaArrowRightToBracket} from "react-icons/fa6";
import {IoMdDownload} from "react-icons/io";
import {WEB_API} from "@/lib/config.ts";
import {copy, showToast} from "@/func";
import {BottomBar, BottomButton, BottomMainButton} from "@/component";
import CountdownTimer from "./tools/CountdownTimer.tsx";
import ShowFile from "./tools/ShowFile.tsx";
import {FileDetailData} from "@/types/happywork-types.ts";
import {useAxios} from "@/hooks";
import {
  downloadHappyWorkFile,
  getHappyWorkFileAccessMessage,
  getHappyWorkHttpStatus,
} from "./api/fetchHappyWorkFileBlob.ts";

type Props = {
  readonly code: "f" | "l",
}

function safeExternalUrl(value: string | null | undefined): string | null {
  const normalized = value?.trim();

  if (!normalized) {
    return null;
  }

  const lowered = normalized.toLowerCase();

  if (lowered.startsWith("javascript:") || lowered.startsWith("data:") || lowered.startsWith("mailto:") || lowered.startsWith("tel:")) {
    return null;
  }

  try {
    const parsed = new URL(normalized);

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * 預覽檔案的頁面
 * @param code F代表普通檔案，L代表函釋
 * @constructor
 */
export default function FilePreview({code}: Props): ReactNode {
  const {url} = useParams();
  const api = useAxios();
  const [data, setData] = useState<FileDetailData | null>(null);
  const [loadErrorStatus, setLoadErrorStatus] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navi = useNavigate();
  const safeUrl = safeExternalUrl(data?.url);
  const previewUrl = data?.preview_url ?? null;
  const downloadUrl = data?.download_url ?? null;
  const title = data?.title ?? "檔案";
  const hasFile = Boolean(previewUrl || downloadUrl || data?.has_file);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setLoadErrorStatus(null);
    setData(null);

    showToast(
      api.get<FileDetailData>(WEB_API + "/short_url/", {
        params: {
          code: code,
          url: url,
        }
      }),
      {
        label: "載入",
        error: (err) => getHappyWorkFileAccessMessage(getHappyWorkHttpStatus(err)),
      }
    )
      .then(res => {
        if (!active) {
          return;
        }

        setData(res.data);
      })
      .catch(err => {
        if (!active) {
          return;
        }

        setLoadErrorStatus(getHappyWorkHttpStatus(err) ?? 0);

      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [api, code, url]);

  const onDownload = () => {
    if (!downloadUrl) {
      return;
    }

    void showToast(
      downloadHappyWorkFile(api, downloadUrl, title),
      {
        label: "下載",
        error: (err) => getHappyWorkFileAccessMessage(getHappyWorkHttpStatus(err)),
      }
    ).catch(() => undefined);
  }

  const onCopy = () => {
    const currentUrl = window.location.href;
    const customText = (data?.title ?? "檔案") + " - 分享自【鴿手】";
    const textToCopy = `${currentUrl}\n${customText}`;
    copy(textToCopy);
  }

  return (
    <>
      <div>
        {isLoading && !data && loadErrorStatus === null &&
          <div className='card bg-base-100 border-base-300'>
            <div className='card-body'>
              <div className='text-xl'>檔案載入中……</div>
            </div>
          </div>
        }
        {loadErrorStatus !== null && !data &&
          <div className='card bg-base-100 border-base-300'>
            <div className='card-body'>
              <div className='text-xl'>檔案無法載入</div>
              <div className='divider'></div>
              <div>{getHappyWorkFileAccessMessage(loadErrorStatus)}</div>
            </div>
          </div>
        }
        {data?.url && safeUrl &&
          <div className='card bg-base-100 border-base-300'>
            <div className='card-body'>
              <div className='text-xl'>您即將前往……</div>
              <div>{title}</div>
              <div className='divider'></div>
              <div>
                此為外部網站連結，各功能非由「鴿手」提供，請謹慎瀏覽
              </div>
              <div className='flex'>
                <Link to={safeUrl} className='ms-auto btn btn-primary btn-lg flex'>
                  點此前往
                  <CountdownTimer initialTime={5} url={safeUrl}/>
                  <FaArrowRightToBracket className='text-lg ml-2 my-auto'/>
                </Link>
              </div>
            </div>
          </div>
        }
        {data?.url && !safeUrl &&
          <div className='card bg-base-100 border-base-300'>
            <div className='card-body'>
              <div className='text-xl'>您即將前往……</div>
              <div>{title}</div>
              <div className='divider'></div>
              <div>連結格式不安全，已停止自動跳轉。</div>
            </div>
          </div>
        }
        {hasFile &&
          <div className='px-2'>
            <ShowFile previewUrl={previewUrl} title={title}/>
          </div>
        }
        <BottomBar
          mainButton={
            downloadUrl ?
            <BottomMainButton title='下載' color='primary' label='下載'
                              onClick={onDownload}>
              <IoMdDownload className='text-lg'/>
            </BottomMainButton>
            : null
          }
        >
          <BottomButton title='返回' label='返回'
                        onClick={() => navi(-1)}>
            <IoArrowBackOutline className='text-lg'/>
          </BottomButton>
          {data &&
            <BottomButton title='分享' label='分享'
                          onClick={onCopy}>
              <IoShareSocial className='text-lg'/>
            </BottomButton>
          }
        </BottomBar>
      </div>
    </>
  )
}
