import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {useModal} from "@/hooks";
import {EssayQuestionData} from "@/types/exam-types.ts";
import {FaCircleUser} from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  readonly q: EssayQuestionData,
}

export default function ModalEssayRecords({q}: Props) {

  const {isShow, onShow, onHide} = useModal();

  const items = q.records.map(record => {
    return (
      <div key={record.id} className="card bg-base-100 shadow-sm my-1">
        <div className="card-body">
          <div className='flex items-center gap-2'>
            <FaCircleUser className='text-2xl'/>
            <div>
              <h2 className="card-title">{record.user_display}{record.is_anonymous && '（匿名）'}{record.is_public && '（不公開）'}</h2>
              <p className='text-xs opacity-50'>{record.created_at}</p>
            </div>
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
    <>
      <div className="indicator mt-1">
        <span className="indicator-item badge badge-xs badge-info">{q.record_count}</span>
        <Button size='xs' style='outline' onClick={onShow}>
          學生回答
        </Button>
      </div>
      <Modal isShow={isShow} onHide={onHide} closeButton size='lg'>
        <ModalHeader>
          <ModalTitle>
            學生回答
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div>{items}</div>
        </ModalBody>
      </Modal>
    </>
  )
}
