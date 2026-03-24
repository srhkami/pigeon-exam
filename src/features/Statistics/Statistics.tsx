import {Row} from "@/component";
import PageHeader from "@/features/Layout/PageHeader.tsx";
import Stats from "@/features/Statistics/Stats.tsx";


const subjects = [null, '警察法規', '警察勤務', '情境實務', '犯罪偵查']

export default function Statistics() {

  const title = '個人統計與分析';

  const select_log_list = subjects.map((subject, index) => {
    return <Stats key={subject} subject={subject} defaultChecked={index === 0}/>
  })


  return (
    <div>
      <PageHeader title={title}/>
      <PageHeader title='選擇題' as='h4' divider={false}/>
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