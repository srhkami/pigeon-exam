import {useDataBrowser} from "@/hooks";
import {Col, DataBrowser, DataBrowserTitle, FabAction, FloatingActionButton, Row} from "@/component";
import {SelectRecordData} from "@/types/exam-types.ts";
import {RiEdit2Fill} from "react-icons/ri";
import {TbReload} from "react-icons/tb";
import {EXAM_API} from "@/lib/config.ts";
import {FilterConfig} from "@/types/api-types.ts";
import {HiMiniDocumentText} from "react-icons/hi2";
import {twMerge} from "tailwind-merge";

/* 選擇題管理 */
export default function SelectRecordManage() {

  const title = '選擇題 - 作答紀錄';
  const {data, pageInfo, onRefetch} = useDataBrowser<SelectRecordData>({url: EXAM_API + '/select_records/'});

  const filterConfigs: Array<FilterConfig> = [
    {
    title: '排序',
    fieldName: 'ordering',
    options: [
      {label: '從新到舊', value: '-id'}
    ]
  },
    {
      title: '對錯',
      fieldName: 'is_correct',
      options: [
        {label: '正確', value: 'true'},
        {label: '錯誤', value: 'false'}
      ]
    }
  ]

  const dataList = data.map(record => {
    return (
      <li className="list-row hover:bg-base-200 px-0" key={record.id}>
        <Row className='w-full'>
          <Col xs={11}>
            <div className="list-col-grow">
              <div
                className={twMerge('font-bold flex items-center', !record.is_correct && 'text-error')}
              >
                <HiMiniDocumentText className='mr-1'/>
                {record.question.question.slice(0,50)}
              </div>
              <div className="text-secondary text-xs">{record.user_display}</div>
              <div className="text-xs">{record.feedback_score}</div>
              {/*<LetterLinkShow articleLink={letter.article_link}/>*/}
            </div>
          </Col>
          <Col xs={1} className='flex items-center justify-center'>
            {/*<ModalLetterDetail letter={letter} onRefetch={onRefetch}/>*/}
          </Col>
        </Row>
      </li>
    )
  })

  return (
    <>
      <DataBrowser
        header={<DataBrowserTitle title={title}/>}
        filterConfigs={filterConfigs}
        placeholder='搜尋題目/年份'
        pageOption={{...pageInfo, show: 2}}
      >
        <ul className="list mx-2">
          {dataList}
        </ul>
      </DataBrowser>
      <FloatingActionButton
        buttonContent={<RiEdit2Fill/>}
        color='primary'
        closeButton
      >
        <FabAction color='neutral' label='更新資料'
                   onClick={() => onRefetch()}>
          <TbReload/>
        </FabAction>
      </FloatingActionButton>
    </>
  )
}