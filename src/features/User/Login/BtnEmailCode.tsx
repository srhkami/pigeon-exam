import {Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {V3_USER_API} from "@/lib/config.ts";
import {Button} from "@/component";

type TimerProps = {
  readonly initialTime: number,
  readonly setIsDisable: Dispatch<SetStateAction<boolean>>,
}

type Props = {
  readonly email: string | undefined,
  readonly setIsUser: Dispatch<SetStateAction<boolean | null>>, // 設定是否存在會員
  readonly size?: 'sm' | 'lg' | null,
}

function CountdownTimer({initialTime, setIsDisable}: TimerProps): ReactNode {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsDisable(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // 清除計時器以避免內存泄漏
  }, [timeLeft]);

  return timeLeft && <>{timeLeft}秒後重試</>
}

export default function BtnEmailCode({email, setIsUser, size = null}: Props): ReactNode {

  const [isDisable, setIsDisable] = useState<boolean>(false);
  const isEmailCodeRequestInFlight = useRef(false);

  async function getEmailCode() {
    if (!email) {
      toast.error('請輸入您的信箱！');
      return;
    }
    if (isEmailCodeRequestInFlight.current) return;
    isEmailCodeRequestInFlight.current = true;
    try {
      const res = await axios.post(`${V3_USER_API}/email-code`, {email});
      if (typeof res.data?.is_user !== 'boolean') throw new Error('invalid_email_code_response');
      setIsUser(res.data.is_user); setIsDisable(true); toast.success('驗證碼已寄出，請至信箱查看');
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      const code = axios.isAxiosError(error) ? error.response?.data?.code : undefined;
      toast.error(status === 422 ? '信箱格式或驗證碼請求錯誤' : status === 429 || code === 'email_code_too_frequent' ? '請稍後再重新寄送驗證碼' : status === 502 || code === 'email_delivery_failed' ? '驗證碼寄送失敗，請稍後再試。' : status === 503 || code === 'email_delivery_unknown' ? '寄送結果不明，請先檢查信箱，暫勿重複寄送' : '驗證碼寄送失敗，請稍後再試。'); setIsUser(null);
    } finally { isEmailCodeRequestInFlight.current = false; }
  }

  return (
    <Button
      color='neutral'
      type='button'
      size={size ?? 'md'}
      onClick={getEmailCode}
      disabled={isDisable}
      className='join-item'
    >
      {isDisable ? <CountdownTimer initialTime={60} setIsDisable={setIsDisable}/> : '取得驗證碼'}
    </Button>
  )
}