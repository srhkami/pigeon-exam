import {useState} from "react";
import axios from "axios";
import {USER_API} from "@/lib/config.ts";
import {ManagerInfoData} from "@/types/user-types.ts";
import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {useModal} from "@/hooks";
import {showToast} from "@/utils/handleToast.ts";

/** 顯示管理員名冊的對話框 */
export default function ModalManagers() {

  const {isShow, onShow, onHide} = useModal();
  const [data, setData] = useState<Array<ManagerInfoData>>([]);

  const onModalShow = () => {
    showToast(
      axios({
        method: 'GET',
        url: USER_API + '/managers/',
      }),{baseText:'載入'}
    )
      .then(res => {
        setData(res.data);
        onShow();
      })
      .catch(err => console.log(err))
  }

  const itemList = data.map(obj => {
    return (
      <tr key={obj.name}>
        <th>{obj.name}</th>
        <td>{obj.unit_first}{obj.unit_second}</td>
      </tr>
    )
  })

  return (
    <>
      <Button style='outline' size='sm' onClick={onModalShow}>
        查看管理員列表
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>
            網站管理員列表
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>姓名(暱稱)</th>
                <th>服務單位</th>
              </tr>
            </thead>
            <tbody>
            {itemList}
            </tbody>
          </table>
        </ModalBody>
      </Modal>
    </>
  )
}