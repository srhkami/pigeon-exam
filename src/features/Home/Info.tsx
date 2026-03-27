import {useCacheApi} from "@/hooks";
import {EXAM_API_V2} from "@/lib/config.ts";

type ExamInfo = {
  select_count: number,
  select_record_count: number,
  essay_count: number
  essay_record_count: number
}

export default function Info() {

  const {data} = useCacheApi<ExamInfo>({url: EXAM_API_V2 + "/user_info"});

  return (
    <div className="stats shadow-lg bg-base-100 w-full mb-3">
      <div className="stat place-items-center">
        <div className="stat-title">蒐錄選擇題</div>
        <div className="stat-value text-primary">
          {data?.select_count}
          <span className='text-lg ml-1'>題</span>
        </div>
        <div className="stat-desc text-success">累積作答 {data?.select_record_count} 題</div>
      </div>
      <div className="stat place-items-center">
        <div className="stat-title">蒐錄申論題</div>
        <div className="stat-value text-primary">
          {data?.essay_count}
          <span className='text-lg ml-1'>題</span>
        </div>
        <div className="stat-desc text-success">累積作答 {data?.essay_record_count} 題</div>
      </div>
    </div>
  )
}