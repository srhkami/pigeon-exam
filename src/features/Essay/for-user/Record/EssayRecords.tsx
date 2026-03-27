import {DataBrowser, DataBrowserTitle} from "@/component";
import {useDataBrowser} from "@/hooks";
import {EssayRecordData} from "@/types/exam-types.ts";
import {EXAM_API} from "@/lib/config.ts";
import EssayRecordCard from "@/features/Essay/for-user/Record/EssayRecordCard.tsx";
import {FilterConfig} from "@/types/api-types.ts";

export default function EssayRecords() {

  const {
    data,
    pageInfo,
    setReload
  } = useDataBrowser<EssayRecordData>({url: EXAM_API + '/essay_records/self/', pageSize: 10})

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

  const dataList = data.map(record => {
    return (
      <EssayRecordCard key={record.id} record={record} setReload={setReload}/>
    )
  }
  )

  return (
    <div>
      <DataBrowser
        header={
          <DataBrowserTitle title='申論題 - 我作答過的題目'/>
        }
        filterConfigs={filterConfigs}
        pageOption={{...pageInfo, show: 2}}
      >
        {dataList}
      </DataBrowser>
    </div>
  )
}