import {ExamSelectData} from "@/types/exam-types.ts";
import {Button} from "@/component";
import {useState} from "react";
import {FaArrowRight, FaCheckCircle} from "react-icons/fa";
import {showToast} from "@/utils/handleToast.ts";
import {POLICE_API} from "@/lib/config.ts";
import {useAxios} from "@/hooks";
import SelectResultCard from "@/features/Exam/Question/SelectResultCard.tsx";

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
        url: POLICE_API + '/exam_select/random_single/',
        params: newParams,
      }), {baseText: '載入', error: err => JSON.stringify(err.response?.data)}
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
      <Button color='success' className='mt-4' onClick={onStart}>出題<FaArrowRight/></Button>
    </div>
  )

  if (isSubmitted) {
    return (
      <div>
        <SelectResultCard q={q} a={answers[0]} i={0}
                          config={{
                            showOptions: true, // 顯示選項及來源
                            showRating: true, // 顯示題目評級
                            showLinks: true, // 顯示關聯
                            showComment: true, // 顯示註解
                          }}
        />
        <div className='flex justify-end'>
          <Button size='sm' color='primary' onClick={onStart}>
            下一題<FaArrowRight/>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <SelectResultCard q={q} i={0} setAnswers={setAnswers}
                        config={{
                          showOptions: true, // 顯示選項及來源
                          showRating: false, // 顯示題目評級
                          showLinks: false, // 顯示關聯
                          showComment: false, // 顯示註解
                        }}/>
      <div className='flex justify-end'>
        <Button size='sm' color='success' onClick={onSubmit}>
          <FaCheckCircle/>
          提交
        </Button>
      </div>
    </>
  )
}