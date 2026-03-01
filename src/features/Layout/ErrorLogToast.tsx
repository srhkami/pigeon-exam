import {MdError} from "react-icons/md";
import {Button} from "@/component";
import {showToast} from "@/utils/handleToast.ts";
import axios from "axios";
import {WEB_API} from "@/lib/config.ts";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks";

type FormValues = {
  error_type: string,
  user_email: string | null,
  content: Error,
}

type Props = {
  readonly toastId: string,
  readonly error: any,
  readonly errorType: string,
}

export default function ErrorLogToast({toastId, error, errorType}: Props) {

  const {userInfo} = useAuth();

  const onReport = () => {
    const data: FormValues = {
      error_type: errorType,
      user_email: userInfo.email ?? null,
      content: error
    }
    showToast(
      axios({
        method: "POST",
        url: WEB_API + "/feedback/error/send/",
        data: data
      }),
      {
        success: '回報成功'
      }
    )
      .then(() => toast.dismiss(toastId))
      .catch(err => console.log(err))
  }

  return (
    <div className='flex items-center'>
      <MdError className='text-error text-lg'/>
      <span className='font-semibold mx-2'>哎呀！出現錯誤了！</span>
      <Button size='xs' color='neutral' onClick={onReport} >
        回報作者
      </Button>
    </div>
  )
}