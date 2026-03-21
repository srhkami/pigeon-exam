import {useDataBrowser} from "@/hooks";
import {Button, DataBrowser, DataBrowserTitle} from "@/component";
import {PaperRecordData} from "@/types/exam-types.ts";
import {EXAM_API} from "@/lib/config.ts";
import {useNavigate} from "react-router";
import {PiExam} from "react-icons/pi";
import {MdOutlineOpenInNew} from "react-icons/md";
import {FilterConfig} from "@/types/api-types.ts";

/* 測驗結果管理 */
export default function PaperRecordsManage() {

  const {data, pageInfo} = useDataBrowser<PaperRecordData>({url: EXAM_API + '/paper_records/'});

  const navi = useNavigate();

  const filterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '從新到舊', value: '-ud'},
        {label: '從舊到新', value: 'ud'},
      ]
    }
  ]

  const dataList = data.map(record => {
    return (
      <li className="list-row hover:bg-base-200" key={record.id}>
        <div className='flex items-center justify-center'>
          <PiExam className='w-5 h-5'/>
        </div>
        <div className="list-col-grow">
          <div className='textl-lg font-semibold'>
            {record.title}
          </div>
          <div className="text-xs uppercase opacity-60 flex items-center">
            <span className='mr-1'>{record.user_display}</span>
            <span>{record.score}分</span>
          </div>
        </div>
        <Button style='ghost' shape='circle'
                onClick={() => navi('/manage/paper/record/' + record.id)}>
          <MdOutlineOpenInNew className='text-xl'/>
        </Button>
      </li>
    )
  })

  return (
    <DataBrowser
      header={<DataBrowserTitle title='測驗紀錄查閱'/>}
      filterConfigs={filterConfigs}
      placeholder='搜尋標題/使用者'
      pageOption={{...pageInfo, show: 2}}
    >
      <ul className="list mx-2">
        {dataList}
      </ul>
    </DataBrowser>
  )
}