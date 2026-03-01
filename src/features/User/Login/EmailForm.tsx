import {Button} from "@/component";
import {SubmitHandler, useForm} from "react-hook-form";
import {showToast} from "@/func";
import {useState} from "react";
import BtnEmailCode from "./BtnEmailCode.tsx";
import {handleEmailLogin} from "@/auth/handleUser.ts";
import {EmailLoginForm} from "@/types/user-types.ts";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks";
import {errorLogger, showFormError} from "@/func";

export default function EmailForm() {

  const {onReload} = useAuth();
  const [isUser, setIsUser] = useState<boolean | null>(null);
  const {register, handleSubmit, watch, setError, formState: {errors}} = useForm<EmailLoginForm>();
  const [email] = watch(['email'])

  const onSubmit: SubmitHandler<EmailLoginForm> = (formData) => {
    if (isUser === null) {
      setError('code', {message: '請取得驗證碼'})
      return
    }
    showToast(
      handleEmailLogin(formData), {label: '登入', success: '登入成功'}
    )
      .then(() => onReload())
      .catch(err => {
        const status = err.response.status;
        if (status === 400) {
          showFormError(err, setError)
        } else if (status === 500) {
          toast.error('伺服器臨時維護中，請稍後再試');
        } else {
          errorLogger(err, '未知登入錯誤')
        }
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mx-auto max-w-80'>
      <label htmlFor='email' className="label text-sm">信箱</label>
      <input id='email' type="text" className="input w-full"
             {...register('email', {
               required: '此欄位必填',
               pattern: {
                 value: /[\w-]+@([\w-]+\.)+[\w-]+/,
                 message: '信箱格式不符，請重新輸入'
               }
             })}/>
      <span className='text-error text-xs'>{errors.email?.message}</span>
      <label htmlFor='code' className="label text-sm mt-3">驗證碼</label>
      <div className='join w-full'>
        <BtnEmailCode email={email} setIsUser={setIsUser}/>
        <input id='code' type="number" className="input join-item w-full"
               {...register('code', {required: '此欄位必填'})}/>
      </div>
      <span className='text-error text-xs'>{errors.code?.message}</span>
      <Button color='neutral' shape='block' className="mt-4">登入</Button>
    </form>
  )
}