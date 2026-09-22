import {FaCirclePlus} from "react-icons/fa6"
import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component"
import {useModal} from "@/hooks"
import LawProvisionSearchPicker from "./LawProvisionSearchPicker.tsx"
import type {LawProvisionSummary} from "./lawReferenceController.ts"

type Props = {
  readonly selectedProvisionIds: number[]
  readonly onSelect: (provision: LawProvisionSummary) => void
}

export default function ModalAddArticleLink({selectedProvisionIds, onSelect}: Props) {
  const {isShow, onShow, onHide} = useModal()

  const close = () => {
    onHide()
  }

  return <>
    <Button type='button' size='sm' onClick={onShow}><FaCirclePlus/>查詢並新增</Button>
    <Modal isShow={isShow} onHide={close} closeButton backdrop={false} size='xl'>
      <ModalHeader><ModalTitle>加入關聯法條</ModalTitle></ModalHeader>
      <ModalBody>
        <LawProvisionSearchPicker isOpen={isShow} selectedProvisionIds={selectedProvisionIds} onSelect={onSelect}/>
      </ModalBody>
    </Modal>
  </>
}
