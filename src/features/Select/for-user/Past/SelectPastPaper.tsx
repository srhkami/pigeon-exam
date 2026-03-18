import {DetailRow} from "@/component";
import {useAxios} from "@/hooks";
import {useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {PaperRecordData} from "@/types/exam-types.ts";
import {showToast} from "@/func";
import {EXAM_API} from "@/lib/config.ts";
import {PageHeader} from "@/features";
import QsCardForView from "@/features/Select/for-user/Question/for-view/QsCardForView.tsx";

/* 考古題單純顯示題目及解答的組件 */
export default function SelectPastPaper(){

  const title = '考古題測驗'
  const api = useAxios();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);   // 解析params，轉換為物件
  const [data, setData] = useState<PaperRecordData>();

  useEffect(() => {
    showToast(
      async () => {
        const res1 = await api<PaperRecordData>({
          method: 'GET',
          url: EXAM_API + '/past_exam_paper/',
          params: params,
        })
        setData(res1.data);
      }
      , {label: '載入', error:(err)=>JSON.stringify(err.response?.data)}
    )
  }, []);

  if (!data) return null;

  return(
    <div>
      <PageHeader title={title}/>
      <div>
        <DetailRow
          start='年份：'
          center={params.year + '年'}/>
        <DetailRow
          start='出處：'
          center={params.source}/>
        <DetailRow
          start='類科：'
          center={params.category}/>
        <DetailRow
          start='科目：'
          center={params.subject}/>
      </div>
      <div className='divider'></div>
      <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
        選擇題（共{data.select_records.length}題）
      </div>
      <ul className='list'>
        {
          data.select_records.map((item, index) => {
            return (
              <QsCardForView
                key={item.id}
                i={index}
                q={item.question}
                a={item.answer}
                config={{
                  showOptions: true,
                  showComment: false,
                  showLinks: true,
                  showRating: true
                }}
              />
            )
          })
        }
      </ul>
    </div>
  )
}