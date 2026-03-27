import {EssayRecordData} from "@/types/exam-types.ts";
import {Badge, Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {useModal} from "@/hooks";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  readonly record: EssayRecordData,
}

export default function ModalScore({record}: Props) {

  const {isShow, onShow, onHide} = useModal()

  return (
    <>
      <Button style='outline' size='xs' onClick={onShow}>
        評分
        <Badge color='error' size='xs'>{record.score}</Badge>
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>評分</ModalTitle>
        </ModalHeader>
        <ModalBody className='p-1'>
          <div>
            分數（滿分25）： {record.score}
          </div>
          <div>
            <div className='label'>評語或建議</div>
            <article className="prose max-w-full px-1 md:px-6 mt-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {record.comment}
              </ReactMarkdown>
            </article>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}