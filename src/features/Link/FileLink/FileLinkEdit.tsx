import {Dispatch, SetStateAction} from "react";
import {Button, Col} from "@/component";
import {IoClose} from "react-icons/io5";
import {HappyFileLink} from "@/types/enforcement-types.ts";
import ModalSelectFile from "@/features/Link/FileLink/ModalSelectFile.tsx";

type Props = {
  readonly fileLink: Array<HappyFileLink>;
  readonly setFileLink: Dispatch<SetStateAction<Array<HappyFileLink>>>;
}

export default function FileLinkEdit({fileLink, setFileLink}: Props) {

  const buttons = fileLink.map((item) => {

      const onDelete = () => {
        setFileLink(prev => prev.filter((v) => v.id !== item.id))
      }

      return (
        <Button key={item.id} size='xs' color='accent' className='mr-1 mb-1 rounded-4xl'
                onClick={onDelete}>
          <IoClose className='i-12'/>
          {item.title}
        </Button>
      )
    }
  )

  return (
    <Col xs={12} className='mt-4'>
      <div className="tooltip flex items-center">
        <span className='label text-sm mr-2'>關聯檔案</span>
        <ModalSelectFile setList={setFileLink} small/>
      </div>
      <div className='mt-2'>
        {buttons}
      </div>
    </Col>
  )
}