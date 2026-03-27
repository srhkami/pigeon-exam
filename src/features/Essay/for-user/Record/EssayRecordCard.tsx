import {EssayRecordData} from "@/types/exam-types.ts";
import {FaRegStickyNote} from "react-icons/fa";
import {Badge, Button} from "@/component";
import {RiEdit2Fill} from "react-icons/ri";
import {useNavigate} from "react-router";
import {Dispatch, SetStateAction} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ModalRecordEdit from "@/features/Essay/for-user/Record/ModalRecordEdit.tsx";

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

  const navi = useNavigate();

  return (
    <div className='hover:bg-base-200 card card-border border-base-300 my-1 relative'>
      <div className='p-5'>
        <div className='font-bold'>
          <span>{record.question.question}</span>
        </div>
        <div className='flex justify-end'>
          <Button size='xs' color='primary' style='outline' className='ml-auto'
                  onClick={() => navi('/essay/question/' + record.question.id)}>
            <RiEdit2Fill/>檢視題目
          </Button>
        </div>
        <div className='mt-1'>
          <div className='divider m-0'></div>
          <div className='flex items-center gap-2 mb-2'>
            <Badge color='info'><FaRegStickyNote/>我的回答</Badge>
            <ModalRecordEdit record={record} setReload={setReload}/>
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