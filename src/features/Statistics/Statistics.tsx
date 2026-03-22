import {useToastApi} from "@/hooks";
import {LogData} from "@/types/exam-types.ts";
import {EXAM_API_V2} from "@/lib/config.ts";
import {Button, Row} from "@/component";
import PageHeader from "@/features/Layout/PageHeader.tsx";
import {useNavigate} from "react-router";

export default function Statistics() {

  const navi = useNavigate();
  const title = '個人統計與分析';

  const data = useToastApi<LogData>({url: EXAM_API_V2 + '/get_self_log'})
  if (!data.data) return null;

  const select_log_list = data.data?.select_logs.map((item, index) => {

    const ratio = Math.round(item.correct_count / item.total_count * 100)
    const onNavi = (is_incorrect: boolean = false) => {
      if (index === 0) {
        if (is_incorrect) {
          navi('/select/records/1?ordering=-id&is_correct=false')
        } else {
          navi('/select/records/1?ordering=-id')
        }
      } else {
        if (is_incorrect) {
          navi('/select/records/1?ordering=-id&is_correct=false&question_subject=' + item.label)
        } else {
          navi('/select/records/1?ordering=-id&question_subject=' + item.label)
        }
      }
    }

    return (
      <>
        <input type="radio" name="my_tabs_2" className="tab" aria-label={item.label} defaultChecked={index === 0}/>
        <div className='tab-content'>
          <div className="stats shadow w-full ">
            <div className="stat">
              <div className="stat-title">共計作答</div>
              <div className="stat-value text-primary">
                {item.total_count}
                <span className='text-lg ml-1'>題</span>
              </div>
              <div className="stat-actions">
                <Button size='xs' style='outline' onClick={() => onNavi()}>查看紀錄</Button>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title">正確作答</div>
              <div className="stat-value text-success">
                {item.correct_count}
                <span className='text-lg ml-1'>題</span>
              </div>
              <div className="stat-actions">
                <Button size='xs' style='outline' color='error' onClick={() => onNavi(true)}>錯誤紀錄</Button>
              </div>
            </div>

            <div className="stat">
              <div className="stat-title"></div>
              <div className="radial-progress bg-info text-info-content border-info border-4" style={{"--value": ratio}}
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
      <PageHeader title='選擇題' as='h4' divider={false}/>
      <PageHeader title='作答紀錄統計' as='h5' divider={false}/>
      <div className="tabs tabs-border">
        {select_log_list}
      </div>
      <PageHeader title='易錯題統計' as='h5' divider={false}/>
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