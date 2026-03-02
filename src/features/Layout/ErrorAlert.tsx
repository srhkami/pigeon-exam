import {ReactNode} from "react";
import {Link} from "react-router";
import {IoWarningOutline} from "react-icons/io5";
import {Alert, Col, Row} from "@/component";
import {Login} from "@/features";

type ErrorOption = {
  color: 'info' | 'success' | 'warning' | 'error',
  header: ReactNode,
  message: string,
  footer?: ReactNode,
}

type Props = {
  readonly errorType?: 'noPage' | 'noLogin' | 'noAcc' | 'noAuth' | 'noOpen' | 'loggedIn' | 'comingSoon', // 預設可選的錯誤類別
  readonly option?: ErrorOption, // 自訂詳細的錯誤選項
}

/**
 * 顯示錯誤的提示
 * @param errorType 錯誤種類
 * @param option 指定選項，若無則依據條件顯示預設選項
 * @constructor
 */
export default function ErrorAlert({errorType = 'noPage', option}: Props) {

  if (errorType === 'noLogin') {
    return (
      <Row className='px-2 justify-center'>
        <Col xs={12}>
          <Alert color='warning'>
            <IoWarningOutline className='text-3xl'/>
            <div>
              <div className="text-xl font-bold">
                您尚未登入
              </div>
              <div className='text-sm'>
                此頁面僅限會員瀏覽，請先登入或註冊成為會員
              </div>
            </div>
          </Alert>
        </Col>
        <div className='max-w-100 mt-4'>
          <Login/>
        </div>
      </Row>
    )
  }

  let options: ErrorOption = option ?? {
    color: 'error',
    header: '找不到此頁面',
    message: '頁面不存在或出現錯誤，請檢查網址有無錯誤',
  }

  if (errorType === 'noAcc') {
    options = {
      color: 'warning',
      header: '您沒有瀏覽此頁面的權限',
      message: '此頁面包含非公開檔案，僅限特定人員瀏覽，請您前往認證，通過後即可使用本頁功能',
      footer: <Link to='/user/accredit' className='btn btn-sm btn-outline btn-neutral'>前往認證</Link>,
    }
  } else if (errorType === 'noAuth') {
    options = {
      color: 'error',
      header: '您沒有瀏覽此頁面的權限',
      message: '如有需求，請聯繫網站作者。'
    }
  } else if (errorType === 'noOpen') {
    options = {
      color: 'error',
      header: '此頁維護中',
      message: '目前正在維護更新中，暫不開放使用，敬請見諒！',
    }
  } else if (errorType === 'loggedIn') {
    options = {
      color: 'success',
      header: '您已登入【交通鴿手】',
      message: '您無須重新註冊，如需進行實名認證，請點選按鈕前往',
      footer:
        <div className='d-flex justify-content-end'>
          <Link to='/user/accredit' className='btn btn-primary'>前往認證</Link>
        </div>,
    }
  }else if (errorType === 'comingSoon') {
    options = {
      color: 'warning',
      header: '敬請期待',
      message: '本功能開發中，尚未開放使用'
    }
  }

  return (
    <div className='px-2'>
      <Alert color={options.color}>
        <IoWarningOutline className='text-3xl'/>
        <div>
          <div className="text-xl font-bold">
            {options.header}
          </div>
          <div className='text-sm'>
            {options.message}
          </div>
        </div>
        <div>
          {options.footer}
        </div>
      </Alert>
    </div>
  )
}