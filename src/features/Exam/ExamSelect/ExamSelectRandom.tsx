import {SubmitHandler, useForm} from "react-hook-form";
import {Alert, Button, Collapse, CollapseContent, CollapseTitle} from "@/component";
import {FaArrowRight} from "react-icons/fa";
import {useAxios, useCacheApi} from "@/hooks";
import {showToast} from "@/utils/handleToast.ts";
import {Link, useNavigate} from "react-router";
import {POLICE_API} from "@/utils/config.ts";
import SelectSingle from "@/features/Exam/ExamSelect/tools/SelectSingle.tsx";
import {HtmlTitle} from "@/layout";
import ExamSelectHeader from "@/features/Exam/ExamSelect/tools/ExamSelectHeader.tsx";

type FormValues = {
  count: string,
  search?: string,
  source?: Array<string>,
  category?: Array<string>,
  subject?: Array<string>,
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
export default function ExamSelectRandom() {

  const api = useAxios();
  const navi = useNavigate();

  const {data} = useCacheApi<FormValues>({url: POLICE_API +'/exam_select/filter_options/'})

  const {register, watch, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      source: [], category: [], subject: []
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
        url: POLICE_API + '/exam_select/random_multi/',
        params: newParams,
      }), {baseText: '題目生成', error: err => JSON.stringify(err.response?.data)},
    ).then(res => navi('/exam/paper/' + res.data))
  }

  return (
    <>
      <HtmlTitle title='選擇題測驗'/>
      <ExamSelectHeader tab={1}/>
      <Collapse icon='plus'>
        <CollapseTitle>
          指定出題範圍
        </CollapseTitle>
        <CollapseContent>
          {/*動態渲染篩選區塊*/}
          <div className='flex my-2 items-center'>
            <div className='text-sm'>
              關鍵字：
            </div>
            <input type='text' className='input input-sm' placeholder='篩選題目/選項'
                   {...register('search')}/>
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
          <Alert color='info' style='dash'>
            <div>
              未來預計加入詳細區分法規來源的功能，提供學生進一步篩選複習。惟目前仍有大量題目需要整理，若您有意共同完善題庫，請洽詢老師或
              <Link to='/feedback/web?option=4' className='link inline'>點此聯繫作者</Link>。
            </div>
          </Alert>
        </CollapseContent>
      </Collapse>
      <div className='flex items-center mt-4'>
        <div className='text-sm font-semibold'>出題數目：</div>
        <select className='select select-sm select-primary w-30' {...register('count')}>
          <option value=''>請選擇</option>
          <option value='1'>每次1題</option>
          <option value='10'>出10題</option>
          <option value='20'>出20題</option>
          <option value='25'>出25題</option>
          <option value='50'>出50題</option>
        </select>
      </div>
      {currentValues.count === '1' &&
        <>
          <div className='text-xs italic mt-1 opacity-70'>*每次作答會即時顯示結果，不會儲存個人紀錄</div>
          {currentValues.count === '1' &&
            <SelectSingle formData={currentValues}/>
          }
        </>
      }
      {(currentValues.count && currentValues.count !== '1') &&
        <>
          <div className='text-xs italic mt-1 opacity-70'>*會生成一份隨機試卷，測驗完畢會儲存個人記錄</div>
          <div className='flex justify-end'>
            <Button color='success' className='mt-4' onClick={handleSubmit(onSubmit)}>出題<FaArrowRight/></Button>
          </div>
        </>
      }
    </>
  )
}
