import {Badge} from "@/component";

type Props = {
  readonly right_count: number,
  readonly total_count: number,
  readonly showNumber?: boolean,
  readonly showPercent?: boolean,
}

/**
 * 用來顯示題目的困難度
 * @param right_count 正確答題數
 * @param total_count 總答題數
 * @param showNumber 是否顯示數字 2/10
 * @param showPercent 是否顯示趴數 20%
 * @constructor
 */
export default function QuestionRating({
                                         right_count,
                                         total_count,
                                         showNumber = false,
                                         showPercent = false
                                       }: Props) {

  const n = Math.round(right_count / total_count * 100);

  let color: "neutral" | "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error" = 'neutral';
  let text: string = '？？';

  if (total_count >= 5) {
    if (n <= 40) {
      color = 'error'
      text = '極難'
    } else if (n <= 59) {
      color = 'warning'
      text = '困難'
    } else if (n <= 79) {
      color = 'secondary'
      text = '中等'
    } else if (n <= 89) {
      color = 'info'
      text = '簡單'
    } else if (n <= 100) {
      color = 'success'
      text = '送分'
    }
  }

  return (
    <div className='tooltip tooltip-top flex gap-1 items-center font-semibold' data-tip='透過答題紀錄統計難易度，以40/60/80/90%區分等級'>
      <Badge size='xs' color={color}>Lv.{text}</Badge>
      {(showPercent) && <span>{n}%</span>}
      {showNumber && <span>({right_count}/{total_count})</span>}
    </div>
  )
}