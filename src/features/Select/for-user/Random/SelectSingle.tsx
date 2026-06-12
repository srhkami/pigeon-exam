import {SelectQuestionSimpleData, SelectRecordData} from "@/types/exam-types.ts";
import {Button} from "@/component";
import {useState} from "react";
import {FaArrowRight, FaCheckCircle} from "react-icons/fa";
import {getApiErrorMessage, showToast} from "@/func";
import {EXAM_API, EXAM_API_V2} from "@/lib/config.ts";
import {useAxios} from "@/hooks";
import QsCardForInput from "@/features/Select/for-user/Question/QsCardForInput.tsx";
import QsCardForRecord from "@/features/Select/for-user/Question/QsCardForRecord.tsx";

type Props = {
  readonly formData: {
    count: string,
    source?: Array<string>,
    category?: Array<string>,
    subject?: Array<string>,
  }
}

/**
 * 用來提供單次出題的
 * @param formData 向後端發出題目請求的表單
 * @constructor
 */
export default function SelectSingle({formData}: Props) {

  const api = useAxios();
  const [q, setQ] = useState<SelectQuestionSimpleData>();
  const [record, setRecord] = useState<SelectRecordData>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Array<Array<number | null>>>([[null],]);

  // 出題
  const onStart = () => {
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([, value]) => value != null && value !== '')
    ) as Record<string, string | Array<string>>;
    console.log('newParams', cleanData);
    showToast(
      api<SelectQuestionSimpleData>({
        method: 'GET',
        url: EXAM_API + '/select_questions/random_single/',
        params: cleanData,
      }), {label: '載入', error: err => getApiErrorMessage(err, '載入出題失敗，請稍後再試。')}
    )
      .then(res => setQ(res.data))
      .finally(() => {
        setIsSubmitted(false);
        setAnswers([[null],]);
        setRecord(undefined);
      })
  }

  // 提交
  const onSubmit = () => {
    setIsSubmitted(true);
    showToast(
      api<SelectRecordData>({
        method: 'POST',
        url: EXAM_API_V2 + '/select/submit/single',
        data: {
          question_id: q?.id,
          user_answer: answers[0],
        },
      }), {label: '提交', error: err => getApiErrorMessage(err, '提交失敗，請稍後再試。')}
    ).then(res => setRecord(res.data))

  }


  if (!q) return (
    <div className='flex justify-end'>
      <Button color='success' className='mt-4' onClick={onStart}>開始出題<FaArrowRight/></Button>
    </div>
  )

  if (isSubmitted && record) {
    return (
      <div>
        <QsCardForRecord
          record={record}
          i={0}
          config={{
            showOptions: true, // 顯示選項及來源
            showRating: true, // 顯示題目評級
            showLinks: true, // 顯示關聯
            showComment: true, // 顯示註解
          }}
        />
        <div className='flex justify-end'>
          <Button size='sm' color='primary' onClick={onStart}>
            出下一題<FaArrowRight/>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <QsCardForInput q={q} i={0} setAnswers={setAnswers}/>
      <div className='flex justify-end'>
        <Button color='success' onClick={onSubmit}>
          <FaCheckCircle/>
          提交
        </Button>
      </div>
    </>
  )
}
