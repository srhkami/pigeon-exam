import {ExamPastData} from "@/types/exam-types.ts";
import {RiEdit2Fill, RiNewspaperFill} from "react-icons/ri";
import {useNavigate, useSearchParams} from "react-router";
import {Button} from "@/component";
import {useAxios} from "@/hooks";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";

type Props = {
  readonly data: Array<ExamPastData>  | null,
}

/* 試卷的清單 */
export default function ExamSelectPastList({data}: Props) {

  const api = useAxios();
  const navi = useNavigate();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries(searchParams);   // 解析params，轉換為物件
  const keyword = params?.search;

  const dataList = data?.map(obj => {

    const title = `${obj.year}年_${obj.source}_${obj.category}_${obj.subject}`

    const onExamStart = () => {
      showToast(
        api<string>({
          method: 'POST',
          url: POLICE_API + '/exam/past_exam_paper/',
          data: {
            year: obj.year,
            source: obj.source,
            category: obj.category,
            subject: obj.subject,
          }
        }), {label: '載入', error: err => JSON.stringify(err.response?.data)}
      ).then(res => navi('/exam/paper/' + res.data))
    }

    if (keyword && !title.includes(keyword)) {
      // 如果有關鍵字，且關鍵字不在標題之中
      return null
    }

    return (
      <li className="list-row hover:bg-base-200" key={title}>
        <div className="list-col-grow">
          <div className='textl-lg font-semibold '>
            <RiNewspaperFill className='inline mr-1'/>
            {title}
          </div>
          <div className="flex items-center justify-end">
            {/*<Button size='xs' style='outline' onClick={onWatch}><FaThList/>檢視題目</Button>*/}
            <Button size='xs' color='primary' style='outline' onClick={onExamStart}><RiEdit2Fill/>檢視及作答</Button>
          </div>
        </div>
      </li>
    )
  })

  return (
    <ul className="list mx-2">
      {dataList}
    </ul>
  )
}

