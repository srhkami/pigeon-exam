import {Editor} from "@tiptap/react";
import {MdFormatAlignCenter, MdFormatAlignLeft, MdFormatAlignRight, MdFormatLineSpacing} from "react-icons/md";
import EditorButton from "./EditorButton.tsx";
import {PiTextIndentBold} from "react-icons/pi";

type Props = {
  readonly editor: Editor,
}

export default function BtnTextAlign({editor}: Props) {
  return (
    <div className='join'>
      <EditorButton editor={editor} className='text-left' title='向左對齊' blockMode>
        <MdFormatAlignLeft className='text-lg'/>
      </EditorButton>
      <EditorButton editor={editor} className='text-center' title='置中對齊' blockMode>
        <MdFormatAlignCenter className='text-lg'/>
      </EditorButton>
      <EditorButton editor={editor} className='text-right' title='向右對齊' blockMode>
        <MdFormatAlignRight className='text-lg'/>
      </EditorButton>
      <EditorButton editor={editor} className='mb-4' title='加大行距' blockMode>
        <MdFormatLineSpacing  className='text-lg'/>
      </EditorButton>
      <EditorButton editor={editor} className='indent-8' title='縮排' blockMode>
        <PiTextIndentBold   className='text-lg'/>
      </EditorButton>
    </div>
  )
}