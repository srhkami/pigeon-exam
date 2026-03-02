import {useAxios} from "@/hooks";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {ExamResultData} from "@/types/exam-types.ts";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";
import {HtmlTitle} from "@/layout";
import {DetailRow} from "@/component";
import PageHeader from "@/layout/PageHeader.tsx";
import Questions from "@/features/Select/for-user/Question/Questions.tsx";

export default function SelectResult() {

  const api = useAxios();
  const navi = useNavigate();
  const {id} = useParams();
  const [data, setData] = useState<ExamResultData>();

  useEffect(() => {
    showToast(
      async () => {
        const res = await api<ExamResultData>({
          method: 'GET',
          url: POLICE_API + '/exam_result/' + id + '/',
        })
        setData(res.data);
      }
      , {label: '載入', error: (err) => err.response.data.detail}
    ).catch(() => navi('/exam'))
  }, []);

  if (!data) return null;

  return (
    <>
      <HtmlTitle title='測驗結果'/>
      <PageHeader title={data.title}/>
      <div className='mb-2 flex items-center'>
        <span className='text-6xl italic text-red-500'>{Math.round(data.right_count / data.total_count * 100)}</span>
        <span className='ml-2 mt-auto text-2xl italic'>分</span>
      </div>
      <div>
        <DetailRow
          start='答對題數：'
          center={<span>{data.right_count} / {data.total_count}</span>}/>
        <DetailRow
          start='測驗時間：'
          center={data.created_at}/>
        <DetailRow
          start='類科：'
          center={data.category}/>
        <DetailRow
          start='科目：'
          center={data.subject}/>
      </div>
      <div className='divider'></div>
      <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
        選擇題（共{data.questions.select?.length}題）
      </div>
      <Questions questions={data.questions} answers={data.answers}/>
    </>
  )
}