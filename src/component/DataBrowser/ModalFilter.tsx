import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {TbFilterCog} from "react-icons/tb";
import {ApiFilterKey, FilterConfig} from "@/types/api-types.ts";
import {useModal} from "@/hooks";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect} from "react";
import {FaSearch} from "react-icons/fa";

// 定義組件 Props
type Props = {
  readonly filterConfigs: FilterConfig[]; // 從父層傳入的配置檔
  readonly placeholder: string,
}

/**
 * 檢視資料中，用來顯示篩選內容的對話框
 * @constructor
 */
export default function ModalFilter({filterConfigs, placeholder}: Props) {

  const navi = useNavigate();
  const {isShow, onShow, onHide} = useModal();

  const {page} = useParams(); // 頁數
  const path = useLocation().pathname.replace(`/${page}`, ""); // 取得基礎網址
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);   // 解析params，轉換為物件
  const {register, setValue, setFocus, watch, handleSubmit} = useForm<ApiFilterKey>({defaultValues: params});

  // 監聽所有欄位變化
  const currentValues = watch();

  const onSubmit: SubmitHandler<ApiFilterKey> = (formData) => {
    // 過濾掉空值，避免 URL 出現 &subject=&ordering=
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v != null && v !== '')
    );
    const newParams = new URLSearchParams(cleanData as any); // 將現有params與項目本身傳入的param結合
    navi(`${path}/1?${newParams.toString()}`);
    onHide();
  }

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setFocus('search');
      }, 100); // 讓 Modal 有時間 render input
    }
  }, [isShow]);

  // 處理單一欄位清除的函式
  const handleClearField = (fieldName: keyof ApiFilterKey) => {
    setValue(fieldName, ''); // 將該欄位設為空字串
  };

  return (
    <>
      <Button style='soft' color='secondary' size='sm' className='join-item'
              onClick={onShow} title='條件篩選' type='button'>
        <TbFilterCog/>
        條件篩選
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton size='sm'>
        <ModalHeader>
          <ModalTitle>
            條件篩選
          </ModalTitle>
        </ModalHeader>
        <ModalBody className='p-1'>
          <form className='my-2' onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='search' className='label text-sm'>搜尋：</label>
            <input type="text" placeholder={placeholder} className="input input-sm w-50 join-item"
                   {...register('search')}/>
            {currentValues.search &&
              <Button type='button' size='xs' shape='circle' style='outline' color='error' className='ml-2'
                      onClick={() => setValue('search','')}>
                ×
              </Button>
            }
          </form>
          {/* 動態渲染篩選區塊 */}
          {filterConfigs.map((config) => {
              // 🔥 3. 判斷該欄位目前是否有值
              // 注意：有些情況值可能是 null 或 undefined，這裡做個簡單判斷
              const fieldValue = currentValues[config.fieldName];
              const hasValue = fieldValue !== '' && fieldValue !== undefined && fieldValue !== null;
              return (
                <div key={config.fieldName as string} className="filter flex flex-nowrap items-center my-1">
                  <div className='label text-sm'>
                    {config.title}：
                  </div>
                  <div className='flex flex-wrap items-center'>
                    {/* 渲染選項按鈕 */}
                    {config.options.map((opt) => (
                      <input
                        key={`${config.fieldName}-${opt.value}`}
                        className="btn btn-sm btn-outline my-1"
                        type="radio"
                        value={opt.value}
                        aria-label={opt.label}
                        {...register(config.fieldName)}
                      />
                    ))}
                    {hasValue &&
                      <Button size='xs' shape='circle' style='outline' color='error'
                              type="button"
                              onClick={() => handleClearField(config.fieldName)}
                              aria-label={`清除${config.title}`}>
                        ×
                      </Button>
                    }
                  </div>
                </div>
              )
            }
          )}
          <div className='mt-2 flex justify-end'>
            <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}>
              <FaSearch/>查詢
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}