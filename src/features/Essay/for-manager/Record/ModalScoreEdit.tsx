import {EssayRecordData} from "@/types/exam-types.ts";
import {Dispatch, SetStateAction} from "react";
import {Badge, Button, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle} from "@/component";
import {useAxios, useModal} from "@/hooks";
import {SubmitHandler, useForm} from "react-hook-form";
import {showToast} from "@/func";
import {EXAM_API} from "@/lib/config.ts";
import {IoSend} from "react-icons/io5";

type Props = {
  readonly record: EssayRecordData,
  readonly setReload: Dispatch<SetStateAction<boolean>>
}

type FormValues = {
  score: number,
  comment: string,
}

export default function ModalScoreEdit({record, setReload}: Props) {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal()
  const {register, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      score: record.score,
      comment: record.comment
    }
  })

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    showToast(
      async () => api({
        url: EXAM_API + '/essay_records/' + record.id + '/',
        method: 'PATCH',
        data: formData,
      }), {label: '處理', success: '儲存成功'}
    ).then(() => {
      setReload(p => !p);
      onHide();
    })
  }

  return (
    <>
      <Button style='outline' size='xs' onClick={onShow}>
        進行評分
        <Badge color='error' size='xs'>{record.score}</Badge>
      </Button>
      <Modal isShow={isShow} onHide={onHide} closeButton>
        <ModalHeader>
          <ModalTitle>為回答評分</ModalTitle>
        </ModalHeader>
        <ModalBody className='p-1'>
          <div>
            <label className='label'>
              分數（滿分25）：
              <input type='number' className='input input-sm'
                     {...register('score', {
                       required: true,
                       min: {value: 1, message: '不得小於1分'},
                       max: {value: 25, message: '不得超過25分'}
                     })}/>
            </label>
          </div>
          <div>
            <div className='label'>評語或建議</div>
            <textarea className='textarea w-full min-h-48' {...register('comment')}/>
          </div>
          <div className='text-xs italic opacity-70'>
            ※ 評語內容支援 MD 格式預覽，如何編寫請參考<a href='https://zh.wikipedia.org/zh-tw/Markdown'
                                                        className='link'>維基百科</a>中範例部分。
          </div>
        </ModalBody>
        <ModalFooter>
          <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}><IoSend/>送出</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}