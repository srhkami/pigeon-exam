import {IoPersonAddSharp} from "react-icons/io5";
import {Button, Col, Modal, ModalBody, ModalTitle} from "@/component";
import {MEDIA_IP} from "@/lib/config.ts";
import {useModal} from "@/hooks";

export default function ModalLine() {

  const {isShow, onShow, onHide} = useModal();

  return (
    <>
      <Button size='sm' color='primary' className='ms-auto' style='outline' onClick={onShow}>
        <IoPersonAddSharp className='me-1'/>
        加入Line好友
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalBody className='row justify-content-center'>
          <ModalTitle className='text-center'>
            請掃描或點擊 QR code 加入好友
          </ModalTitle>
          <Col xs={6} className="mx-auto">
            <a href="https://line.me/ti/p/mvI1aBkiy6" className="w-50">
              <img src={MEDIA_IP + '/media/image/line_qrcode.jpg'} alt=""/>
            </a>
          </Col>
        </ModalBody>
      </Modal>
    </>
  )
};



