import {HtmlTitle} from "@/layout";
import PageHeader from "../../../layout/PageHeader.tsx";
import {DetailRow} from "@/component";
import {useAxios} from "@/hooks";
import {useSearchParams} from "react-router";
import {useEffect, useState} from "react";
import {ExamResultData} from "@/types/exam-types.ts";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";
import Questions from "@/features/Exam/Question/Questions.tsx";

/* 考古題單純顯示題目及解答的組件 */
export default function ExamPastPaper(){

  const title = '考古題測驗'
  const api = useAxios();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);   // 解析params，轉換為物件
  const [data, setData] = useState<ExamResultData>();

  useEffect(() => {
    showToast(
      async () => {
        const res1 = await api<ExamResultData>({
          method: 'GET',
          url: POLICE_API + '/exam/past_exam_paper/',
          params: params,
        })
        setData(res1.data);
      }
      , {label: '載入', error:(err)=>JSON.stringify(err.response?.data)}
    )
  }, []);

  if (!data) return null;

  return(
    <>
      <HtmlTitle title={title}/>
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
        選擇題（共{data.questions.select?.length}題）
      </div>
      <Questions questions={data.questions} answers={data.answers}/>
    </>
  )
}