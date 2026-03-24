import {useAxios, useToastApi} from "@/hooks";
import {EXAM_API_V2} from "@/lib/config.ts";
import {TrendData} from "@/types/exam-types.ts";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Button, Loading} from "@/component";
import {useQuery} from "@tanstack/react-query";
import PageHeader from "../Layout/PageHeader.tsx";
import {useNavigate} from "react-router";

type Props = {
  readonly subject: string | null,
  readonly defaultChecked?: boolean,
}

export default function Stats({subject, defaultChecked= false}: Props) {

  const api = useAxios();
  const navi = useNavigate();
  const label = subject ?? '全部科目'

  // 請求資料的函數
  const fetchData: () => Promise<TrendData> = async () => {
    const res = await api<TrendData>({
      method: 'GET',
      url: EXAM_API_V2 + '/trend',
      params: {subject: subject}
    })
    return res.data;
  }

  // 使用useQuery
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    // 當這些變數改變時，自動重新觸發請求
    queryKey: ['trend', subject],
    // 請求的函數
    queryFn: fetchData,
    // 換頁時保留舊資料，直到新資料載入完成 (避免畫面閃爍)
    // placeholderData: keepPreviousData,
    // 結構共享，自動比對新舊資料
    structuralSharing: true,
    retry: 1,
  })

  if (!data) {
    return <Loading style='bars'/>
  }

  const ratio = Math.round(data.correct_count / data.total_count * 100)
  const onNavi = () => {
    if (subject) {
      navi('/select/records/1?ordering=-id&question__subject=' + subject)
    } else {
      navi('/select/records/1?ordering=-id')
    }
  }


  return (
    <>
      <input type="radio" name="my_tabs_2" className="tab" aria-label={label} defaultChecked={defaultChecked}/>
      <div className='tab-content card card-border border-base-300 mt-2 p-4'>
        <PageHeader title='作答統計' as='h5' divider={false} className='mt-3'/>
        {/*<Button onClick={()=>refetch()}>按扭</Button>*/}
        <div className="stats shadow w-full ">
          <div className="stat place-items-center">
            <div className="stat-title">共計作答</div>
            <div className="stat-value text-primary">
              {data.total_count}
              <span className='text-lg ml-1'>題</span>
            </div>
            <div className="stat-actions">
              {/*<Button size='xs' style='outline' onClick={() => onNavi()}>查看紀錄</Button>*/}
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title">正確作答</div>
            <div className="stat-value text-success">
              {data.correct_count}
              <span className='text-lg ml-1'>題</span>
            </div>
            <div className="stat-actions">
              {/*<Button size='xs' style='outline' color='error' onClick={() => onNavi(true)}>錯誤紀錄</Button>*/}
            </div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title"></div>
            <div className="radial-progress bg-info text-info-content border-info border-4" style={{"--value": ratio}}
                 aria-valuenow={ratio} role="progressbar">{ratio}%
            </div>
          </div>
        </div>
        <div className='flex justify-end'>
          <Button style='outline' size='sm' onClick={onNavi}>查看作答紀錄</Button>
        </div>
        <PageHeader title='近90日正確率' as='h5' divider={false} className='mt-4'/>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.stats} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="period"/>
            <YAxis dataKey="correct_rate" domain={[0, 100]}/>
            <Tooltip/>
            <Legend/>
            <Line type="monotone" dataKey="correct_rate" stroke="#8884d8" strokeWidth={2} label name='正確率(%)'/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}