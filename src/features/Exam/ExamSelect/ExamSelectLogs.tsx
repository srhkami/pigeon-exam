import {useDataBrowser} from "@/hooks";
import {ExamResultData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/utils/config.ts";
import {HtmlTitle} from "@/layout";
import {DataBrowser, DataBrowserTitle} from "@/component";
import {FilterConfig} from "@/types/api-types.ts";
import ExamSelectHeader from "@/features/Exam/ExamSelect/tools/ExamSelectHeader.tsx";
import ExamSelectLogList from "@/features/Exam/ExamSelect/ExamSelectLogList.tsx";

export default function ExamSelectLogs() {

  const title = '我的測驗記錄';
  const {data, pageInfo} = useDataBrowser<ExamResultData>({url: POLICE_API + '/exam_result/self_list/', pageSize: 10});

  const filterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '從新到舊', value: '-id'},
        {label: '從舊到新', value: 'id'},
      ]
    }
  ]

  return (
    <>
      <HtmlTitle title={title}/>
      <ExamSelectHeader tab={3}/>
      <DataBrowser
        header={<DataBrowserTitle title={title}/>}
        placeholder='搜尋標題/類科/科目'
        filterConfigs={filterConfigs}
        pageOption={{...pageInfo, show: 2}}
      >
        <ExamSelectLogList data={data}/>
      </DataBrowser>
    </>
  )
}