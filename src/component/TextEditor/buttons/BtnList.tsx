import {Editor} from "@tiptap/react";
import {MdFormatListBulleted, MdFormatListNumbered} from "react-icons/md";
import {LuTextQuote} from "react-icons/lu";
import EditorButton from "./EditorButton.tsx";

type Props = {
  readonly editor: Editor,
}

export default function BtnList({editor}: Props) {
  return (
    <div className='join'>
      <EditorButton className='' title='無序清單' editor={editor}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <MdFormatListBulleted className='text-lg'/>
      </EditorButton>
      <EditorButton className='' title='有序清單' editor={editor}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <MdFormatListNumbered className='text-lg'/>
      </EditorButton>
      <EditorButton className='' title='引用' editor={editor}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <LuTextQuote className='text-lg'/>
      </EditorButton>
    </div>
  )
}