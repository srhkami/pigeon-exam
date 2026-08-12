import {SubmitHandler, useForm} from "react-hook-form";
import {Badge, Button} from "@/component";
import {FaArrowRight} from "react-icons/fa";
import {useAxios, useCacheApi} from "@/hooks";
import {showToast} from "@/func";
import {useNavigate} from "react-router";
import {EXAM_API, EXAM_API_V2} from "@/lib/config.ts";
import SelectSingle from "@/features/Select/for-user/Random/SelectSingle.tsx";
import SelectPageHeader from "@/features/Select/for-user/Random/SelectPageHeader.tsx";

type FormValues = {
  count: string,
  search?: string,
  source?: Array<string>,
  category?: Array<string>,
  subject?: Array<string>,
  // todo:新加入
  is_unanswered: boolean,
  is_incorrect: boolean,
}

type FilterConfig = {
  title: string;
  fieldName: keyof FormValues;
  options?: Array<{
    label: string; // 按鈕上顯示的文字 (例如: "從新到舊")
    value: string; // 實際送出的值 (例如: "-id")
  }>, // 單選選項
  checks?: Array<string>, //多選選項
}

/**
 * 選擇題的隨機測驗
 * @constructor
 */
export default function SelectRandom() {

  const api = useAxios();
  const navi = useNavigate();

  const {data} = useCacheApi<FormValues>({url: EXAM_API_V2 + '/select/filter_options'})

  const {register, watch, handleSubmit, setValue} = useForm<FormValues>({
    defaultValues: {
      source: [], category: [], subject: [], is_unanswered: true
    }
  });

  const currentValues = watch(); // 監聽所有欄位變化

  const filterConfigs: Array<FilterConfig> = [
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

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v != null && v !== '')
    );
    const newParams = new URLSearchParams(cleanData as any);
    showToast(
      api({
        method: 'GET',
        url: EXAM_API + '/select_questions/random_multi/',
        params: newParams,
      }), {label: '題目生成', error: '題目生成失敗，請稍後再試。'},
    ).then(res => navi('/paper/' + res.data))
  }

  return (
    <div>
      <SelectPageHeader tab={1}/>
      <div>
        <Badge size='lg' style='outline'>
          出題範圍
        </Badge>
        <div className='text-xs mt-1 mb-3 opacity-70'>
          未勾選選項者，預設為全選
        </div>
        <div className='fieldset my-2'>
          <div className='text-sm'>
            題目關鍵字：
          </div>
          <div>
            <input type='text' className='input input-sm' placeholder='篩選包含關鍵字的題目'
                   {...register('search')}/>
          </div>

        </div>
        {filterConfigs.map((config) => {
            if (config.options) {
              return (
                <div key={config.fieldName as string} className="flex flex-nowrap items-center my-2">
                  <div className='text-sm'>
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
                  <div className='text-sm'>
                    {config.title}：
                  </div>
                  <div className='grid grid-cols-2 gap-1 ml-2'>
                    {/* 渲染選項按鈕 */}
                    {config.checks.map((item) => (
                      <label className="label" key={item}>
                        <input type="checkbox" className="checkbox" value={item}
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
        <Badge size='lg' style='outline' className='mt-4'>
          進階選項
        </Badge>
        <div className="fieldset my-2 ">
          <div className='grid grid-cols-2 gap-1 ml-2'>
            <label className="label">
              <input type="checkbox" className="toggle toggle-primary"
                     {...register('is_unanswered', {
                       onChange: () => {
                         if (currentValues.is_incorrect) setValue("is_incorrect", false)
                       }
                     })}/>
              排除作答過的題目
            </label>
          </div>
          <div className='grid grid-cols-2 gap-1 ml-2'>
            <label className="label">
              <input type="checkbox" className="toggle toggle-primary"
                     {...register('is_incorrect', {
                       onChange: () => {
                         if (currentValues.is_unanswered) setValue("is_unanswered", false)
                       }
                     })}/>
              只選曾作錯的題目
            </label>
          </div>
        </div>
      </div>
      <Badge size='lg' style='outline' className='mt-4'>
        出題數目
      </Badge>
      <div className='flex items-center justify-between mt-2'>
        <select className='select select-primary w-40' {...register('count')}>
          <option value=''>請選擇出題數</option>
          <option value='1'>每次1題</option>
          <option value='10'>出10題</option>
          <option value='20'>出20題</option>
          <option value='25'>出25題</option>
          <option value='50'>出50題</option>
        </select>
      </div>

      {currentValues.count === '' &&
        <div className='flex justify-end'>
          <Button color='success' className='mt-4' disabled>開始出題<FaArrowRight/></Button>
        </div>

      }
      {currentValues.count === '1' &&
        <>
          <div className='text-xs italic mt-1 opacity-70'>*每次作答會即時顯示結果</div>
          {currentValues.count === '1' &&
            <SelectSingle formData={currentValues}/>
          }
        </>
      }
      {(currentValues.count && currentValues.count !== '1') &&
        <>
          <div className='text-xs italic mt-1 opacity-70'>*提交所有答案後才會顯示結果</div>
          <div className='flex justify-end'>
            <Button color='success' className='mt-4' onClick={handleSubmit(onSubmit)}>開始出題<FaArrowRight/></Button>
          </div>
        </>
      }
    </div>
  )
}
