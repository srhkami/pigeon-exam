import {Editor, EditorContent, generateHTML, JSONContent, useEditor} from "@tiptap/react";
import {Dispatch, SetStateAction, useCallback, useEffect} from "react";
import DOMPurify from "dompurify";
import {tiptapExtensions} from "@/component/TextEditor/tiptapExtensions.ts";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from "@/component";
import {FaEdit, FaTrash} from "react-icons/fa";
import {useModal} from "@/hooks";
import _ from "lodash";
import BtnAction from "@/component/TextEditor/buttons/BtnAction.tsx";
import BtnFontStyle from "@/component/TextEditor/buttons/BtnFontStyle.tsx";
import BtnTextColor from "@/component/TextEditor/buttons/BtnTextColor.tsx";
import BtnTextAlign from "@/component/TextEditor/buttons/BtnTextAlign.tsx";
import BtnList from "@/component/TextEditor/buttons/BtnList.tsx";
import BtnImage from "@/component/TextEditor/buttons/BtnImage.tsx";
import {PageHeader} from "@/features";
import {FaFile} from "react-icons/fa6";

type Props = {
  readonly content: JSONContent | null,
  readonly setContent: Dispatch<SetStateAction<JSONContent | null>>,
}

/**
 * 編輯器組件
 * 包含預覽及編輯Modal
 * @constructor
 */
export default function ModalTextEditor({content, setContent}: Props) {

  const {isShow, onShow, onHide} = useModal();

  // 轉換為html
  const html = content ? DOMPurify.sanitize(generateHTML(content, tiptapExtensions)) : '（空白）'

  const editor = useEditor({
    extensions: tiptapExtensions,
    content: content,
  }) as Editor;

  const saveToLocalStorage = useCallback(
    _.debounce(() => {
      localStorage.setItem('tiptap-content', JSON.stringify(editor.getJSON()));
      console.log('內容已儲存到 localStorage');
    }, 5000),
    []
  )

  useEffect(() => {
    // 每當有更新儲存
    editor.on('update', () => {
      setContent(editor.getJSON());
      // 定時自動儲存到localStorage，用以回復內文
      saveToLocalStorage();
    })
  }, [editor, saveToLocalStorage]);

  return (
    <div className='rounded-lg border p-2'>
      <div className='flex justify-between'>
        <PageHeader title='文本預覽' as='h5' divider={false}/>
        <Button size='sm' style='outline' color='success' className='ml-auto' onClick={onShow}>
          <FaEdit/>編輯文本
        </Button>
      </div>
      <div dangerouslySetInnerHTML={{
        __html: html
      }}>
      </div>
      <div className='divider m-0'></div>
      <Modal isShow={isShow} onHide={onHide} size='2xl' closeButton backdrop={false}>
        <ModalHeader className='block'>
          <ModalTitle className='flex gap-2'>
            文本編輯器
            <BtnAction editor={editor}/>
          </ModalTitle>
          <div className='sticky top-0 z-10 bg-base-100 flex flex-wrap gap-2 mt-2'>
            <BtnTextColor editor={editor}/>
            <BtnFontStyle editor={editor}/>
            <BtnTextAlign editor={editor}/>
            <BtnList editor={editor}/>
            <BtnImage editor={editor}/>
            <Col xs={12} className='divider m-0'></Col>
          </div>
        </ModalHeader>
        <ModalBody>
          <EditorContent editor={editor}
                         className="bg-base-200 min-h-50 z-0"/>
        </ModalBody>
        <ModalFooter className='justify-between'>
          <Button size='sm' style='outline' color='error' onClick={() => setContent(null)}>
            <FaTrash/>清空文本
          </Button>
          <Button size='sm' color='success' onClick={onHide}>
            <FaFile/>暫存並關閉
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}