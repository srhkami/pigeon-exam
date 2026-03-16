import {ExamSelectData} from "@/types/exam-types.ts";
import {Button} from "@/component";
import {useState} from "react";
import {FaArrowRight, FaCheckCircle} from "react-icons/fa";
import {showToast} from "@/func";
import {EXAM_API} from "@/lib/config.ts";
import {useAxios} from "@/hooks";
import QsCardForInput from "@/features/Select/for-user/Question/for-input/QsCardForInput.tsx";
import QsCardForView from "@/features/Select/for-user/Question/for-view/QsCardForView.tsx";

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
  const [q, setQ] = useState<ExamSelectData>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Array<Array<number | null>>>([[null],]);


  // 出題
  const onStart = () => {
    const cleanData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v != null && v !== '')
    );
    const newParams = new URLSearchParams(cleanData as any);
    showToast(
      api({
        method: 'GET',
        url: EXAM_API + '/select_questions/random_single/',
        params: newParams,
      }), {label: '載入', error: err => JSON.stringify(err.response?.data)}
    )
      .then(res => setQ(res.data))
      .finally(() => {
        setIsSubmitted(false);
        setAnswers([[null],]);
      })
  }

  // 提交
  const onSubmit = () => {
    setIsSubmitted(true);
  }


  if (!q) return (
    <div className='flex justify-end'>
      <Button color='success' className='mt-4' onClick={onStart}>開始出題<FaArrowRight/></Button>
    </div>
  )

  if (isSubmitted) {
    return (
      <div>
        <QsCardForView q={q} a={answers[0]} i={0}
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
      <QsCardForInput q={q} index={0} setAnswers={setAnswers}/>
      <div className='flex justify-end'>
        <Button color='success' onClick={onSubmit}>
          <FaCheckCircle/>
          提交
        </Button>
      </div>
    </>
  )
}