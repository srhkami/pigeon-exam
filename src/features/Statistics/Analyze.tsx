import {useState} from "react";
import {Button, Loading} from "@/component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {useAxios} from "@/hooks";
import {showToast} from "@/func";
import {AI_API_V2} from "@/lib/config.ts";

type Props = {
  readonly subject: string,
}

export default function Analyze({subject}: Props) {

  const api = useAxios();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('沒有任何結果');

  const onSubmit = (incorrect_mode: boolean) => {
    setIsLoading(true);
    showToast(
      async () => api({
        url: AI_API_V2 + '/exam/select_analyze',
        method: 'GET',
        params: {
          subject: subject,
          incorrect_mode: incorrect_mode,
        }
      }), {label: '生成結果', error: err => err.response.data.text}
    ).then(res => {
      setMessage(res.data.text)
    }).finally(() => setIsLoading(false))
  }


  return (
    <div className='mt-2'>
      {
        isLoading ?
          <Loading style='bars'/>
          :
          <div className='flex gap-2'>
            <Button style='outline' onClick={() => onSubmit(false)}>分析所有題目</Button>
            <Button style='outline' color='error' onClick={() => onSubmit(true)}>分析錯誤題目</Button>
          </div>
      }

      <article className="prose max-w-full px-1 md:px-6 mt-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message}
        </ReactMarkdown>
      </article>
    </div>
  )
}