import {ReactNode} from "react";
import {ExamResultData} from "@/types/exam-types.ts";
import {PiExam} from "react-icons/pi";
import {Button} from "@/component";
import {MdOutlineOpenInNew} from "react-icons/md";
import {useNavigate} from "react-router";

type AppProps = {
  readonly data: Array<ExamResultData>,
}

/* 試卷的清單 */
export default function SelectResultManageList({data}: AppProps): ReactNode {

  const navi = useNavigate();

  const dataList = data.map(obj => {

    return (
      <li className="list-row hover:bg-base-200" key={obj.id}>
        <div className='flex items-center justify-center'>
          <PiExam className='w-5 h-5'/>
        </div>
        <div className="list-col-grow">
          <div className='textl-lg font-semibold'>
            {obj.title}
          </div>
          <div className="text-xs uppercase opacity-60 flex items-center">
            <span className='mr-1'>{obj.user_display}</span>
            <span>{Math.round(obj.right_count / obj.total_count * 100)}分</span>
          </div>
        </div>
        <Button style='ghost' shape='circle' onClick={() => navi('/select/manage/result/detail/' + obj.id)}>
          <MdOutlineOpenInNew className='text-xl'/>
        </Button>
      </li>
    )
  })

  return (
    <ul className="list mx-2">
      {dataList}
    </ul>
  )
}

