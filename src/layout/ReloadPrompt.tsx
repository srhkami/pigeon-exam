import {useRegisterSW} from 'virtual:pwa-register/react';
import {Button, Modal, ModalBody, ModalFooter} from "@/component";
import {useModal} from "@/hooks";
import {useEffect} from "react";

export default function ReloadPrompt() {

  const {isShow, onShow, onHide} = useModal();

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const onClose = () => {
    setNeedRefresh(false);
    onHide();
  };

  useEffect(() => {
    if (needRefresh) {
      onShow();
    }
  }, [needRefresh]);

  return (
    <Modal isShow={isShow} onHide={onHide}>
      <ModalBody>
        偵測到APP有新版本，建議立即更新！
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => updateServiceWorker(true)}>
          立即更新
        </Button>
        <Button onClick={() => onClose()}>
          暫不更新
        </Button>
      </ModalFooter>
    </Modal>
  )
}