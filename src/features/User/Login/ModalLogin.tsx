import {FaUser} from "react-icons/fa";
import {Button, Modal, ModalBody} from "@/component";
import {Login} from "@/features";
import {useModal} from "@/hooks";

/* 登入的對話框 */
export default function ModalLogin() {

  const {isShow, onShow, onHide} = useModal();

  return (
    <>
      <Button shape="circle" style='ghost' onClick={onShow}>
        <FaUser/>
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalBody>
          <Login/>
        </ModalBody>
      </Modal>
    </>
  )
}