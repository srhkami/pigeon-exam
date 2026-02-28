import {Editor} from "@tiptap/react";
import {MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdOutlineFormatStrikethrough} from "react-icons/md";
import EditorButton from "./EditorButton.tsx";
import BtnFontSize from "./BtnFontSize.tsx";

type Props = {
  readonly editor: Editor,
}

export default function BtnFontStyle({editor}: Props) {
  return (
    <div className='join'>
      <EditorButton className='font-bold' title='粗體' editor={editor}>
        <MdFormatBold className='text-lg'/>
      </EditorButton>
      <EditorButton className='italic' title='斜體' editor={editor}>
        <MdFormatItalic className='text-lg'/>
      </EditorButton>
      <EditorButton className='underline' title='底線' editor={editor}>
        <MdFormatUnderlined className='text-lg'/>
      </EditorButton>
      <EditorButton className='line-through' title='刪除線' editor={editor}>
        <MdOutlineFormatStrikethrough className='text-lg'/>
      </EditorButton>
      <BtnFontSize editor={editor}/>
    </div>
  )
}