import {SelectQuestionReadData} from "@/types/exam-types.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {showToast} from "@/func";
import {useAxios} from "@/hooks";
import {POLICE_API} from "@/lib/config.ts";
import QsCardForInput from "@/features/Select/for-user/Question/for-input/QsCardForInput.tsx";

/**
 * 用以顯示「選擇題卡片」的組件
 * 1. 從API讀取選擇題ID的清單（從Props取得）
 * 2. 將此清單逐API獲取題目內容
 * 3. 刷出對應卡片
 * @constructor
 */

type Props = {
  readonly questions: Array<number>,
  readonly setSelectAnswers: Dispatch<SetStateAction<Array<Array<number | null>>>>,
}

export default function QsListForInput({questions, setSelectAnswers}: Props) {

  const api = useAxios();
  const [selectData, setSelectData] = useState<Array<SelectQuestionReadData>>([]); //選擇題題目清單

  useEffect(() => {
    showToast(
      api<Array<SelectQuestionReadData>>({
        method: 'POST',
        url: POLICE_API + '/exam_select/questions/',
        data: {
          id_list: questions,
          is_read: true,
        }
      }), {label: '載入'}
    ).then(res => setSelectData(res.data))
  }, []);

  const items = selectData.map((q, index) => {
    return (
      <QsCardForInput key={q.id} q={q} index={index} setAnswers={setSelectAnswers}/>
    )
  })

  return (
    <ul className='list'>
      {items}
    </ul>
  )
}