import {useAxios, useCacheApi} from "@/hooks";
import {ExamPastData} from "@/types/exam-types.ts";
import {Button, DataBrowserTitle} from "@/component";
import {EXAM_API} from "@/lib/config.ts";
import ModalFilter from "@/component/DataBrowser/ModalFilter.tsx";
import SelectPageHeader from "@/features/Select/for-user/Random/SelectPageHeader.tsx";
import {showToast} from "@/func";
import {RiEdit2Fill, RiNewspaperFill} from "react-icons/ri";
import {useNavigate, useSearchParams} from "react-router";

/* 考古題列表頁面 */
export default function SelectPast() {

  const api = useAxios();
  const navi = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);   // 解析params，轉換為物件
  const keyword = params?.search;
  const {data} = useCacheApi<Array<ExamPastData>>({url: EXAM_API +'/select_past/list/'});

  const dataList = data?.map(obj => {

    const title = `${obj.year}年_${obj.source}_${obj.category}_${obj.subject}`

    const onExamStart = () => {
      showToast(
        api<string>({
          method: 'GET',
          url: EXAM_API + '/select_past/paper/',
          params: {
            year: obj.year,
            source: obj.source,
            category: obj.category,
            subject: obj.subject,
          }
        }), {label: '載入', error: '考古題載入失敗，請稍後再試。'}
      ).then(res => navi('/paper/' + res.data))
    }

    if (keyword && !title.includes(keyword)) {
      // 如果有關鍵字，且關鍵字不在標題之中
      return null
    }

    return (
      <li className="list-row hover:bg-base-200" key={title}>
        <div className="list-col-grow">
          <div className='textl-lg font-semibold '>
            <RiNewspaperFill className='inline mr-1'/>
            {title}
          </div>
          <div className="flex items-center justify-end">
            <Button size='xs' color='primary' style='outline' onClick={onExamStart}><RiEdit2Fill/>作答</Button>
          </div>
        </div>
      </li>
    )
  })

  return (
    <div>
      <SelectPageHeader tab={2}/>
      <div className='card bg-base-100 card-border border-base-300 overflow-hidden'>
        <div className='card-body'>
          <div className='flex justify-between items-center'>
            <DataBrowserTitle title='依考古題分類'/>
            <ModalFilter filterConfigs={[]} placeholder='搜尋標題'/>
          </div>
          <div className='divider m-0'></div>
          <ul className="list mx-2">
            {dataList}
          </ul>
        </div>
      </div>
    </div>
  )
}