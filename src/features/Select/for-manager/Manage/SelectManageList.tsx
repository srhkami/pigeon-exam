import {ReactNode} from "react";
import {ExamSelectCardConfig, ExamSelectData} from "@/types/exam-types.ts";
import SelectResultCard from "@/features/Select/for-manager/Result/SelectResultCard.tsx";

type Props = {
  readonly data: Array<ExamSelectData>,
  readonly onRefetch: ()=>void,
  readonly config?: ExamSelectCardConfig,
}

/* 網站回饋的清單 */
export default function SelectManageList({data, onRefetch, config}: Props): ReactNode {

  const dataList = data.map(obj => {

    return (
      <SelectResultCard key={obj.id} q={obj} a={[]} i={obj.id-1} config={config} onRefetch={onRefetch}/>
    )
  })

  return (
    <ul className="list mx-2">
      {dataList}
    </ul>
  )
}

