import {PageHeader} from "@/features";
import {DetailRow} from "@/component";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {showToast} from "@/func";
import {useAxios} from "@/hooks";
import {EXAM_API_V2} from "@/lib/config.ts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AnalyzeData = {
  created_at: string,
  subject: string,
  response_text:string,
}

export default function AnalyzeReport(){

  const api = useAxios();
  const {id} = useParams()

  const [data, setData] = useState<AnalyzeData>()

  useEffect(() => {
    showToast(
      async()=> api<AnalyzeData>({
        url: EXAM_API_V2 + '/select/analyze_reports/' + id,
        method:'GET',
      }),
      {label:'載入', error:err=>JSON.stringify(err.response.data)}
    ).then(res=> {
      setData(res.data)
    })
  }, []);

  return(
    <div>
      <PageHeader title='AI 分析報告'/>
      <DetailRow
        start='創建時間：'
        center={data?.created_at}
      />
      <DetailRow
        start='科目：'
        center={data?.subject}
      />
      <PageHeader title='報告內容' as='h5' divider={false} className='mt-2'/>
      <div className='text-sm text-error italic'>※註：此份報告由 AI 生成，僅供參考。</div>
      <article className="prose max-w-full px-1 md:px-6 mt-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {data?.response_text}
        </ReactMarkdown>
      </article>
    </div>
  )
}