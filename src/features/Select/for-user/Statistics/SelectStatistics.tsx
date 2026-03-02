import {useToastApi} from "@/hooks";
import {ExamLogData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {Col, Row} from "@/component";
import PageHeader from "@/layout/PageHeader.tsx";

export default function SelectStatistics() {

  const title = '選擇題統計與分析';

  const log = useToastApi<ExamLogData>({url: POLICE_API + '/exam/get_self_log/'})

  return (
    <div>
      <PageHeader title={title}/>
      <Row>
        <Col xs={12} md={6} className='p-1'>
          <div className="stats shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">已完成測驗</div>
              <div className="stat-value text-success">
                {log.data?.paper_count}
                <span className='text-lg ml-1'>次</span>
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">平均正確率</div>
              <div className="stat-value text-error">
                {log.data && Math.round(log.data?.right_count / log.data?.total_count * 100)}
                <span className='text-lg ml-1'>%</span>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={12} md={6} className='p-1'>
          <div className="stats shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-title">正確答題</div>
              <div className="stat-value">{log.data?.right_count}
                <span className='text-lg ml-1'>題</span></div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">答題總數</div>
              <div className="stat-value">{log.data?.total_count}
                <span className='text-lg ml-1'>題</span></div>
            </div>
          </div>
        </Col>
      </Row>
      <div className='text-sm italic text-secondary mt-2 text-center'>
        詳細分析功能開發中，敬請期待......
      </div>
    </div>
  )
}