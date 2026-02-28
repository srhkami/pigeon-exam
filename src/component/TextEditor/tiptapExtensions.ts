import StarterKit from "@tiptap/starter-kit";
import {CustomParagraph, CustomStyleMark} from "@/component/TextEditor/CustomStyleMark.ts";
import {ListItem} from "@tiptap/extension-list-item";
import Image from "@tiptap/extension-image";
import {BulletList} from "@tiptap/extension-bullet-list";
import {OrderedList} from "@tiptap/extension-ordered-list";
import {Blockquote} from "@tiptap/extension-blockquote";

export const tiptapExtensions = [
  StarterKit.configure({
    bulletList: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
  }),
  CustomStyleMark,
  CustomParagraph,
  ListItem,
  Image,
  BulletList.extend({
    addAttributes() {
      return {
        class: {
          default: 'list-disc pl-6',
        },
      }
    },
  }),
  OrderedList.extend({
    addAttributes() {
      return {
        class: {
          default: 'list-decimal pl-6',
        },
      }
    },
  }),
  Blockquote.extend({
    addAttributes() {
      return {
        class: {
          default: 'border-l-4 border-gray-300 pl-4 text-gray-600 my-4',
        },
      }
    },
  }),
]