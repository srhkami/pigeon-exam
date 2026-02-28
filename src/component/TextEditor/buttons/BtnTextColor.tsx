import {FaSquare} from "react-icons/fa";
import {useState} from "react";
import {Editor} from "@tiptap/react";
import {MdFormatColorText} from "react-icons/md";
import {twMerge} from "tailwind-merge";
import EditorButton from "./EditorButton.tsx";
import {toggleInlineClass} from "../CustomStyleMark.ts";
import {Dropdown, DropdownContent, DropdownToggle} from "@/component";

type Props = {
  readonly editor: Editor,
}

const textColors = [
  'text-base-content',
  'text-primary',
  'text-secondary',
  'text-accent',
  'text-accent-content',
  'text-info',
  'text-success',
  'text-warning',
  'text-warning-content',
  'text-error'
] as const;

type BtnTextColor = typeof textColors[number];

export default function BtnTextColor({editor}: Props) {

  const [color, setColor] = useState<BtnTextColor>('text-base-content');

  const buttons = textColors.map(textColor => {
    return (
      <li key={textColor}>
        <button
          onClick={() => {
            toggleInlineClass(editor, textColor);
            setColor(textColor);
          }
          }
          className={'flex justify-center ' + textColor}
        >
          <FaSquare/>
        </button>
      </li>
    )
  })

  return (
    <div className='join'>
      <EditorButton className={color} title='文字顏色' editor={editor}>
        <MdFormatColorText className={twMerge(color, 'text-lg')}/>
      </EditorButton>
      <Dropdown>
        <DropdownToggle size='xs' color='neutral' style='soft' className='join-item text-base-content'/>
        <DropdownContent size='xs'>
          <ul className='menu w-full'>
            {buttons}
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  )
}