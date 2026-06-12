import {useAxios} from "@/hooks";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {PaperRecordData} from "@/types/exam-types.ts";
import {getApiErrorMessage, showToast} from "@/func";
import {EXAM_API} from "@/lib/config.ts";
import {DetailRow} from "@/component";
import PageHeader from "@/features/Layout/PageHeader.tsx";
import QsCardForRecord from "@/features/Select/for-user/Question/QsCardForRecord.tsx";
import {ErrorAlert} from "@/features";
import {ApiResData} from "@/types/api-types.ts";

export default function PaperRecord() {

  const api = useAxios();
  const {id} = useParams();
  const [data, setData] = useState<PaperRecordData>();
  const [loadError, setLoadError] = useState<string>();

  useEffect(() => {
    if (!id) {
      setLoadError('資料不存在或無權查看此資料。');
      return;
    }

    showToast(
      async () => {
        const res = await api<ApiResData<Array<PaperRecordData>>>({
          method: 'GET',
          url: EXAM_API + '/paper_records/self/',
          params: {id},
        })
        const record = res.data.results.find(item => String(item.id) === String(id));
        if (!record) {
          setLoadError('資料不存在或無權查看此資料。');
          return;
        }
        setData(record);
      }
      , {label: '載入', error: (err) => getApiErrorMessage(err, '讀取測驗紀錄失敗，請稍後再試。')}
    ).catch((err) => {
      setLoadError(getApiErrorMessage(err, '讀取測驗紀錄失敗，請稍後再試。'));
    })
  }, [api, id]);

  if (loadError) {
    return (
      <ErrorAlert option={{
        color: 'error',
        header: '無法讀取測驗紀錄',
        message: loadError,
      }}/>
    )
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <PageHeader title={data.title}/>
      <div className='mb-2 flex items-center'>
        <span className='text-6xl italic text-red-500'>{data.score}</span>
        <span className='ml-2 mt-auto text-2xl italic'>分</span>
      </div>
      <div>
        {/*<DetailRow*/}
        {/*  start='答對題數：'*/}
        {/*  center={<span>{data.right_count} / {data.total_count}</span>}/>*/}
        <DetailRow
          start='測驗時間：'
          center={data.created_at}/>
        <DetailRow
          start='類科：'
          center={data.category}/>
        <DetailRow
          start='科目：'
          center={data.subject}/>
      </div>
      <div className='divider'></div>
      <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
        選擇題（共{data.select_records.length}題）
      </div>
      <ul className='list'>
        {
          data.select_records.map((record, index) => {
            return (
              <QsCardForRecord
                key={record.id}
                record={record}
                i={index}
                config={{
                  showOptions: true,
                  showComment: false,
                  showLinks: true,
                  showRating: true
                }}
              />
            )
          })
        }
      </ul>
    </div>
  )
}
