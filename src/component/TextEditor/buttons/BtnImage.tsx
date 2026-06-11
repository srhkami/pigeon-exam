import {Editor} from "@tiptap/react";
import {Button} from "@/component";
import {useCallback} from "react";
import {BiImageAdd} from "react-icons/bi";

type Props = {
  readonly editor: Editor,
}

/* 復原操作的元件 */
export default function BtnImage({editor}: Props) {

  const addImage = useCallback(() => {
    const url = window.prompt('請輸入圖片網址（外部連結或先上傳資料庫）')

    if (url) {
      editor.chain().focus().setImage({src: url}).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <Button size='xs' color='neutral' style='soft' className='join-item text-base-content' title='插入圖片'
            onClick={addImage}>
      <BiImageAdd className='text-lg'/>
    </Button>
  )
}