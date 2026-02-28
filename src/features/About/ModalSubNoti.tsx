import {MdOutlineNotificationAdd, MdOutlineNotificationsActive, MdOutlineNotificationsOff} from "react-icons/md";
import {requestPermission, subscribeNotifications, unsubscribeNotifications} from "@/utils/webpush.ts";
import {Badge, Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import AccordionHowInstall from "@/features/About/AccordionHowInstall.tsx";
import {useAuth, useModal} from "@/hooks";

type Props = {
  readonly group: 0 | 1,
}

/**
 * 訂閱通知的對話框
 * @param group 指定訂閱的群組
 * @constructor
 */
export default function ModalSubNoti({group}: Props) {

  const {userInfo} = useAuth();
  const {isShow, onShow, onHide} = useModal();

  return (
    <>
      <Button size='sm' onClick={onShow}>
        <MdOutlineNotificationAdd/>
        前往設定
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>
            訂閱瀏覽器通知
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div>
            <Badge size='sm' color='primary'>Step 1</Badge>
            <div className='mx-3 mt-2'>
              <div className='font-bold'>安裝應用程式（可選）</div>
              <div className='text-error font-semibold text-sm'>如您使用iPhone，務必完成以下操作才能進行下一步👇</div>
              <AccordionHowInstall/>
            </div>
          </div>
          <div className='divider'></div>
          <div>
            <Badge size='sm' color='primary'>Step 2</Badge>
            <div className='mx-3 mt-2'>
              <div className='font-bold'>點擊右側按鈕取得權限</div>
              <div className='font-semibold text-sm mt-1'>
                跳出權限請求時，請務必點擊<span className='bg-error'>「允許」</span>
                <br/>
                如不慎點擊拒絕，須至設定重新打開通知權限
              </div>
              <div className='flex justify-end mt-1'>
                <Button size='sm' color='success' onClick={() => requestPermission()}>
                  <MdOutlineNotificationsActive/>
                  訂閱通知
                </Button>
              </div>
            </div>
          </div>
          <div className='divider'></div>
          <div>
            <Badge size='sm' color='primary'>Step 3</Badge>
            <div className='mx-3 mt-2'>
              <div className='font-bold'>點擊右側按鈕訂閱通知</div>
              <div className='font-semibold text-sm mt-1'>
                如您有多台裝置，須在不同裝置逐一訂閱
              </div>
              <div className='flex justify-end'>
                <Button size='sm' color='success' onClick={() => subscribeNotifications(userInfo, group)}>
                  <MdOutlineNotificationsActive/>
                  訂閱通知
                </Button>
              </div>
            </div>
          </div>
          {/*<div className='divider'></div>*/}
          {/*<div>*/}
          {/*  <Badge size='sm' color='primary'>Step 4</Badge>*/}
          {/*  <div className='mx-3 mt-2'>*/}
          {/*    <div className='font-bold'>點擊右側按鈕如有彈出通知，表示設定成功！</div>*/}
          {/*    <div className='flex justify-end mt-1'>*/}
          {/*      <Button size='sm' color='success' onClick={handleTestPush}>*/}
          {/*        <AiOutlineNotification />*/}
          {/*        測試推送*/}
          {/*      </Button>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className='divider'></div>
          <div>
            <Badge size='sm' color='error'>Tip</Badge>
            <div className='mx-3 mt-2'>
              <div className='font-bold'>如果您不想收到通知，點擊右側按鈕移除通知</div>
              <div className='flex justify-end mt-1'>
                <Button size='sm' color='error' onClick={() => unsubscribeNotifications(userInfo)}>
                  <MdOutlineNotificationsOff/>
                  取消訂閱
                </Button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}