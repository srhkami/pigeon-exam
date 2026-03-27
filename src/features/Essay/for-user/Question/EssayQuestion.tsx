import {EssayQuestionData} from "@/types/exam-types.ts";
import {PageHeader} from "@/features";
import {useState} from "react";
import {Button} from "@/component";
import {FaDoorClosed, FaDoorOpen} from "react-icons/fa";
import {EXAM_API} from "@/lib/config.ts";
import {useToastApi} from "@/hooks";
import {useParams} from "react-router";
import RecordsForQs from "@/features/Essay/for-user/Question/RecordsForQs.tsx";
import ModalRecordEdit from "@/features/Essay/for-user/Record/ModalRecordEdit.tsx";

export default function EssayQuestion() {

  const title = '申論題題目';
  const {id} = useParams();
  const [reload, setReload] = useState<boolean>(false);
  const {data: q} = useToastApi<EssayQuestionData>({url: `${EXAM_API}/essay_questions/${id}/`, reload:reload})
  const [showSample, setShowSample] = useState<boolean>(false);

  if (!q) {
    return null
  }

  return (
    <>
      <PageHeader title={title}/>
      <PageHeader title='問題' divider={false} as='h5'/>
      <div>
        {q.question}
      </div>
      <div className='flex justify-end mt-2'>
        <ModalRecordEdit q={q} setReload={setReload}/>
      </div>
      <div className='divider'/>
      <div className='mt-4 font-bold mb-3 pl-4 border-l-4 text-lg border-l-secondary flex gap-2'>
        <div>
          所有回答
        </div>
        <div>
          {!showSample &&
            <Button size='sm' color='warning' onClick={() => setShowSample(true)}><FaDoorOpen/>參考一下</Button>
          }
          {showSample &&
            <Button size='sm' color='warning' onClick={() => setShowSample(false)}><FaDoorClosed/>我要靠自己！</Button>
          }
        </div>
      </div>
      {showSample &&
        <RecordsForQs q={q} setReload={setReload}/>
      }
    </>
  )
}