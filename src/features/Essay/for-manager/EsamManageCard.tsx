import {ExamEssayCardConfig, ExamEssayData} from "@/types/exam-types.ts";
import {FaEdit, FaRegStickyNote} from "react-icons/fa";
import {Badge, Button, RichTextShow} from "@/component";
import {useState} from "react";
import EssayEdit from "@/features/Essay/for-manager/Edit/EssayEdit.tsx";
import ModalExamEssayAnswers from "@/features/Essay/for-manager/tools/ModalExamEssayAnswers.tsx";
import ArticleLink from "@/features/Link/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Link/FileLink/FileLink.tsx";

type Props = {
  readonly q: ExamEssayData,
  readonly i: number,
  readonly config?: ExamEssayCardConfig,
  readonly onRefetch?: ()=>void,
}

/**
 * 顯示申論題題目的卡片
 * @param q 申論題的物件
 * @param i 編號
 * @param config 卡片的設定
 * @param setReload 重新整理的函數
 * @constructor
 */
export default function EsamManageCard({q, i, config, onRefetch}: Props) {

  const title = q.question.length > 50 ? q.question.slice(0, 50) + "..." : q.question
  const [isEdit, setIsEdit] = useState<boolean>(false);

  if (isEdit && onRefetch !== undefined) {
    return (
      <div className="hover:bg-base-200 card-border border-2 border-error rounded-xl my-1 relative p-2">
        <EssayEdit obj={q} onRefetch={onRefetch} setIsEdit={setIsEdit}/>
      </div>
    )
  }

  return (
    <div className='hover:bg-base-200 card card-border border-base-300 my-1 relative'>
      {/*編輯按鈕*/}
      {onRefetch !== undefined &&
        <Button className='absolute top-1 right-1' size='sm' shape='circle'
                onClick={() => setIsEdit(true)}>
          <FaEdit/>
        </Button>
      }
      <div className='p-5'>
        <div className='font-bold'>
          <span className='mr-1'>{i + 1}. </span>
          <span>{config?.showDetail ? q.question : title}</span>
        </div>
        {
          config?.showDetail &&
          <div className='mt-1 text-xs flex items-center'>
            <div className='ml-auto'>
              {q.year}年｜{q.source}｜{q.subject}
            </div>
          </div>
        }
        {
          (config?.showSample && q.sample_answer) &&
          <div className='mt-1'>
            <div className='divider m-0'></div>
            <div className='flex justify-between items-center mb-2'>
              <Badge color='info'><FaRegStickyNote/>擬答</Badge>
              <ModalExamEssayAnswers q={q}/>
            </div>
            <RichTextShow jsonContent={q.sample_answer}/>
          </div>
        }
        {
          config?.showLinks &&
          <div>
            <div className='divider m-0'></div>
            <ArticleLink articleLink={q.article_link}/>
            <FileLink fileLink={q.file_link}/>
          </div>
        }
      </div>
    </div>
  )
}