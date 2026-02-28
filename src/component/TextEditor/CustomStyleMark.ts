import {Mark, mergeAttributes} from '@tiptap/core'
import {Editor} from "@tiptap/react";
import {twMerge} from "tailwind-merge";
import {Paragraph} from '@tiptap/extension-paragraph'

export type CustomStyle = {
  HTMLAttributes: Record<string, any>
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customStyle: {
      setCustomStyle: (className: string) => ReturnType
      unsetCustomStyle: () => ReturnType
    }
  }
}

export const CustomStyleMark = Mark.create<CustomStyle>({
  name: 'customStyle',

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      class: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[class]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setCustomStyle:
        (className) =>
          ({ commands }) =>
            commands.setMark(this.name, { class: className }),
      unsetCustomStyle:
        () =>
          ({ commands }) =>
            commands.unsetMark(this.name),
    }
  },
})

export const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          return {
            class: attributes.class,
          }
        },
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes), 0]
  },
})

/* 切換區塊的Class樣式 */
export function toggleInlineClass(editor: Editor, className: string) {
  if (!editor) return

  const currentClass:string = editor.getAttributes('customStyle').class || ''

  // 將 class 拆成陣列（注意要過濾空白）
  const classList = currentClass.split(' ').filter(Boolean)

  const hasClass = classList.includes(className)

  let newClass: string

  if (hasClass) {
    // 移除指定 class
    newClass = classList.filter(cls => cls !== className).join(' ')
  } else {
    // 加入指定 class，並使用 tailwind-merge 合併
    newClass = twMerge(currentClass, className)
  }

  // 如果沒有 class，則直接移除 mark
  if (newClass === '') {
    editor.chain().focus().unsetCustomStyle().run()
  } else {
    editor.chain().focus().setCustomStyle(newClass).run()
  }
}

/* 切換段落層級的 class 樣式（例如 text-align、縮排等）*/
export function toggleBlockClass(editor: Editor, className: string) {
  if (!editor) return

  const currentAttrs = editor.getAttributes('paragraph')
  const currentClass:string = currentAttrs.class || ''

  const classList = currentClass.split(' ').filter(Boolean)
  const hasClass = classList.includes(className)

  let nextClass: string

  if (hasClass) {
    // 若已有該 class，就移除
    nextClass = classList.filter(cls => cls !== className).join(' ')
  } else {
    // 若沒有該 class，就加上
    nextClass = twMerge(currentClass, className)
  }

  editor.chain().focus().updateAttributes('paragraph', { class: nextClass }).run()
}