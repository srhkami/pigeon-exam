import {EssayCardConfig, EssayQuestionData} from "@/types/exam-types.ts";
import {FaRegStickyNote} from "react-icons/fa";
import {Badge, RichTextShow} from "@/component";
import ModalEssayRecords from "@/features/Essay/for-manager/Question/ModalEssayRecords.tsx";
import ArticleLink from "@/features/Link/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Link/FileLink/FileLink.tsx";
import ModalEssayQuestionEdit from "@/features/Essay/for-manager/Question/ModalEssayQuestionEdit.tsx";

type Props = {
  readonly q: EssayQuestionData,
  readonly i: number,
  readonly config?: EssayCardConfig,
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
export default function QsCardForEdit({q, i, config, onRefetch}: Props) {

  const title = q.question.length > 50 ? q.question.slice(0, 50) + "..." : q.question

  return (
    <div className='hover:bg-base-200 card card-border border-base-300 my-1 relative'>
      {onRefetch !== undefined &&
        <ModalEssayQuestionEdit q={q} onRefetch={onRefetch}/>
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
              <ModalEssayRecords q={q}/>
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