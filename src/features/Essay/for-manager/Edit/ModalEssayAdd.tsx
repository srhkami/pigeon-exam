import {useModal} from "@/hooks";
import {FabAction, Modal, ModalBody, ModalHeader, ModalTitle,} from "@/component";
import {MdAddComment} from "react-icons/md";
import EssayEdit from "@/features/Essay/for-manager/Edit/EssayEdit.tsx";

type Props = {
  readonly onRefetch: ()=>void,
}

/* 新增申論題目的彈出視窗 */
export default function ModalEssayAdd({onRefetch}: Props) {

  const {isShow, onShow, onHide} = useModal();

  return (
    <>
      <FabAction color='primary' onClick={onShow} label='新增題目'>
        <MdAddComment className='text-xl'/>
      </FabAction>
      <Modal isShow={isShow} onHide={onHide} size='xl' closeButton backdrop={false}>
        <ModalHeader>
          <ModalTitle>新增申論題</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <EssayEdit onRefetch={onRefetch}/>
        </ModalBody>
      </Modal>
    </>
  )
}