import {Button, Modal, ModalBody, ModalHeader, ModalTitle, RichTextShow} from "@/component";
import {useModal, useToastApi} from "@/hooks";
import {ExamEssayAnswerData, ExamEssayData} from "@/types/exam-types.ts";
import {ApiResData} from "@/types/api-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {FaCircleUser} from "react-icons/fa6";
import LikeButton from "./LikeButton.tsx";

type Props = {
  readonly q: ExamEssayData;
}

/**
 * 同學的回答
 * @param q
 * @constructor
 */
export default function ModalExamEssayAnswers({q}: Props) {

  const {isShow, onShow, onHide} = useModal();

  const {data} = useToastApi<ApiResData<Array<ExamEssayAnswerData>>>({
    url: POLICE_API + '/exam_essay_answer/',
    method: 'GET',
    params: {
      'question': q.id,
    },
    init: isShow,
  });


  const items = data?.results.map(obj => {
    return (
      <div key={obj.id} className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <div className='flex items-center gap-2'>
            <FaCircleUser className='text-2xl'/>
            <div>
              <h2 className="card-title">{obj.user_display}</h2>
              <p className='text-xs opacity-50'>{obj.created_at}</p>
            </div>
            <LikeButton obj={obj}/>
          </div>
          <div className='divider m-0'></div>
          <RichTextShow jsonContent={obj.content}/>
        </div>
      </div>
    )
  })

  return (
    <>
      <div className="indicator mt-1">
        <span className="indicator-item badge badge-xs badge-info">{q.answer_count}</span>
        <Button size='xs' style='outline' onClick={onShow}>
          同學的回答
        </Button>
      </div>
      <Modal isShow={isShow} onHide={onHide} closeButton size='lg'>
        <ModalHeader>
          <ModalTitle>
            同學的回答
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div>{items}</div>
        </ModalBody>
      </Modal>
    </>
  )
}
