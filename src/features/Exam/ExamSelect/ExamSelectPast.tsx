import {useCacheApi} from "@/hooks";
import {ExamPastData} from "@/types/exam-types.ts";
import {DataBrowserTitle} from "@/component";
import ExamSelectPastList from "@/features/Exam/ExamSelect/ExamSelectPastList.tsx";
import {POLICE_API} from "@/lib/config.ts";
import ModalFilter from "@/component/DataBrowser/ModalFilter.tsx";
import {HtmlTitle} from "@/layout";
import ExamSelectHeader from "@/features/Exam/ExamSelect/tools/ExamSelectHeader.tsx";

/* 考古題列表頁面 */
export default function ExamSelectPast() {

  const title = '考古題列表';
  const {data} = useCacheApi<Array<ExamPastData>>({url: POLICE_API +'/exam/past_exam_list/'});

  return (
    <>
      <HtmlTitle title={title}/>
      <ExamSelectHeader tab={2}/>
      <div className='card bg-base-100 card-border border-base-300 overflow-hidden'>
        <div className='card-body'>
          <div className='flex justify-between items-center'>
            <DataBrowserTitle title={title}/>
            <ModalFilter filterConfigs={[]} placeholder='搜尋標題'/>
          </div>
          <div className='divider m-0'></div>
          <ExamSelectPastList data={data}/>
        </div>
      </div>
    </>
  )
}