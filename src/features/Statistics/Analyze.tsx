import {useState} from "react";
import {Badge, Button, Loading} from "@/component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {useAuth, useAxios} from "@/hooks";
import {showToast} from "@/func";
import {AI_API_V2} from "@/lib/config.ts";

type Props = {
  readonly subject: string | null,
}

export default function Analyze({subject}: Props) {

  const api = useAxios();
  const {userInfo} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

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
      <ul className='list list-disc pl-4'>
        <li>
          透過 AI 分析近期的作答情形，找出個人弱項。
        </li>
        <li>
          執行此功能會消耗AI點數，您現有 {userInfo.ai_point} 點。
        </li>
        <li>
          此功能由 Gemini3-Flash 提供結果，僅供參考，請對內容進行查證。
        </li>
        <li>
          分析結果除了即時顯示外，會寄送一份包含報告網址的電子郵件至您的信箱。
        </li>
      </ul>

      {
        !subject &&
        <Button disabled className='mt-2'>請先指定科目</Button>
      }
      {
        (!isLoading && subject) &&
        <div className='flex gap-2'>
          <Button style='outline' onClick={() => onSubmit(false)}>
            分析最近100題，不論對錯
            <Badge size='xs' color='error'>2點</Badge>
          </Button>
          <Button style='outline' onClick={() => onSubmit(true)}>
            分析最近50題，答錯的題目
            <Badge size='xs' color='error'>1點</Badge>
          </Button>
        </div>
      }
      {
        isLoading && <div>
          <Loading style='bars'/>
          內容生成中，請稍候
          <Loading style='dots'/>
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