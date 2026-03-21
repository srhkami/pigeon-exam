import {useToastApi} from "@/hooks";
import {LogData} from "@/types/exam-types.ts";
import {EXAM_API_V2} from "@/lib/config.ts";
import {Row} from "@/component";
import PageHeader from "@/features/Layout/PageHeader.tsx";

export default function Statistics() {

  const title = '個人統計與分析';

  const data = useToastApi<LogData>({url: EXAM_API_V2 + '/get_self_log'})
  if (!data.data) return null;

  const select_log_list = data.data?.select_logs.map((item, index) => {
    const ratio = Math.round(item.correct_count / item.total_count * 100)

    return (
      <>
        <input type="radio" name="my_tabs_2" className="tab" aria-label={item.label} defaultChecked={index === 0}/>
        {/*<div>*/}
        {/*  */}
        {/*</div>*/}
        {/*<div className='flex justify-between'>*/}
        {/*  {item.label}*/}
        {/*  <Button style='outline' size='sm' onClick={()=>navi('/select/records/1?ordering=-id')}>*/}
        {/*    查看紀錄*/}
        {/*  </Button>*/}
        {/*</div>*/}
        <div className='tab-content'>
          <div className="stats shadow w-full ">
            <div className="stat place-items-center">
              <div className="stat-title">共計作答</div>
              <div className="stat-value text-success">
                {item.total_count}
                <span className='text-lg ml-1'>題</span>
              </div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title">正確作答</div>
              <div className="stat-value text-success">
                {item.correct_count}
                <span className='text-lg ml-1'>題</span>
              </div>
            </div>

            <div className="stat place-items-center">
              <div className="stat-title"></div>
              <div className="radial-progress" style={{"--value": ratio}}
                   aria-valuenow={ratio} role="progressbar">{ratio}%
              </div>
            </div>

          </div>
        </div>
        </>
    )
  })


  return (
    <div>
      <PageHeader title={title}/>
      <PageHeader title='選擇題' as='h3' divider={false}/>
      <div className="tabs tabs-border">
        {select_log_list}
      </div>
      <Row>

        {/*<Col xs={12} md={6} className='p-2'>*/}
        {/*  <div className="stats shadow w-full">*/}
        {/*    <div className="stat place-items-center">*/}
        {/*      <div className="stat-title">已完成測驗</div>*/}
        {/*      <div className="stat-value text-success">*/}
        {/*        {log.data?.paper_count}*/}
        {/*        <span className='text-lg ml-1'>次</span>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*    <div className="stat place-items-center">*/}
        {/*      <div className="stat-title">平均正確率</div>*/}
        {/*      <div className="stat-value text-error">*/}
        {/*        {log.data && Math.round(log.data?.right_count / log.data?.total_count * 100)}*/}
        {/*        <span className='text-lg ml-1'>%</span>*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</Col>*/}
        {/*<Col xs={12} md={6} className='p-2'>*/}
        {/*  <div className="stats shadow w-full">*/}
        {/*    <div className="stat place-items-center">*/}
        {/*      <div className="stat-title">正確答題</div>*/}
        {/*      <div className="stat-value">{log.data?.right_count}*/}
        {/*        <span className='text-lg ml-1'>題</span></div>*/}
        {/*    </div>*/}
        {/*    <div className="stat place-items-center">*/}
        {/*      <div className="stat-title">答題總數</div>*/}
        {/*      <div className="stat-value">{log.data?.total_count}*/}
        {/*        <span className='text-lg ml-1'>題</span></div>*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</Col>*/}
      </Row>
      <div className='text-sm italic text-secondary mt-2 text-center'>
        詳細分析功能開發中，敬請期待......
      </div>
    </div>
  )
}