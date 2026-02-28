import {Editor} from "@tiptap/react";
import {MdFormatSize} from "react-icons/md";
import {toggleInlineClass} from "../CustomStyleMark.ts";
import {Dropdown, DropdownContent, DropdownToggle} from "@/component";

type Props = {
  editor: Editor,
}

const fontSizes = [
  {
    text: '大 3xl',
    className: 'text-3xl',
  },
  {
    text: '大 2xl',
    className: 'text-2xl',
  },
  {
    text: '大 xl ',
    className: 'text-xl',
  },
  {
    text: '大 lg',
    className: 'text-lg',
  },
  {
    text: '標準 md',
    className: 'text-base',
  },

  {
    text: '小 sm',
    className: 'text-sm',
  },
  {
    text: '小 xs',
    className: 'text-xs',
  },



] as const;

/* 文字大小選單 */
export default function BtnFontSize({editor}: Props) {

  const buttons = fontSizes.map(fontSize => {
    return (
      <li key={fontSize.text}>
        <button className={fontSize.className}
                onClick={() => toggleInlineClass(editor, fontSize.className)}>
          {fontSize.text}
        </button>
      </li>
    )
  })

  return (
    <Dropdown>
      <DropdownToggle size='xs' color='neutral' style='soft' className='text-base-content join-item'>
        <MdFormatSize className='text-lg'/>
      </DropdownToggle>
      <DropdownContent size='lg'>
        <ul className='menu w-full'>
          {buttons}
        </ul>
      </DropdownContent>
    </Dropdown>
  )
}