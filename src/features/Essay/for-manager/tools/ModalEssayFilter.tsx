import {Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from "@/component";
import {TbFilterCog} from "react-icons/tb";
import {useCacheApi, useModal} from "@/hooks";
import {useLocation, useNavigate, useParams, useSearchParams} from "react-router";
import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect} from "react";
import {FaRedo, FaSearch} from "react-icons/fa";
import {POLICE_API} from "@/lib/config";

type ExamFilter = {
  source?: Array<string>,
  category?: Array<string>,
  subject?: Array<string>,
}

type FormValues = {
  search?: string;
  ordering?: string,
  link_is_null?: string,
  is_public?: string,
} & ExamFilter

type FilterConfig = {
  title: string,
  fieldName: keyof FormValues,
  options?: Array<{
    label: string; // 按鈕上顯示的文字 (例如: "從新到舊")
    value: string; // 實際送出的值 (例如: "-id")
  }>, // 單選選項
  checks?: Array<string>, //多選選項
}

type Props = {
  readonly detailMode?: boolean,
}

/**
 * 專門用來給申論題篩選的對話框
 * @param detailMode 詳細模式，用來給後台篩選
 */
export default function ModalEssayFilter({detailMode = true}: Props) {

  const {isShow, onShow, onHide} = useModal();
  const navi = useNavigate();
  const {page} = useParams(); // 頁數
  const path = useLocation().pathname.replace(`/${page}`, ""); // 取得基礎網址
  const [searchParams, setSearchParams] = useSearchParams();

  const initialValues: FormValues = {
    search: '',
    ordering: '-id',
    link_is_null: undefined,
    source: [],
    category: [],
    subject: [],
  };

  const defaultValues: FormValues = {
    search: searchParams.get("search") || '',
    ordering: searchParams.get("ordering") || '-id',
    link_is_null: searchParams.get("link_is_null") || undefined,
    source: searchParams.get("source")?.split(',') || [],
    category: searchParams.get("category")?.split(',') || [],
    subject: searchParams.get("subject")?.split(',') || [],
  };

  const {data} = useCacheApi<ExamFilter>({url: POLICE_API +'/exam_essay/filter_options/'})

  const {
    register,
    setValue,
    setFocus,
    watch,
    reset,
    handleSubmit,
  } = useForm<FormValues>({defaultValues: defaultValues});


  // 監聽所有欄位變化
  const currentValues = watch();

  const detailFilterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: 'ID', value: '-id'},
        {label: '年份', value: 'year'},
      ]
    },
    {
      title: '關聯',
      fieldName: 'link_is_null',
      options: [
        {label: '無關聯物件', value: 'true'},
        {label: '有關聯物件', value: 'false'},
      ]
    },
    {
      title: '公開',
      fieldName: 'is_public',
      options: [
        {label: '公開中', value: 'true'},
        {label: '未公開', value: 'false'},
      ]
    },
    {
      title: '出處',
      fieldName: 'source',
      checks: data?.source,
    },
    {
      title: '類科',
      fieldName: 'category',
      checks: data?.category,
    },
    {
      title: '科目',
      fieldName: 'subject',
      checks: data?.subject,
    },
  ]

  const normalFilterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '建立時間(新)', value: '-id'},
        {label: '建立時間(舊)', value: 'id'},
      ]
    },
    {
      title: '類科',
      fieldName: 'category',
      checks: data?.category,
    },
    {
      title: '科目',
      fieldName: 'subject',
      checks: data?.subject,
    },
  ]

  const filterConfigs = detailMode ? detailFilterConfigs : normalFilterConfigs;

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    // 過濾掉空值，避免 URL 出現 &subject=&ordering=
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v != null && v !== '' && v !== undefined)
    );
    const newParams = new URLSearchParams(cleanData as any); // 將現有params與項目本身傳入的param結合
    navi(`${path}/1?${newParams.toString()}`);
    onHide();
  }

  const onReset = () => {
    setSearchParams({ordering: '-id'});
    reset(initialValues);
  }

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setFocus('search');
      }, 100); // 讓 Modal 有時間 render input
    }
  }, [isShow]);


  return (
    <>
      <Button style='soft' color='secondary' size='sm' className='join-item'
              onClick={onShow} title='條件篩選' type='button'>
        <TbFilterCog/>
        條件篩選
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>
            條件篩選
          </ModalTitle>
        </ModalHeader>
        <ModalBody className='p-1'>
          <form className='my-2' onSubmit={handleSubmit(onSubmit)}>
            <label className='label text-sm'>搜尋：</label>
            <input type="text" className="input input-sm w-50 join-item"
                   {...register('search')}/>
            {currentValues.search &&
              <Button type='button' size='xs' shape='circle' style='outline' color='error' className='ml-2'
                      onClick={() => setValue('search', '')}>
                ×
              </Button>
            }
          </form>
          {/*動態渲染篩選區塊*/}
          {filterConfigs.map((config) => {
              if (config.options) {
                return (
                  <div key={config.fieldName as string} className="flex flex-nowrap items-center my-2">
                    <div className='label text-sm'>
                      {config.title}：
                    </div>
                    <select className='select select-sm w-50' {...register(config.fieldName)}>
                      <option value=''>請選擇</option>
                      {/* 渲染選項按鈕 */}
                      {config.options.map((opt) => (
                        <option value={opt.value} key={`${config.fieldName}-${opt.value}`}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              }
              if (config.checks) {
                return (
                  <div key={config.fieldName as string}
                       className="fieldset my-2 ">
                    <div className='label text-sm'>
                      {config.title}：
                    </div>
                    <div className='grid grid-cols-2 gap-1 ml-2'>
                      {/* 渲染選項按鈕 */}
                      {config.checks.map((item) => (
                        <label className="label" key={item}>
                          <input type="checkbox" className="checkbox checkbox-sm" value={item}
                                 {...register(config.fieldName)}/>
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                )
              }
            }
          )}
        </ModalBody>
        <ModalFooter>
          <Button size='sm' color='secondary' onClick={onReset} className='mr-auto'>
            <FaRedo/>重置
          </Button>
          <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}>
            <FaSearch/>查詢
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}