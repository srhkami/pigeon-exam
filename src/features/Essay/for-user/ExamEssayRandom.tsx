import {SubmitHandler, useForm} from "react-hook-form";
import {Button, Collapse, CollapseContent, CollapseTitle} from "@/component";
import {FaArrowRight} from "react-icons/fa";
import {useAxios, useCacheApi} from "@/hooks";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";
import {ExamEssayData} from "@/types/exam-types.ts";
import {HtmlTitle} from "@/layout";
import ExamEssayHeader from "@/features/Essay/for-user/tools/ExamEssayHeader.tsx";
import {useNavigate} from "react-router";

type FormValues = {
  count: string,
  search?: string
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
 * 申論題的隨機測驗
 * @constructor
 */
export default function ExamEssayRandom() {

  const api = useAxios();
  const navi = useNavigate();

  const {data} = useCacheApi<FormValues>({url: POLICE_API +'/exam_essay/filter_options/'})

  const {register, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      source: [], category: [], subject: []
    }
  });

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
      api<ExamEssayData>({
        method: 'GET',
        url: POLICE_API + '/exam_essay/random_single/',
        params: newParams,
      }), {label: '載入', error: err => JSON.stringify(err.response?.data)}
    )
      .then(res => navi(`/exam/essay/detail/${res.data.id}`))
  }

  return (
    <>
      <HtmlTitle title='申論題測驗'/>
      <ExamEssayHeader tab={2} />
      <Collapse icon='plus'>
        <CollapseTitle>
          指定出題範圍
        </CollapseTitle>
        <CollapseContent>
          <div className='flex my-2 items-center'>
            <div className='text-sm'>
              關鍵字：
            </div>
            <input type='text' className='input input-sm' placeholder='篩選題目/相關法規'
                   {...register('search')}/>
          </div>
          {/*動態渲染篩選區塊*/}
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
        </CollapseContent>
      </Collapse>
      <div className='flex mt-4'>
          <Button color='success' className='ml-auto' onClick={handleSubmit(onSubmit)}>
            出題<FaArrowRight/>
          </Button>
      </div>
    </>
  )
}
