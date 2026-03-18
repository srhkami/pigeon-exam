import {useAxios} from "@/hooks";
import {useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {PaperRecordData} from "@/types/exam-types.ts";
import {Button, DetailRow} from "@/component";
import {FaSearch} from "react-icons/fa";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";
import {PageHeader} from "@/features";
import QsCardForView from "@/features/Select/for-user/Question/for-view/QsCardForView.tsx";

export default function PaperRecordDetail() {

  const api = useAxios();
  const navi = useNavigate();
  const {id} = useParams();
  const [data, setData] = useState<PaperRecordData>();

  useEffect(() => {
    showToast(
      async () => {
        const res = await api<PaperRecordData>({
          method: 'GET',
          url: POLICE_API + '/paper_records/' + id + '/',
        })
        setData(res.data);
      }
      , {label: '載入', error: (err) => err.response.data.detail}
    ).catch(() => navi('/'))
  }, []);

  // const onSaveAsPaper = () => {
  //   showToast(
  //     api<{ id: number }>({
  //       method: 'POST',
  //       url: POLICE_API + '/exam_result/sava_as_paper/',
  //       data: {result_id: id},
  //     })
  //   ).then(res => navi('/exam/paper/detail/' + res.data.id))
  // }

  if (!data) return null;

  return (
    <div>
      <PageHeader title={data.title}/>
      {/*<div className='my-2 flex justify-end'>*/}
      {/*  <Button size='sm' style='outline' onClick={onSaveAsPaper}>*/}
      {/*    <FaSave/>將結果存成新試卷*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <div className='mb-2 flex items-center'>
        <span className='text-6xl italic text-red-500'>{data.score}</span>
        <span className='ml-2 mt-auto text-2xl italic'>分</span>
      </div>
      <div>
        <DetailRow
          start='答題者：'
          center={data.user_display}
          end={
            <Button size='xs' style='outline'
                    onClick={() => navi('/exam/result/1?ordering=-id&user_id=' + data.user)}>
              <FaSearch/>其他結果
            </Button>
          }/>
        {/*<DetailRow*/}
        {/*  start='答對題數：'*/}
        {/*  center={<span>{data.right_count} / {data.total_count}</span>}/>*/}
        <DetailRow
          start='測驗時間：'
          center={data.created_at}/>
        <DetailRow
          start='測驗類科：'
          center={data.category}/>
        <DetailRow
          start='測驗科目：'
          center={data.subject}/>
      </div>
      <div className='divider'></div>
      <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
        選擇題（共{data.select_records.length}題）
      </div>
      <ul className='list'>
        {
          data.select_records.map((item, index) => {
            return (
              <QsCardForView
                key={item.id}
                i={index}
                q={item.question}
                a={item.answer}
                config={{
                  showOptions: true,
                  showComment: false,
                  showLinks: false,
                  showRating: false
                }}
              />
            )
          })
        }
      </ul>
    </div>
  )
}