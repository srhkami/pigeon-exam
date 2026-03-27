import {RichTextShow} from "@/component";
import {useAuth,} from "@/hooks";
import {EssayQuestionData,} from "@/types/exam-types.ts";
import {FaCircleUser} from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Dispatch, SetStateAction} from "react";
import ModalRecordEdit from "@/features/Essay/for-user/Record/ModalRecordEdit.tsx";

type Props = {
  readonly q: EssayQuestionData;
  readonly setReload: Dispatch<SetStateAction<boolean>>
}

export default function RecordsForQs({q, setReload}: Props) {

  const {userInfo} = useAuth();

  const items = q.records.map(record => {

    if (!record.is_public) {
      return null
    }

    return (
      <div key={record.id} className="card bg-base-100 shadow-sm my-1">
        <div className="card-body">
          <div className='flex items-center gap-2'>
            <FaCircleUser className='text-2xl'/>
            <div>
              <h2 className="card-title">{record.is_anonymous ? '匿名學生' : record.user_display}</h2>
              <p className='text-xs opacity-50'>{record.created_at}</p>
            </div>
            {record.user === userInfo.id &&
              <ModalRecordEdit record={record} q={q} setReload={setReload}/>
            }
          </div>
          <div className='divider m-0'></div>
          <article className="prose max-w-full px-1 md:px-6 mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {record.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    )
  })

  return (
    <div>
      <div className='card bg-base-100 shadow-sm my-1'>
        <div className="card-body">
          <div className='flex items-center gap-2'>
            <FaCircleUser className='text-2xl'/>
            <div>
              <h2 className="card-title">鴿手擬答</h2>
              <p className='text-xs opacity-50'>{q.created_at}</p>
            </div>
          </div>
          <div className='divider m-0'></div>
          <RichTextShow jsonContent={q.sample_answer}/>
        </div>
      </div>
      {items}
    </div>
  )
}
