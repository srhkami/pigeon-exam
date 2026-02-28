import {ExamSelectData} from "@/types/exam-types.ts";
import {useModal} from "@/hooks";
import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {PiNoteBold} from "react-icons/pi";
import SelectResultCard from "@/features/Exam/Question/SelectResultCard.tsx";
import Memos from "@/features/Exam/ExamSelect/Memo/Memos.tsx";
import {useState} from "react";
import AddMemo from "@/features/Exam/ExamSelect/Memo/AddMemo.tsx";

type Props = {
  readonly q: ExamSelectData
}

export default function ModalSelectMemo({q}: Props) {

  const {isShow, onShow, onHide} = useModal()
  const [reload, setReload] = useState<boolean>(false);

  return (
    <>
      <div className="indicator ml-auto">
        <span className="indicator-item badge badge-xs badge-info">{q.memo_count}</span>
        <Button size='xs' style='outline' onClick={onShow}>
          <PiNoteBold/> 作筆記
        </Button>
      </div>
      <Modal isShow={isShow} onHide={onHide} size='xl'>
        <ModalHeader>
          <ModalTitle>
            筆記
          </ModalTitle>
        </ModalHeader>
        <ModalBody className='text-sm'>
          <SelectResultCard q={q} i={0}
                            config={{
                              showOptions: true,
                              showRating: false,
                              showLinks: false,
                              showComment: false
                            }}
          />
          <AddMemo question_id={q.id} setReload={setReload}/>
          <Memos question_id={q.id} reload={reload}/>
        </ModalBody>
      </Modal>
    </>
  )
}