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
      <div className='text-sm italic text-secondary mt-2 text-center'>
        更多分析功能開發中，敬請期待......
      </div>
    </div>
  )
}