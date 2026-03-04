import {Button, Modal, ModalBody, ModalHeader} from "@/component";
import {FaSearch} from "react-icons/fa";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useAxios, useModal} from "@/hooks";
import {ApiKeywordForm} from "@/types/api-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {errorLogger, showToast} from "@/func";
import {SubmitHandler, useForm} from "react-hook-form";
import {FileDetailData, HappyFileLink, HappyworkSearchResultData} from "@/types/happywork-types.ts";
import {FaCirclePlus, FaDeleteLeft} from "react-icons/fa6";
import toast from "react-hot-toast";

type Props = {
  readonly setList: Dispatch<SetStateAction<Array<HappyFileLink>>>,
  readonly small?: boolean,
}

export default function ModalSelectFile({setList, small = false,}: Props) {

  const {isShow, onShow, onHide} = useModal();

  const api = useAxios();
  const [data, setData] = useState<Array<FileDetailData>>([]);
  const {register, handleSubmit, setFocus} = useForm<ApiKeywordForm>();

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setFocus('keyword');
      }, 100); // 讓 Modal 有時間 render input
    }
  }, [isShow]);

  const onSubmit: SubmitHandler<ApiKeywordForm> = (formData) => {
    showToast(
      api<HappyworkSearchResultData>({
        method: 'GET',
        url: POLICE_API + '/happywork/sop_search/',
        params: {
          search: formData.keyword,
        }
      }), {label: '搜尋'}
    )
      .then(res => setData(res.data.files))
      .catch(err => errorLogger(err, '開心上班搜尋錯誤'))
  }

  const dataList = data.map(file => {
    const handleSelect = () => {
      setList(prev => [
        ...prev,
        {
          id: file.id.toString(),
          title: file.title,
          url: file.short_url
        }
      ])
      toast.success('新增成功');
    }
    return (
      <button key={file.id} onClick={handleSelect}
              className='list-row hover:bg-base-300 cursor-pointer'>
        {file.title}
      </button>
    )
  })

  return (
    <>
      {!small ?
        <Button size='sm' color='primary' shape='block'
                className='ml-auto mt-2' onClick={onShow}>
          <FaCirclePlus/>新增
        </Button> :
        <Button size='sm' onClick={onShow}>
          <FaCirclePlus/>查詢並新增
        </Button>
      }
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader divider>
          <form onSubmit={handleSubmit(onSubmit)} className='flex gap-2'>
            <input placeholder='搜尋作業程序' className='input input-sm mb-2 join-item'
                   {...register('keyword', {required: true})}/>
            <div className='join'>
              <Button size='sm' type='reset' style='soft' className='join-item'>
                <FaDeleteLeft/>
              </Button>
              <Button size='sm' style='soft' className='join-item'>
                <FaSearch/>
              </Button>
            </div>
          </form>
        </ModalHeader>
        <ModalBody>
          <ul className="list mx-2 gap-1">
            {dataList}
          </ul>
        </ModalBody>
      </Modal>
    </>
  )
}