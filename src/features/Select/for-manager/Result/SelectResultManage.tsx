import {useDataBrowser} from "@/hooks";
import {DataBrowser, DataBrowserTitle} from "@/component";
import {ExamResultData} from "@/types/exam-types.ts";
import ModalSelectFilter from "@/features/Select/for-manager/Manage/ModalSelectFilter.tsx";
import SelectResultManageList from "@/features/Select/for-manager/Result/SelectResultManageList.tsx";
import {POLICE_API} from "@/lib/config.ts";

/* 測驗結果管理 */
export default function SelectResultManage() {

  const {data, pageInfo} = useDataBrowser<ExamResultData>({url:POLICE_API +'/exam_result/'});

  return (
      <DataBrowser
        header={
          <>
            <DataBrowserTitle title='測驗結果管理'/>
            <ModalSelectFilter detailMode={false}/>
          </>
        }
        pageOption={{...pageInfo, show: 2}}
      >
        <SelectResultManageList data={data}/>
      </DataBrowser>
  )
}