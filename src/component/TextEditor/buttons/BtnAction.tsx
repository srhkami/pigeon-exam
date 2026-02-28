import {Editor} from "@tiptap/react";
import {Button} from "@/component";
import {FaRedo, FaUndo} from "react-icons/fa";

type Props = {
  readonly editor: Editor,
}

/* 復原操作的元件 */
export default function BtnAction({editor}: Props) {
  return (
    <div className='join flex items-center'>
      <Button size='xs' color='neutral' style='soft' className='join-item text-base-content' title='復原'
              onClick={() => editor.chain().focus().undo().run()}>
        <FaUndo />
      </Button>
      <Button size='xs' color='neutral' style='soft' className='join-item text-base-content' title='重做'
              onClick={() => editor.chain().focus().redo().run()}>
        <FaRedo />
      </Button>
      {/*<Button size='sm' color='neutral' style='soft' className='join-item text-base-content' title='復原文章'*/}
      {/*        onClick={handleRescue}>*/}
      {/*  <MdHistory className='text-lg'/>*/}
      {/*</Button>*/}
    </div>
  )
}