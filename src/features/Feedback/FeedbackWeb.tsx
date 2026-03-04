import {SubmitHandler, useForm} from "react-hook-form";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {WEB_API} from "@/lib/config.ts";
import {errorLogger, showToast} from "@/func";
import {Button, Col, FormInputCol, Row} from "@/component";
import {FaCircleCheck} from "react-icons/fa6";
import ModalLine from "@/features/Feedback/ModalLine.tsx";
import {useAuth} from "@/hooks";

type FormValues = {
  name: string,
  email: string,
  title: string,
  content: string,
}

const selectOptionItems = [
  '會員相關（忘記帳號/信箱、註冊/認證問題)',
  '題目相關（答案錯誤、法規過時等）',
  '我想協助維護題庫',
  '其他留言',
]

const placeholderItems = [
  '務必輸入其他可聯絡到您的方式（如正確信箱、Line ID），才能協助您處理帳號問題',
  '請貼上題目，並簡單描述問題為何',
  '請留下Line ID，以利管理員聯繫您！',
  '請輸入回報內容，若您非會員且需要管理員聯繫，請留下Line ID等聯絡資訊',
]

const selectOptions = selectOptionItems.map((item) => {
  return <option value={item} key={item}>{item}</option>
})

/* 網站意見回饋 */
export default function FeedbackWeb() {

  const {userInfo, isAuthenticated} = useAuth();
  const navi = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);   // 解析params，轉換為物件

  const [placeholder, setPlaceholder] = useState<string>('');
  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);
  const {register, handleSubmit, setValue, getValues, formState: {errors}} = useForm<FormValues>()


  useEffect(() => {
    // 初始化，如果有登入直接帶入基本資訊
    if (isAuthenticated) {
      setValue('name', userInfo.name ?? '');
      setValue('email', userInfo.email);
      setIsReadOnly(true);
    }
    if (params.option) {
      const option = Number(params.option)
      setValue('title', selectOptionItems[option - 1]);
      showPlaceholder();
    }
  }, []);

  const showPlaceholder = () => {
    const title = getValues().title;
    const index = selectOptionItems.findIndex((item) => title === item);
    if (index < 0) return
    setPlaceholder(placeholderItems[index]);
  }

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    showToast(
      axios({
        method: 'POST',
        url: WEB_API + '/feedback/web/send/',
        data: formData,
      }), {success: '您的回報已成功送出'}
    )

      .then(() => navi('/'))
      .catch(err => errorLogger(err, '網站回報送出錯誤'))
  }

  return (
    <div className='card card-border bg-base-100 border-base-300'>
      <div className='card-body'>
        <div className='text-2xl font-bold'>聯繫網站作者</div>
        <div className='divider m-0'></div>
        <div className='flex justify-center'>
          <Row className='sm:w-5/6 md:w-2/3 px-4'>
            <Col xs={12} className='bg-base-300 rounded-lg p-4'>
              <div className='text-sm font-semibold'>
                本網站由作者單人開發，仍有許多不足之處，敬請見諒
                <br/>若遇上任何網站、APP之問題，或有任何寶貴意見，可直接加入Line好友向我告知！
                <br/>亦可直接填寫下方回饋表單：
              </div>
              <div className='flex'>
                <ModalLine/>
              </div>
            </Col>
            <FormInputCol xs={6} label='如何稱呼您*' error={errors.name?.message}>
              <input type='text' className='input input-sm w-full' readOnly={isReadOnly}
                     {...register('name', {required: '此欄位必填', maxLength: {value: 16, message: '最多16個字'}})}/>
            </FormInputCol>
            <FormInputCol xs={10} label='請留下您的信箱*' error={errors.email?.message}>
              <input type='email' className='input input-sm w-full' readOnly={isReadOnly}
                     {...register('email', {required: '此欄位必填'})}/>
            </FormInputCol>
            <FormInputCol xs={10} md={8} label='回報類別*' error={errors.title?.message}>
              <select className='select select-sm w-full'
                      {...register('title', {
                        required: '請選擇此欄位',
                        onChange: () => showPlaceholder(),
                      })}>
                <option value=''>請選擇</option>
                {selectOptions}
              </select>
            </FormInputCol>
            <FormInputCol xs={12} label='回報內容*' error={errors.content?.message}>
                  <textarea className='textarea textarea-sm w-full' placeholder={placeholder}
                            {...register('content', {required: '此欄位必填'})}/>
            </FormInputCol>
            <Col xs={12} className='flex justify-end mt-4 pr-2'>
              <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}>
                <FaCircleCheck className='ml-1'/>
                送出
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}