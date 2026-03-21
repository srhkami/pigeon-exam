import {Dispatch, SetStateAction, useState} from "react";
import {Button, FabAction, Modal, ModalBody} from "@/component";
import {useAxios, useCacheApi, useModal} from "@/hooks";
import {SubmitHandler, useForm} from "react-hook-form";
import {ApiResData} from "@/types/api-types.ts";
import toast from "react-hot-toast";
import {MdAddComment} from "react-icons/md";
import {FaSearch} from "react-icons/fa";
import {SelectQuestionSimpleData} from "@/types/exam-types.ts";
import {EXAM_API, EXAM_API_V2} from "@/lib/config.ts";
import {showToast} from "@/func";

type FormValues = {
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

type Props = {
  readonly setSelectQuestions: Dispatch<SetStateAction<Array<SelectQuestionSimpleData>>>
}


/**
 * 使用 Fisher-Yates 演算法進行不重複隨機抽樣
 * @param {Array} arr - 原始陣列
 * @param {number} n - 要選取的數量
 * @returns {Array} 隨機選取的子集
 */
export function fisherYates<T>(arr: Array<T>, n: number) {
  // 複製陣列以避免修改原始陣列
  const sample = [...arr];
  const len = sample.length;

  // 只需要迭代 n 次 (抽樣的次數)，因為我們只需要 n 個結果
  for (let i = 0; i < n; i++) {
    // 從尚未選取的範圍 [i, len - 1] 中，隨機選擇一個索引 j
    // 數學公式：i + Math.floor(Math.random() * (len - i))
    const j = i + Math.floor(Math.random() * (len - i));

    // 將隨機選中的元素 (sample[j]) 與當前位置的元素 (sample[i]) 交換
    [sample[i], sample[j]] = [sample[j], sample[i]];
  }

  // 返回前 n 個元素，這些就是隨機選取的 n 個不重複樣本
  return sample.slice(0, n);
}

/**
 * 加入選擇題的彈出視窗
 * @constructor
 */
export default function ModalAddSelectQuestion({setSelectQuestions}: Props) {

  const api = useAxios();
  const [select, setSelect] = useState<Array<SelectQuestionSimpleData>>([]);

  const {isShow, onShow, onHide} = useModal();
  const {data} = useCacheApi<FormValues>({url: EXAM_API_V2 + '/select/filter_options'})
  const {register, setValue, watch, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      source: [], category: [], subject: [], search: '',
    }
  });
  const currentValues = watch(); // 監聽所有欄位變化

  const filterConfigs: Array<FilterConfig> = [
    // {
    //   title: '排序',
    //   fieldName: 'ordering',
    //   options: [
    //     {label: 'ID', value: '-id'},
    //     {label: '題號', value: 'question_number'},
    //     {label: '年份', value: 'year'},
    //   ]
    // },
    // {
    //   title: '關聯',
    //   fieldName: 'link_is_null',
    //   options: [
    //     {label: '無關聯物件', value: 'true'},
    //     {label: '有關聯物件', value: 'false'},
    //   ]
    // },
    // {
    //   title: '註解',
    //   fieldName: 'comment_is_null',
    //   options: [
    //     {label: '無註解', value: 'true'},
    //     {label: '有註解', value: 'false'},
    //   ]
    // },
    // {
    //   title: '公開',
    //   fieldName: 'is_public',
    //   options: [
    //     {label: '公開中', value: 'true'},
    //     {label: '未公開', value: 'false'},
    //   ]
    // },
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
      Object.entries(formData).filter(([_, v]) => v != null && v !== '' )
    );
    const newParams = new URLSearchParams(cleanData as any);
    showToast(
      api<ApiResData<Array<SelectQuestionSimpleData>>>({
        method: 'GET',
        url: EXAM_API + '/select_questions/',
        params: newParams
      }), {label: '搜尋'}
    ).then(res => setSelect(res.data.results))
  }

  //隨機選題
  const onRandom = (n: number) => {
    const sample = fisherYates<SelectQuestionSimpleData>(select, n)
    sample.forEach((newItem) => {
      setSelectQuestions(p => {
        // 檢查陣列 p 中是否已經存在與 newItem.id 相同的物件
        const isDuplicate = p.some(obj => obj.id === newItem.id);
        if (isDuplicate) {
          return p;
        } else {
          return [...p, newItem];
        }
      });
    })
    toast.success('加入成功');
  }

  const items = select.map((q) => {

    //加入一筆，並檢測有無重複
    const onAdd = (newItem: SelectQuestionSimpleData) => {
      setSelectQuestions(p => {
        // 檢查陣列 p 中是否已經存在與 newItem.id 相同的物件
        const isDuplicate = p.some(obj => obj.id === newItem.id);
        if (isDuplicate) {
          // 1. 如果存在重複項目（舊的），則返回當前的狀態 p
          //    **不會觸發新增**，狀態保持不變
          toast.error('已存在相同題目')
          return p;
        } else {
          // 2. 如果不存在重複項目，則將新項目新增到陣列末尾
          toast.success('加入成功')
          return [...p, newItem];
        }
      });
    }

    return (
      <li key={q.id} className='my-1'>
        <button className='p-2 bg-base-200 hover:bg-base-300 cursor-pointer rounded-xl w-full'
                onClick={() => onAdd(q)}>
          <div>
            <div className='text-start'>
              {q.question.slice(0, 50)}
            </div>
            <div className='text-xs text-secondary text-start'>
              {q.year}年 {q.category} {q.subject}
            </div>
          </div>
        </button>
      </li>
    )
  })

  return (
    <>
      <FabAction label='加入題目' color='primary' onClick={onShow}>
        <MdAddComment/>
      </FabAction>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)} className='p-1'>
            <input className='input input-sm' placeholder='搜尋題目/年份'
                   {...register('search')}/>
            {currentValues.search &&
              <Button type='button' size='xs' shape='circle' style='outline' color='error' className='ml-2'
                      onClick={() => setValue('search', '')}>
                ×
              </Button>
            }
          </form>
          {/* 動態渲染篩選區塊 */}
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
          <div className='mt-2 flex justify-end'>
            <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}>
              <FaSearch/>查詢
            </Button>
          </div>
          <div className='divider m-0'></div>
          <div className='flex justify-around'>
            {select.length > 1 &&
              <Button size='sm' color='primary' className='mr-1' onClick={() => onRandom(1)}>隨機選1題</Button>}
            {select.length > 5 &&
              <Button size='sm' color='primary' className='mr-1' onClick={() => onRandom(5)}>隨機選5題</Button>}
            {select.length > 10 &&
              <Button size='sm' color='primary' onClick={() => onRandom(10)}>隨機選10題</Button>}
          </div>
          <ul className='list mt-2'>
            {items}
          </ul>
        </ModalBody>
      </Modal>
    </>
  )
}