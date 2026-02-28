import {ReactNode, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router";
import axios from "axios";
import {MEDIA_IP, WEB_API} from "@/utils/config.ts";
import {IoArrowBackOutline, IoShareSocial} from "react-icons/io5";
import {FaArrowRightToBracket} from "react-icons/fa6";
import {IoMdDownload} from "react-icons/io";
import {showToast} from "@/utils/handleToast.ts";
import {HtmlTitle} from '@/layout';
import {BottomBar, BottomButton, BottomMainButton} from '@/component';
import CountdownTimer from "./tools/CountdownTimer.tsx";
import ShowFile from "./tools/ShowFile.tsx";
import {FileDetailData} from "@/types/happywork-types.ts";
import {copyText} from "@/utils/copyText.tsx";
import {handleError} from "@/utils/errorReport.tsx";

type Props = {
  readonly code: 'f' | 'l',
}

/**
 * 預覽檔案的頁面
 * @param code F代表普通檔案，L代表函釋
 * @constructor
 */
export default function FilePreview({code}: Props): ReactNode {

  const {url} = useParams();
  const [data, setData] = useState<FileDetailData | null>(null);
  const navi = useNavigate();

  useEffect(() => {
    showToast(
      axios({
        method: 'GET',
        url: WEB_API + '/short_url/',
        params: {
          code: code,
          url: url,
        }
      }),
      {
        baseText: '載入',
        error: '檔案取得失敗'
      }
    )
      .then(res => setData(res.data))
      .catch(err => handleError(err, '檔案預覽錯誤'))
  }, [url]);

  const onCopy = () => {
    // 獲取當前網址
    const currentUrl = window.location.href;
    // 自訂化文字
    const customText = data?.title + " - 分享自【鴿手】";
    // 組合文字
    const textToCopy = `${currentUrl}\n${customText}`;
    // 複製到剪貼簿
    copyText(textToCopy);
  }

  return (
    <>
      <HtmlTitle title='檔案預覽'/>
      <div>
        {data?.url &&
          <div className='card bg-base-100 border-base-300'>
            <div className='card-body'>
              <div className='text-xl'>您即將前往……</div>
              <div>{data.title}</div>
              <div className='divider'></div>
              <div>
                此為外部網站連結，各功能非由「鴿手」提供，請謹慎瀏覽
              </div>
              <div className='flex'>
                <Link to={data.url} className='ms-auto btn btn-primary btn-lg flex'>
                  點此前往
                  <CountdownTimer initialTime={5} url={data.url}/>
                  <FaArrowRightToBracket className='text-lg ml-2 my-auto'/>
                </Link>
              </div>
            </div>
          </div>
        }
        {data?.file &&
          <div className='px-2'>
            <ShowFile fileName={data.file} title={data.title}/>
          </div>
        }
        <BottomBar
          mainButton={
            data?.file &&
            <BottomMainButton title='下載' color='primary' label='下載'
                              onClick={() => window.open(MEDIA_IP + data?.file)}>
              <IoMdDownload className='text-lg'/>
            </BottomMainButton>
          }
        >
          <BottomButton title='返回' label='返回'
                        onClick={() => navi(-1)}>
            <IoArrowBackOutline className='text-lg'/>
          </BottomButton>
          <BottomButton title='分享' label='分享'
                        onClick={onCopy}>
            <IoShareSocial className='text-lg'/>
          </BottomButton>
        </BottomBar>
      </div>
    </>
  )
}