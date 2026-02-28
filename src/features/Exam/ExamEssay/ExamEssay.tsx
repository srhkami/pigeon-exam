import {useDataBrowser} from "@/hooks";
import {ExamEssayData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/utils/config.ts";
import {HtmlTitle} from "@/layout";
import {DataBrowser, DataBrowserTitle} from "@/component";
import ModalEssayFilter from "@/features/Exam/ExamEssay/tools/ModalEssayFilter.tsx";
import ExamEssayCard from "@/features/Exam/ExamEssay/ExamEssayCard.tsx";
import ExamEssayHeader from "@/features/Exam/ExamEssay/tools/ExamEssayHeader.tsx";

export default function ExamEssay() {

  const {data, pageInfo, setReload} = useDataBrowser<ExamEssayData>({
    url: POLICE_API + '/exam_essay/',
    pageSize: 10,
    defaultParams: {is_public: 'true'}
  });


  const dataList = data.map(q => {
    return (
      <ExamEssayCard key={q.id} q={q} i={q.id - 1}
                     config={{showDetail: true, showSample: false, showLinks: false}}
                     setReload={setReload}/>
    )
  })

  return (
    <>
      <HtmlTitle title='申論題總覽'/>
      <ExamEssayHeader tab={1}/>
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
    </>
  )
}