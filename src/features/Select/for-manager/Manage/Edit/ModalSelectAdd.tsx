import {useModal} from "@/hooks";
import {FabAction, Modal, ModalBody, ModalHeader, ModalTitle,} from "@/component";
import {MdAddComment} from "react-icons/md";
import SelectEdit from "@/features/Select/for-manager/Manage/Edit/SelectEdit.tsx";

type Props = {
  readonly onRefetch:()=>void,
}

/* 編輯選擇題的彈出視窗 */
export default function ModalSelectAdd({onRefetch}: Props) {

  const {isShow, onShow, onHide} = useModal();

  return (
    <>
      <FabAction color='primary' onClick={onShow} label='新增題目'>
        <MdAddComment className='text-xl'/>
      </FabAction>
      <Modal isShow={isShow} onHide={onHide} size='xl' closeButton backdrop={false}>
        <ModalHeader>
          <ModalTitle>新增選擇題</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <SelectEdit onRefetch={onRefetch}/>
        </ModalBody>
      </Modal>
    </>
  )
}