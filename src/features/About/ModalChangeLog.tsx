import {Button, Collapse, CollapseContent, CollapseTitle, Modal, ModalBody, ModalHeader} from "@/component";
import {CHANGE_LOGS} from "@/utils/logs.ts";
import BadgeLog from "@/features/About/BadgeLog.tsx";
import {useModal} from "@/hooks";

export default function ModalChangeLog(){

  const {isShow, onShow, onHide} = useModal();

  const logCollapse = CHANGE_LOGS.map(value => {
    return(
      <Collapse key={value.date} icon='plus' className='mb-2' inputName='change_log'>
        <CollapseTitle className='font-semibold'>
          {value.version}（{value.date}）
        </CollapseTitle>
        <CollapseContent className='text-sm'>
          <ul>
            {value.logs.map(log=>{
              return(
                <li key={log.text} className='m-2'>
                    <BadgeLog type={log.type}/>
                    {log.text}
                </li>
              )
            })}
          </ul>
        </CollapseContent>
      </Collapse>
    )
  })

  return(
    <>
    <Button size='sm' style='outline' onClick={onShow}>
      更新日誌
    </Button>
    <Modal isShow={isShow} onHide={onHide} closeButton>
      <ModalHeader className='text-xl font-bold' divider>
        更新日誌
      </ModalHeader>
      <ModalBody>
        {logCollapse}
      </ModalBody>
    </Modal>
    </>
  )
}

