import {DataBrowser, DataBrowserTitle} from "@/component";
import {useDataBrowser} from "@/hooks";
import {ExamEssayAnswerData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import ExamEssaySelfAnswerCard from "@/features/Essay/for-user/ExamEssaySelfAnswerCard.tsx";
import {HtmlTitle} from "@/layout";
import ExamEssayHeader from "@/features/Essay/for-user/tools/ExamEssayHeader.tsx";
import {FilterConfig} from "@/types/api-types.ts";

export default function ExamEssaySelfAnswers() {

  const {
    data,
    pageInfo,
    setReload
  } = useDataBrowser<ExamEssayAnswerData>({url: POLICE_API + '/exam_essay_answer/self_list', pageSize: 10})

  const filterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '從新到舊', value: '-id'},
        {label: '從舊到新', value: 'id'},
        {label: '科目', value: 'subject'},
      ]
    }
  ]

  const items = data.map(obj => {
    return (
      <ExamEssaySelfAnswerCard key={obj.id} obj={obj} setReload={setReload}/>
    )
  })

  return (
    <>
      <HtmlTitle title='申論題作答紀錄'/>
      <ExamEssayHeader tab={3}/>
      <DataBrowser
        header={
          <DataBrowserTitle title='我的作答紀錄'/>
        }
        filterConfigs={filterConfigs}
        pageOption={{...pageInfo, show: 2}}
      >
        {items}
      </DataBrowser>
    </>
  )
}