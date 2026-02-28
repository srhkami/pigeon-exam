import {Dispatch, SetStateAction} from "react";
import {Button, Col} from "@/component";
import {IoClose} from "react-icons/io5";
import ModalAddArticleLink from "@/features/Exam/tools/ArticleLink/ModalAddArticleLink.tsx";

type Props = {
  readonly articleLink: Array<[string, string]>;
  readonly setArticleLink: Dispatch<SetStateAction<Array<[string, string]>>>;
}

export default function ArticleLinkEdit({articleLink, setArticleLink}: Props) {

  const buttons = articleLink.map((item, index) => {

      const onDelete = () => {
        setArticleLink(prev => prev.filter((_, i) => i !== index))
      }

      return (
        <Button key={item[0] + item[1]} size='xs' color='accent' className='mr-1 mb-1 rounded-4xl'
                onClick={onDelete}>
          <IoClose className='i-12'/>
          {item[0]}-{item[1]}
        </Button>
      )
    }
  )

  return (
    <Col xs={12} className='mt-4'>
      <div className='flex gap-2 items-center'>
        <span className='label text-sm'>關聯法條</span>
        <ModalAddArticleLink setArticleLink={setArticleLink}/>
      </div>
      <div className='mt-2'>
        {buttons}
      </div>
    </Col>
  )
}