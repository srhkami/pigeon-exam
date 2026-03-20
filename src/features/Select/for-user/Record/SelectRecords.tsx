import {useDataBrowser} from "@/hooks";
import {SelectRecordData} from "@/types/exam-types.ts";
import {EXAM_API,} from "@/lib/config.ts";
import {DataBrowser, DataBrowserTitle} from "@/component";
import {FilterConfig} from "@/types/api-types.ts";
import QsCardForView from "@/features/Select/for-user/Question/for-view/QsCardForView.tsx";

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
        {/*<Row className='w-full'>*/}
        {/*  <Col xs={11}>*/}
        {/*    <div className="list-col-grow">*/}
        {/*      <div*/}
        {/*        className={twMerge('font-bold flex items-center', !record.is_correct && 'text-error')}*/}
        {/*      >*/}
        {/*        <HiMiniDocumentText className='mr-1'/>*/}
        {/*        {record.question.question.slice(0,50)}*/}
        {/*      </div>*/}
        {/*      <div className="text-secondary text-xs">{record.user_display}</div>*/}
        {/*      <div className="text-xs">{record.feedback_score}</div>*/}
        {/*    </div>*/}
        {/*  </Col>*/}
        {/*  <Col xs={1} className='flex items-center justify-center'>*/}
        {/*  </Col>*/}
        {/*</Row>*/}
        <QsCardForView q={record.question}
                       i={record.id - 1}
                       a={record.answer}
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