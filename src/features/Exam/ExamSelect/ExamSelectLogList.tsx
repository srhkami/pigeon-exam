import {ExamResultData} from "@/types/exam-types.ts";
import {RiNewspaperFill} from "react-icons/ri";
import {Button} from "@/component";
import {MdOutlineOpenInNew} from "react-icons/md";
import {useNavigate} from "react-router";

type Props = {
  readonly data: Array<ExamResultData>
}

export default function ExamSelectLogList({data}:Props){

  const navi = useNavigate();

  const items = data.map((obj) => {
    return (
      <li className="list-row hover:bg-base-200" key={obj.id}>
        <div className='flex items-center justify-center'>
          <RiNewspaperFill className='w-5 h-5'/>
        </div>
        <div className="list-col-grow">
          <div className='textl-lg font-semibold'>
            {obj.title}
          </div>
          <div className="text-xs uppercase opacity-60 flex items-center">
            <span className='ml-1'>{Math.round(obj.right_count / obj.total_count * 100)}分</span>
            <span className='ml-1'>{obj.created_at}</span>
          </div>
        </div>
        <Button style='ghost' shape='circle' onClick={() => navi('/exam/result/' + obj.id)}>
          <MdOutlineOpenInNew className='text-xl'/>
        </Button>
      </li>
    )
  })

  return(
        <ul className='list'>
        {items}
      </ul>
  )
}