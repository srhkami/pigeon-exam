import {Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {showToast} from "@/utils/handleToast.ts";
import {USER_API} from "@/lib/config.ts";
import {Button} from "@/component";
import {errorLogger} from "@/func";

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

  function getEmailCode() {
    if (!email) {
      toast.error('請輸入您的信箱！');
      return;
    }
    showToast(
      axios({
        method: 'POST',
        url: USER_API + '/get_email_code/',
        data: {
          email: email
        }
      }), {success: '驗證碼已寄出，請至信箱查看'}
    )
      .then((res) => {
        setIsUser(res.data.is_user);
        setIsDisable(true);
      })
      .catch(err => {
          errorLogger(err, '取得驗證碼錯誤')
          setIsDisable(false);
          setIsUser(null);
        }
      )
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