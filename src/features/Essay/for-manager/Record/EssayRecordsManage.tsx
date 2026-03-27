import {useDataBrowser} from "@/hooks";
import {EssayRecordData} from "@/types/exam-types.ts";
import {EXAM_API} from "@/lib/config.ts";
import {DataBrowser, DataBrowserTitle, FabAction, FloatingActionButton} from "@/component";
import {RiEdit2Fill} from "react-icons/ri";
import ModalEssayQuestionEdit from "@/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx";
import {FilterConfig} from "@/types/api-types.ts";
import EssayRecordCard from "@/features/Essay/for-manager/Record/EssayRecordCard.tsx";
import {TbReload} from "react-icons/tb";

export default function EssayRecordsManage() {

  const title = '申論題 - 作答紀錄管理';
  const {data, pageInfo, onRefetch, setReload} = useDataBrowser<EssayRecordData>({url: EXAM_API + '/essay_records/', pageSize:10});

  const filterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '從新到舊', value: '-id'}
      ]
    }
  ]

  const dataList = data.map(record => {
    return (
      <EssayRecordCard key={record.id} record={record} setReload={setReload} />
    )
  })

  return (
    <>
      <DataBrowser
        header={<DataBrowserTitle title={title}/>}
        filterConfigs={filterConfigs}
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
        <ModalEssayQuestionEdit onRefetch={onRefetch}/>
        <FabAction color='neutral' label='更新資料'
                   onClick={() => onRefetch()}>
          <TbReload/>
        </FabAction>
      </FloatingActionButton>
    </>
  )
}