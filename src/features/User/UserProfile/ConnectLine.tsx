import HtmlTitle from "../../../layout/HtmlTitle.tsx";
import {useNavigate, useSearchParams} from "react-router";
import {USER_API} from "@/utils/config.ts";
import {showToast} from "@/utils/handleToast.ts";
import {Button, Col, Row} from "@/component";
import {useAxios} from "@/hooks";
import {handleError} from "@/utils/errorReport.tsx";

type ConnectParams = {
  app: string,
  uid: string, // Line 的識別ID
  code: string, // 夾帶的驗證碼，由後端發出，並限時失效，以此驗證
}

/* 連結Line帳號 */
export default function ConnectLine() {

  const api = useAxios();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]) as ConnectParams;   // 解析params，轉換為物件

   const onSubmit = () => {
    showToast(
      api({
        method: 'post',
        url: USER_API + '/connect/line/',
        data: params
      }),{
        success:'連結成功！現在可以繼續使用機器人',
        error:err=>err.respose.data.detail,
      }
    )
      .then(() => navigate('/linebot'))
      .catch(err =>handleError(err, 'Line帳號連結錯誤'));
  }

  return (
    <>
      <HtmlTitle title='連結帳號'/>
        <Row className='pt-5 justify-center'>
          <Col xs={12} sm={10} md={6}>
            <div className="card card-border bg-base-100">
              <div className="card-body">
                <h2 className="card-title">連結Line帳號</h2>
              <div>
                <div> 將「鴿手」帳號與 Line 帳號連結後，即可使用本網站提供的機器人各項功能</div>
                <div className='text-xs mt-2 text-neutral'>※本功能不會留存您Line帳號的個人資料</div>
                <Button color='primary' shape='block' className='mt-4' onClick={onSubmit}>
                  請點此繼續
                </Button>
              </div>
              </div>
            </div>
          </Col>
        </Row>
    </>
  )
}