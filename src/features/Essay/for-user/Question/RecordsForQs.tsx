import {RichTextShow} from "@/component";
import {useAuth, useToastApi} from "@/hooks";
import {EssayQuestionData, EssayRecordData} from "@/types/exam-types.ts";
import {ApiResData} from "@/types/api-types.ts";
import {EXAM_API} from "@/lib/config.ts";
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

  const {data} = useToastApi<ApiResData<Array<EssayRecordData>>>({
    url: EXAM_API + '/essay_records/',
    method: 'GET',
    params: {
      'question': q.id,
      'is_public': true,
    },
  });


  const items = data?.results.map(obj => {

    if (!obj.is_public) {
      return null
    }

    return (
      <div key={obj.id} className="card bg-base-100 shadow-sm my-1">
        <div className="card-body">
          <div className='flex items-center gap-2'>
            <FaCircleUser className='text-2xl'/>
            <div>
              <h2 className="card-title">{obj.is_anonymous ? '匿名學生' : obj.user_display}</h2>
              <p className='text-xs opacity-50'>{obj.created_at}</p>
            </div>
            {obj.user === userInfo.id &&
              <ModalRecordEdit record={obj} setReload={setReload}/>
            }
          </div>
          <div className='divider m-0'></div>
          <article className="prose max-w-full px-1 md:px-6 mt-2">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {obj.content}
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
