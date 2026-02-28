import {useToastApi} from "@/hooks";
import {ExamMemoData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/utils/config.ts";
import ArticleLink from "@/features/Exam/tools/ArticleLink/ArticleLink.tsx";
import FileLink from "@/features/Exam/tools/FileLink/FileLink.tsx";
import {Collapse, CollapseContent, CollapseTitle, RichTextShow} from "@/component";
import {PiNoteBold} from "react-icons/pi";
import {ApiResData} from "@/types/api-types.ts";

type Props = {
  readonly question_id: number,
  readonly reload: boolean,
}

export default function Memos({question_id, reload}: Props) {

  const {data} = useToastApi<ApiResData<Array<ExamMemoData>>>({
    url: POLICE_API + '/exam_select_memo/',
    params: {question: question_id},
    reload: reload,
  })

  const items = data?.results.map(memo => {
    return (
      <Collapse key={memo.id} icon='plus' defaultChecked>
        <CollapseTitle className='text-sm flex items-center'>
          <PiNoteBold className='inline mr-1'/>
          {memo.user_display}
          <span className='ml-2 text-xs opacity-50'>{memo.created_at}</span>
        </CollapseTitle>
        <CollapseContent>
          <div>
            <ArticleLink articleLink={memo.article_link}/>
          </div>
          <div>
            <FileLink fileLink={memo.file_link}/>
          </div>
          <div className='text-sm'>
            <RichTextShow jsonContent={memo.comment}/>
          </div>
          {/*<div className='flex justify-end mt-2'>*/}
          {/*  {memo.user === userInfo.id &&*/}
          {/*    <Button size='xs' color='error' style='outline'>刪除</Button>*/}
          {/*  }*/}
          {/*</div>*/}
        </CollapseContent>
      </Collapse>
    )
  })

  return (
    <ul>
      {items}
    </ul>
  )
}