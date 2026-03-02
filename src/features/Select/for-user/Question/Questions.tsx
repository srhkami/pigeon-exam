import {AnswerData, ExamSelectData, QuestionsData} from "@/types/exam-types.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {showToast} from "@/func";
import {useAxios} from "@/hooks";
import {POLICE_API} from "@/lib/config.ts";
import SelectResultCard from "@/features/Select/for-user/Result/SelectResultCard.tsx";

/**
 * 用以顯示「選擇題卡片」的組件
 * 1. 從API讀取選擇題ID的清單（從Props取得）
 * 2. 將此清單逐API獲取題目內容
 * 3. 刷出對應卡片
 * @constructor
 */

type Props = {
  readonly questions: QuestionsData,
  readonly answers?: AnswerData,
  readonly setSelectAnswers?: Dispatch<SetStateAction<Array<Array<number | null>>>>,
}

export default function Questions({questions, answers, setSelectAnswers}: Props) {

  const api = useAxios();
  const [selectData, setSelectData] = useState<Array<ExamSelectData>>([]); //選擇題題目清單

  useEffect(() => {
    showToast(
      api({
        method: 'POST',
        url: POLICE_API + '/exam_select/questions/',
        data: {
          id_list: questions.select ?? [],
          is_read: answers === undefined,
        }
      }), {label: '載入'}
    ).then(res => setSelectData(res.data))
  }, []);

  const items = selectData.map((q, index) => {

    if (answers === undefined) {
      return (
        <SelectResultCard key={q.id} q={q} i={index} setAnswers={setSelectAnswers}
                          config={{showOptions: true, showRating: false, showComment: false, showLinks: false}}/>
      )
    }

    return (
    <SelectResultCard key={q.id} q={q} a={answers.select[index]} i={index}
                      config={{showOptions: true, showRating: true, showComment: true, showLinks: true}}/>
    )
  })

  return (
    <ul className='list'>
      {items}
    </ul>
  )
}