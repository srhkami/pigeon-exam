import {useDataBrowser} from "@/hooks";
import {SelectRecordData} from "@/types/exam-types.ts";
import {EXAM_API,} from "@/lib/config.ts";
import {DataBrowser, DataBrowserTitle} from "@/component";
import {FilterConfig} from "@/types/api-types.ts";
import QsCardForRecord from "@/features/Select/for-user/Question/QsCardForRecord.tsx";

export default function SelectRecords() {

  const title = '選擇題作答記錄';
  const {data, pageInfo} = useDataBrowser<SelectRecordData>({url: EXAM_API + '/select_records/self/', pageSize: 10});

  const filterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '從新到舊', value: '-id'},
        {label: '從舊到新', value: 'id'},
      ]
    },
    {
      title: '對錯',
      fieldName: 'is_correct',
      options: [
        {label: '作答錯誤', value: 'false'},
        {label: '作答正確', value: 'true'},
      ]
    }
  ]

  const items = data.map((record) => {
    return (
      <li key={record.id}>
        <QsCardForRecord
          record={record}
          i={record.question.id - 1}
          key={record.id}
          config={{
            showOptions: true,
            showRating: true,
            showLinks: true,
            showComment: true,
          }}/>
      </li>
    )
  })
  return (
    <DataBrowser
      header={<DataBrowserTitle title={title}/>}
      placeholder='搜尋標題/類科/科目'
      filterConfigs={filterConfigs}
      pageOption={{...pageInfo, show: 2}}
    >
      <ul className='list'>
        {items}
      </ul>
    </DataBrowser>
  )
}