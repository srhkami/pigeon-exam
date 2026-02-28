import {USER_API} from "@/utils/config.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {useAxios, useModal} from "@/hooks";
import {showToast} from "@/utils/handleToast.ts";
import {Button, FormInputCol, Modal, ModalBody, ModalHeader, ModalTitle, Row} from "@/component";
import {FaEdit} from "react-icons/fa";
import {showFormError} from "@/utils/handleFormErrors.ts";

type FormValues = {
  password: string,
  password_confirm: string,
}

/* 更改密碼頁面 */
export default function ModalChangePassword() {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal();

  const {
    register, // 必要的高階函數
    handleSubmit, // 處理提交的函數
    setError, // 設定錯誤訊息
    reset,
    watch,
    formState: {
      errors,  // 錯誤內容
    }
  } = useForm<FormValues>();
  const [password, password_confirm] = watch(['password', 'password_confirm'])


  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (password !== password_confirm) {
      setError("password_confirm", {message: '密碼不一致'})
      return
    }
    showToast(
      api({
        method: "POST",
        url: USER_API + '/change_pwd/',
        data: formData,
      }), {baseText: '處理', success: '重設成功'}
    )
      .then(() => {
        onHide();
        reset();
      })
      .catch(err => showFormError(err, setError))
  };

  return (
    <>
      <Button color='neutral' size='xs' style='ghost' onClick={onShow}>
        <FaEdit/>
        變更密碼
      </Button>
      {isShow &&
        <Modal isShow={isShow} onHide={onHide} closeButton size='sm'>
          <ModalHeader>
            <ModalTitle>
              變更密碼
            </ModalTitle>
          </ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col px-2'>
              <Row>
                <FormInputCol md={12} label='新密碼*' error={errors.password?.message}>
                  <input id='password' type="password" className="input"
                         placeholder='必須包含數字及英文，長度8~32位之間'
                         {...register('password', {
                           required: '此欄位為必填',
                           pattern: {
                             value: /(?=.*[A-Za-z])(?=.*\d).{8,32}/,
                             message: '請輸入8-32位英文與數字'
                           }
                         })}/>
                </FormInputCol>
                <FormInputCol md={12} label='密碼確認*' error={errors.password_confirm?.message}>
                  <input id='password' type="password" className="input"
                         {...register('password_confirm', {required: '此欄位為必填',})}/>
                </FormInputCol>
              </Row>
              <Button color='neutral' shape='block' className="mt-4">確認修改</Button>
            </form>
          </ModalBody>
        </Modal>
      }
    </>

  )
}