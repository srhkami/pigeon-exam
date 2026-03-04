import {Button} from "@/component";
import {SubmitHandler, useForm} from "react-hook-form";
import {errorLogger, showFormError, showToast} from "@/func";
import {handleLogin} from "@/auth/handleUser.ts";
import {UserLoginForm} from "@/types/user-types.ts";
import toast from "react-hot-toast";
import {useAuth} from "@/hooks";

export default function PasswordForm() {

  const {onReload} = useAuth();
  const {register, handleSubmit, setError, formState: {errors}} = useForm<UserLoginForm>();

  const onSubmit: SubmitHandler<UserLoginForm> = (formData) => {
    showToast(
      handleLogin(formData),
      {label: '登入', success: '登入成功'}
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
      {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
      <label htmlFor='password' className="label text-sm mt-3">密碼</label>
      <input id='password' type="password" className="input w-full"
             {...register('password', {required: '此欄位必填'})}/>
      {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
      <Button color='neutral' shape='block' className="mt-4">登入</Button>
    </form>
  )
}