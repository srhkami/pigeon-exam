import {EssayRecordData} from "@/types/exam-types.ts";
import {Dispatch, SetStateAction} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {FaCircleUser} from "react-icons/fa6";
import ModalScoreEdit from "@/features/Essay/for-manager/Record/ModalScoreEdit.tsx";

type Props = {
  readonly record: EssayRecordData,
  readonly setReload: Dispatch<SetStateAction<boolean>>
}

/**
 * 顯示申論題答案的卡片
 * @param record 作答記錄的物件
 * @param setReload 重新整理的函數
 * @constructor
 */
export default function EssayRecordCard({record, setReload}: Props) {

  return (
    <div className='hover:bg-base-200 card card-border border-base-300 my-1 relative'>
      <div className='p-5'>
        <div className='font-bold'>
          <span>{record.question.question}</span>
        </div>
        <div className='mt-1'>
          <div className='divider m-0'></div>
          <div className='flex items-center gap-2'>
            <FaCircleUser className='text-2xl'/>
            <div>
              <h2
                className="card-title">{record.user_display}{record.is_anonymous && '（匿名）'}{!record.is_public && '（不公開）'}</h2>
              <p className='text-xs opacity-50'>{record.created_at}</p>
            </div>
            <ModalScoreEdit record={record} setReload={setReload}/>
            {/*<ModalRecordEdit record={record} q={record.question} setReload={setReload} />*/}
          </div>
          <article className="prose max-w-full px-1 md:px-6 mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  )
}