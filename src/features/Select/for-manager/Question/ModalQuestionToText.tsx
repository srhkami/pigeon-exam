import {ExamSelectData, QuestionsData} from "@/types/exam-types.ts";
import {useAxios, useModal} from "@/hooks";
import {useEffect, useRef, useState} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from "@/component";
import {MdOutlineContentCopy} from "react-icons/md";
import {errorLogger, showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";

type Props = {
  readonly questions: QuestionsData,
}

/* 將題目轉化成純文字 */
export default function ModalQuestionToText({questions}: Props) {

  const api = useAxios();
  const [selectData, setSelectData] = useState<Array<ExamSelectData>>([]); //選擇題題目清單
  const {isShow, onShow, onHide} = useModal();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isShow) {
      showToast(
        api({
          method: 'POST',
          url: POLICE_API + '/exam_select/questions/',
          data: {
            id_list: questions.select ?? [],
            is_read: false,
          }
        }), {label: '載入'}
      ).then(res => setSelectData(res.data))
    }
  }, [isShow]);

  const onCopy = () => {
    if (!contentRef.current) return;

    // 1. 取得 DOM 元素的 HTML (包含行內樣式)
    const elementHtml = contentRef.current.outerHTML;

    // 2. 取得純文字版本 (給記事本等不支援 HTML 的軟體用)
    const plainText = contentRef.current.innerText;

    // 3. 組合 Word 專用的 HTML 格式 (這是保留格式的關鍵)
    // 加入 meta charset utf-8 防止中文亂碼
    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            lang="zh-Hant"
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Export HTML To Word</title>
      </head>
      <body>
        ${elementHtml}
      </body>
      </html>
    `;

    showToast(
      async () => {
        // 4. 建立 Blob 物件
        const htmlBlob = new Blob([fullHtml], {type: 'text/html'});
        const textBlob = new Blob([plainText], {type: 'text/plain'});

        // 5. 寫入剪貼簿
        const clipboardItem = new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        });

        await navigator.clipboard.write([clipboardItem]);
      }, {success: '複製成功'}
    ).catch(err => errorLogger(err, '複製失敗'))
  };


  const questionItems = selectData.map((q, i) => {

    let number = (i + 1).toString();

    if (i + 1 < 10) {
      number = '0' + (i + 1)
    }

    return (
      <>
        <div key={q.id}>
          <div style={{textIndent: "-2em"}}>
            {/* eslint-disable-next-line no-irregular-whitespace */}
            <span style={{fontWeight: "bold"}}>{number}　</span>
            <span>{q.question}</span>
          </div>
        </div>
        {q.options.map((item, index) => {
          let optionLetter: string;
          if (index === 0) {
            optionLetter = 'A';
          } else if (index === 1) {
            optionLetter = 'B';
          } else if (index === 2) {
            optionLetter = 'C';
          } else if (index === 3) {
            optionLetter = 'D';
          } else {
            optionLetter = 'E';
          }
          return (
            <div key={item} style={{paddingLeft: "1.5em",textIndent: "-1.5em"}}>
              ({optionLetter}){item}
            </div>
          )
        })}
      </>
    )
  })

  const answerItems = selectData.map((q, i) => {
    const answer = q.answer[0];

    let number = (i + 1).toString();

    if (i + 1 < 10) {
      number = '0' + (i + 1)
    }

    let optionLetter: string;
    if (answer === 0) {
      optionLetter = 'A';
    } else if (answer === 1) {
      optionLetter = 'B';
    } else if (answer === 2) {
      optionLetter = 'C';
    } else if (answer === 3) {
      optionLetter = 'D';
    } else {
      optionLetter = 'E';
    }

    return (
      <div key={q.id}>
        {number}. {optionLetter}
      </div>
    )
  })

  return (
    <>
      <Button size='sm' style='outline' onClick={onShow}>
        <MdOutlineContentCopy/>生成文字檔
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>
            複製題目文字
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div ref={contentRef}>
            <ul className='list pl-8'>
              {questionItems}
            </ul>
            <div className='mt-4'>
              ※解答：
            </div>
            <div className='flex flex-wrap gap-2'>
              {answerItems}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button size='sm' color='success' onClick={onCopy}>
            複製
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
