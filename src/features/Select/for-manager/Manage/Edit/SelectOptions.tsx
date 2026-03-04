import {Col, Row} from "@/component";
import {Dispatch, SetStateAction} from "react";
import {useForm} from "react-hook-form";

type Props = {
  readonly options: Array<string>,
  readonly setOptions: Dispatch<SetStateAction<Array<string>>>,
  readonly answer: Array<number>,
  readonly setAnswer: Dispatch<SetStateAction<Array<number>>>,
}

type FormValues = {
  option0: string,
  option1: string,
  option2: string,
  option3: string,
  right_answer: number | string,
}

/* 用來編輯選擇題的選項及解答 */
export default function SelectOptions({options, setOptions, answer, setAnswer}: Props) {

  const {register, getValues} = useForm<FormValues>({
    defaultValues: {
      option0: options[0],
      option1: options[1],
      option2: options[2],
      option3: options[3],
    }
  });

  const onSubmit = () => {
    const formData = getValues();
    setOptions([formData.option0, formData.option1, formData.option2, formData.option3]);
    setAnswer([Number(formData.right_answer)]);
  }

  return (
    <Row className='px-1'>
      <Col xs={2} className='py-1 label text-sm'>
        正解*
      </Col>
      <Col xs={10} className='py-1 label text-sm flex justify-center'>
        選項*
      </Col>
      <Col xs={12} className='py-1 flex items-center'>
        <input type="radio" value={0} className="radio radio-sm radio-primary mr-2" defaultChecked={answer[0] === 0}
               {...register('right_answer', {onBlur:onSubmit})}/>
        <input className='input input-sm w-full'
               {...register('option0', {onBlur:onSubmit})}/>
      </Col>
      <Col xs={12} className='py-1 flex items-center'>
        <input type="radio" value={1} className="radio radio-sm radio-primary mr-2" defaultChecked={answer[0] === 1}
               {...register('right_answer', {onBlur:onSubmit})}/>
        <input className='input input-sm w-full'
               {...register('option1', {onBlur:onSubmit})}/>
      </Col>
      <Col xs={12} className='py-1 flex items-center'>
        <input type="radio" value={2} className="radio radio-sm radio-primary mr-2" defaultChecked={answer[0] === 2}
               {...register('right_answer', {onBlur:onSubmit})}/>
        <input className='input input-sm w-full'
               {...register('option2', {onBlur:onSubmit})}/>
      </Col>
      <Col xs={12} className='py-1 flex items-center'>
        <input type="radio" value={3} className="radio radio-sm radio-primary mr-2" defaultChecked={answer[0] === 3}
               {...register('right_answer', {onBlur:onSubmit})}/>
        <input className='input input-sm w-full'
               {...register('option3', {onBlur:onSubmit})}/>
      </Col>
    </Row>
  )
}