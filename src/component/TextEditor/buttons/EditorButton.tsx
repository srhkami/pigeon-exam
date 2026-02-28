import {Editor} from "@tiptap/react";
import type {ButtonHTMLAttributes} from "react";
import {toggleBlockClass, toggleInlineClass} from "../CustomStyleMark.ts";
import {Button} from "@/component";

type Props = {
  readonly className: string,
  readonly title: string,
  readonly editor: Editor,
  readonly blockMode?: boolean,
}

/**
 * 自訂的文字編輯器按鈕
 * @param children
 * @param className 此按鈕按下後，會增刪的className
 * @param title 按鈕title值
 * @param editor
 * @param onClick
 * @param blockMode 是否修改整段的class，預設為否
 * @constructor
 */
export default function EditorButton({
                                       children,
                                       className,
                                       title,
                                       editor,
                                       onClick,
                                       blockMode = false
                                     }: Props & ButtonHTMLAttributes<HTMLButtonElement>) {
  if (!onClick) {
    if (blockMode) {
      return (
        <Button size='xs' color='neutral' style='soft' className='join-item text-base-content' title={title}
                onClick={() => toggleBlockClass(editor, className)}>
          {children}
        </Button>
      )
    }
    return (
      <Button size='xs' color='neutral' style='soft' className='join-item text-base-content' title={title}
              onClick={() => toggleInlineClass(editor, className)}>
        {children}
      </Button>
    )
  }
  return (
    <Button size='xs' color='neutral' style='soft' className='join-item text-base-content' title={title}
            onClick={onClick}>
      {children}
    </Button>
  )
}