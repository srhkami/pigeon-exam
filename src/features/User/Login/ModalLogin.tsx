import {FaUser} from "react-icons/fa";
import {Modal, ModalBody} from "@/component";
import {Login} from "@/features";
import {useModal} from "@/hooks";
import {type RefObject, useRef} from "react";

/* 登入的對話框 */
export default function ModalLogin({hideTrigger = false, returnFocusRef}: {
  hideTrigger?: boolean;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {

  const {isShow, onShow, onHide} = useModal();
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {!hideTrigger && <button ref={triggerRef} type='button' className='btn btn-circle btn-ghost' aria-label='會員登入' onClick={onShow}>
        <FaUser aria-hidden='true'/>
      </button>}
      <Modal isShow={isShow} onHide={onHide} closeButton focusManagement
             returnFocusRef={returnFocusRef ?? triggerRef} titleId='exam-member-login-title'>
        <ModalBody>
          <h2 id='exam-member-login-title' className='sr-only'>會員登入</h2>
          <Login onHide={onHide}/>
        </ModalBody>
      </Modal>
    </>
  )
}