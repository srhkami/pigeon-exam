import {ExamEssayCardConfig, ExamEssayData} from "@/types/exam-types.ts";
import {FaRegStickyNote} from "react-icons/fa";
import {Badge, Button, RichTextShow} from "@/component";
import ArticleLink from "@/features/Link/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Link/FileLink/FileLink.tsx";
import ModalExamEssayAnswers from "@/features/Essay/for-user/tools/ModalExamEssayAnswers.tsx";
import {Dispatch, SetStateAction} from "react";
import {useNavigate} from "react-router";
import {RiEdit2Fill} from "react-icons/ri";

type Props = {
  readonly q: ExamEssayData,
  readonly i: number,
  readonly config?: ExamEssayCardConfig,
  readonly setReload?: Dispatch<SetStateAction<boolean>>,
}

/**
 * 顯示申論題題目的卡片
 * @param q 申論題的物件
 * @param i 編號
 * @param config 卡片的設定
 * @param setReload 重新整理的函數
 * @constructor
 */
export default function EssayCard({q, i, config, setReload}: Props) {

  const title = q.question.length > 50 ? q.question.slice(0, 50) + "..." : q.question
  const navi = useNavigate();

  return (
    <div className='hover:bg-base-200 card card-border border-base-300 my-1 relative'>
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
        { setReload &&
          <div className="flex items-center justify-end">
            <Button size='xs' color='primary' style='outline' onClick={()=>navi('/exam/essay/detail/' + q.id)}>
              <RiEdit2Fill/>檢視及作答
            </Button>
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