import {FaCirclePlus, FaDeleteLeft} from "react-icons/fa6";
import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {useAxios, useModal} from "@/hooks";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {PoliceLawData} from "@/types/policelaw-types.ts";
import {FaSearch} from "react-icons/fa";
import {SubmitHandler, useForm} from "react-hook-form";
import {ApiKeywordForm, ApiResData} from "@/types/api-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {showToast} from "@/utils/handleToast.ts";
import Articles from "@/features/Exam/tools/ArticleLink/Articles.tsx";

type Props = {
  readonly setArticleLink: Dispatch<SetStateAction<Array<[string, string]>>>,
}

export default function ModalAddArticleLink({setArticleLink}: Props) {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal();

  const [data, setData] = useState<Array<PoliceLawData>>([]);
  const [law, setLaw] = useState<PoliceLawData | null>(null);

  const {register, handleSubmit, setFocus} = useForm<ApiKeywordForm>();

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setFocus('keyword');
      }, 100); // 讓 Modal 有時間 render input
    }
  }, [isShow]);

  const onSubmit: SubmitHandler<ApiKeywordForm> = ({keyword}) => {
    showToast(
      api<ApiResData<Array<PoliceLawData>>>({
        method: "GET",
        url: POLICE_API + "/police_law/",
        params: {
          search: keyword,
          ordering: 'law_name',
        }
      }), {baseText: '搜尋'}
    ).then(res => setData(res.data.results))
  }

  const lawList = data.map(law => {
    return (
      <button className='list-row hover:bg-base-200 font-semibold cursor-pointer' onClick={() => setLaw(law)}
              key={law.id}>
        <div>{law.law_name}</div>
      </button>
    )
  })

  return (
    <>
      <Button type='submit' size='sm' onClick={onShow}>
        <FaCirclePlus/>查詢並新增
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton backdrop={false} size='xl'>
        <ModalHeader>
          <ModalTitle>加入關聯法條</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {
            !law ?
              <div>
                <div className='sticky top-0 z-10'>
                  <form onSubmit={handleSubmit(onSubmit)} className='join p-1'>
                    <input placeholder='搜尋法規' className='input input-sm join-item'
                           {...register('keyword', {required: true})}/>
                    <Button size='sm' type='reset' style='soft' className='join-item'>
                      <FaDeleteLeft/>
                    </Button>
                    <Button size='sm' style='soft' className='join-item'>
                      <FaSearch/>
                    </Button>
                  </form>
                </div>
                <ul className='list'>
                  {lawList}
                </ul>
              </div>
              :
              <Articles law={law} setLaw={setLaw} setArticleLink={setArticleLink}/>
          }
        </ModalBody>
      </Modal>
    </>
  )
}