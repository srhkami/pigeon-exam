import {useCacheApi} from "@/hooks";
import {ExamPastData} from "@/types/exam-types.ts";
import {DataBrowserTitle} from "@/component";
import SelectPastList from "@/features/Select/for-user/Past/SelectPastList.tsx";
import {POLICE_API} from "@/lib/config.ts";
import ModalFilter from "@/component/DataBrowser/ModalFilter.tsx";
import {HtmlTitle} from "@/layout";
import SelectPageHeader from "@/features/Select/for-user/Random/SelectPageHeader.tsx";

/* 考古題列表頁面 */
export default function SelectPast() {

  const title = '考古題列表';
  const {data} = useCacheApi<Array<ExamPastData>>({url: POLICE_API +'/exam/past_exam_list/'});

  return (
    <>
      <HtmlTitle title={title}/>
      <SelectPageHeader tab={2}/>
      <div className='card bg-base-100 card-border border-base-300 overflow-hidden'>
        <div className='card-body'>
          <div className='flex justify-between items-center'>
            <DataBrowserTitle title={title}/>
            <ModalFilter filterConfigs={[]} placeholder='搜尋標題'/>
          </div>
          <div className='divider m-0'></div>
          <SelectPastList data={data}/>
        </div>
      </div>
    </>
  )
}