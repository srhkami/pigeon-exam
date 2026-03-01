import {Button, Modal, ModalBody, ModalHeader, ModalTitle} from "@/component";
import {RiExternalLinkLine} from "react-icons/ri";
import {useAxios, useModal} from "@/hooks";
import {useState} from "react";
import {showToast} from "@/utils/handleToast.ts";
import {POLICE_API} from "@/lib/config.ts";

type Props = {
  readonly articleLink: Array<[string, string]>,
}

// 關聯法規的顯示及預覽
export default function ArticleLink({articleLink}: Props) {

  const buttons = articleLink.map((item) => {
    return <ModalArticleLink item={item} key={item[0] + '-' + item[1]}/>
  })

  return (
    <div className=''>
      {buttons}
    </div>
  )
}

function ModalArticleLink({item}: { readonly item: [string, string] }) {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal();
  const [text, setText] = useState<string>('');

  const onClick = () => {
    showToast(
      api<string>({
        method: 'GET',
        url: POLICE_API + '/police_law/article_text/',
        params: {
          law_name: item[0],
          article: item[1],
        }
      }), {baseText: '載入', error: err => err.response?.data.detail}
    ).then(res => {
      setText(res.data);
      onShow();
    })
  }
  return (
    <>
      <Button size='xs' color='accent' onClick={onClick}
              className='mr-1 mt-1 rounded-4xl'>
        {item[0]}-{item[1]}
        <RiExternalLinkLine className='text-xs' />
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>
            {item[0]}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className='text-lg text-primary border-l-3 border-l-primary pl-2 my-2'>
            {item[1]}
          </div>
          <div dangerouslySetInnerHTML={{
            __html: text
          }} className='text-sm leading-7 whitespace-pre-wrap'>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}