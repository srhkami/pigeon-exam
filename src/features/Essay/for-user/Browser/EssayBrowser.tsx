import {useDataBrowser} from "@/hooks";
import {ExamEssayData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {DataBrowser, DataBrowserTitle} from "@/component";
import ModalEssayFilter from "@/features/Essay/for-user/tools/ModalEssayFilter.tsx";
import EssayCard from "@/features/Essay/for-user/Detail/EssayCard.tsx";
import EssayPageHeader from "@/features/Essay/for-user/Browser/EssayPageHeader.tsx";

export default function EssayBrowser() {

  const {data, pageInfo, setReload} = useDataBrowser<ExamEssayData>({
    url: POLICE_API + '/exam_essay/',
    pageSize: 10,
    defaultParams: {is_public: 'true'}
  });


  const dataList = data.map(q => {
    return (
      <EssayCard key={q.id} q={q} i={q.id - 1}
                 config={{showDetail: true, showSample: false, showLinks: false}}
                 setReload={setReload}/>
    )
  })

  return (
    <div>
      <EssayPageHeader tab={1}/>
      <DataBrowser
        header={<>
          <DataBrowserTitle title='題目列表'/>
          <ModalEssayFilter/>
        </>}
        pageOption={{...pageInfo, show: 2}}
      >
        <ul className="list mx-2">
          {dataList}
        </ul>
      </DataBrowser>
    </div>
  )
}