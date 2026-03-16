import {useModal, useScrollSpy} from "@/hooks";
import {ReactNode} from "react";
import {IoMdListBox} from "react-icons/io";
import {BottomBar, BottomMainButton, Modal, ModalBody, ModalHeader} from "@/component";

type Props = {
  readonly buttons?: ReactNode,
  readonly children: ReactNode, // 主要內容
}

/**
 * 帶有索引列表的頁面
 * 主要內容使用section標籤及ID屬性（同時為標籤名）
 * 會自動讀取所有ID值刷出索引
 * @param bottons 用在底部欄額外顯示的按鈕
 * @param children 傳入主要內容
 */
export default function IndexPage({buttons, children}: Props) {

  const {ids, activeId} = useScrollSpy();
  const {isShow, onShow, onHide} = useModal();

  const indexList = ids.map(id => {
    if (activeId == id) {
      return (
        <li className="border-l-2" key={id}>
          <a className="text-xs ml-4 opacity-75 block" href={'#' + id}>
            {id}
          </a>
        </li>
      )
    }
    return (
      <li className="hover:border-l-2 border-l-base-300" key={id}
          onClick={onHide}>
        <a className="text-xs ml-4 opacity-70 w-full block hover:opacity-100" href={'#' + id}>
          {id}
        </a>
      </li>
    )
  })

  return (
    <div className="mx-auto grid w-full grid-cols-1 lg:grid-cols-[1fr_180px]">
      {children}
      <div className="max-lg:hidden pl-6 ">
        <div className="sticky top-14 max-h-[75vh] overflow-x-hidden pt-10">
          <div className="flex flex-col gap-3">
            <div className="flex items-center text-xs font-medium tracking-widest opacity-50">
              <IoMdListBox className='mr-1'/>本頁索引
            </div>
            <ul className="flex flex-col gap-2 border-l border-l-base-300 ">
              {indexList}
            </ul>
          </div>
        </div>
      </div>
      <BottomBar
        mainButton={
          <BottomMainButton title='索引' className='lg:hidden'
                            onClick={onShow}>
            <IoMdListBox/>
          </BottomMainButton>
        }>
        {buttons}
      </BottomBar>
      {/*<div className='sticky bottom-0 flex justify-end lg:hidden '>*/}
      {/*  <Button size='lg' shape='circle' color='neutral' style='outline' title='索引'*/}
      {/*          className='mb-3 mr-3 opacity-80 backdrop-blur-sm  ' onClick={()=>setIsShow(true)}>*/}
      {/*    <IoMdListBox />*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <Modal isShow={isShow} onHide={onHide} size='xs' closeButton>
        <ModalHeader>
          <div className="flex items-center font-medium tracking-widest opacity-50">
            <IoMdListBox className='mr-1'/>本頁索引
          </div>
        </ModalHeader>
        <ModalBody>
          <ul className="flex flex-col gap-2  border-l-base-300 w-40">
            {indexList}
          </ul>
        </ModalBody>
      </Modal>
    </div>
  )
}