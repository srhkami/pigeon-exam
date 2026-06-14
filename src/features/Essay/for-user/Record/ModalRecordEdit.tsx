import {EssayQuestionSimpleData, EssayRecordSimpleData} from "@/types/exam-types.ts";
import {Dispatch, SetStateAction} from "react";
import {useAxios, useModal} from "@/hooks";
import {Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Row} from "@/component";
import {SubmitHandler, useForm} from "react-hook-form";
import {getApiErrorMessage, showToast} from "@/func";
import {EXAM_API} from "@/lib/config.ts";
import {RiEdit2Fill} from "react-icons/ri";
import {FaSave, FaTrash} from "react-icons/fa";
import toast from "react-hot-toast";

type Props = {
  readonly record?: EssayRecordSimpleData,
  readonly q: EssayQuestionSimpleData,
  readonly setReload: Dispatch<SetStateAction<boolean>>
}
type FormValues = {
  is_public: boolean,
  is_anonymous: boolean,
  content: string,
}

export default function ModalRecordEdit({record, q, setReload}: Props) {

  const api = useAxios();
  const {isShow, onShow, onHide} = useModal();
  const {register, handleSubmit} = useForm<FormValues>({
    defaultValues: {
      is_public: record?.is_public ?? true,
      is_anonymous: record?.is_anonymous ?? false,
      content: record?.content ?? '',
    }
  });

  const onSubmit: SubmitHandler<FormValues> = (formData) => {
    if (record) {
      showToast(
        api({
          method: 'PATCH',
          url: EXAM_API + '/essay_records/' + record.id + '/',
          data: formData
        }), {label: '儲存', success: '儲存成功', error: err => getApiErrorMessage(err, '儲存失敗，請稍後再試。')}
      )
        .then(() => {
          setReload(p => !p);
          onHide()
        })
    } else {
      showToast(
        api({
          method: 'POST',
          url: EXAM_API + '/essay_records/create/',
          data: {
            ...formData,
            question_id: q.id,
          }
        }), {label: '儲存', success: '儲存成功', error: err => getApiErrorMessage(err, '儲存失敗，請稍後再試。')}
      )
        .then(() => {
          setReload(p => !p);
          onHide()
        })
    }
  }

  const onCheckDelete = () => {
    toast((t) => (
      <div className='w-52'>
        <div className='font-semibold'>
          是否確定刪除這筆作答？此操作無法復原。
        </div>
        <Row className='flex justify-between mt-2'>
          <Col xs={5}>
            <Button size='sm' color='error' shape='block' onClick={() => {
              toast.dismiss(t.id);
              onDelete();
            }}>
              確定提交
            </Button>
          </Col>
          <Col xs={5}>
            <Button size='sm' color='neutral' style='outline' shape='block'
                    onClick={() => toast.dismiss(t.id)}>
              取消
            </Button>
          </Col>
        </Row>
      </div>
    ))
  }

  const onDelete = () => {
      showToast(
        api({
          method: 'DELETE',
          url: EXAM_API + '/essay_records/' + record?.id + '/',
      }), {label: '處理', success: '刪除成功', error: err => getApiErrorMessage(err, '刪除失敗，請稍後再試。')}
    ).then(() => {
      setReload(p => !p);
      onHide();
    })
  }

  return (
    <>
      {
        record ?
          <Button size='xs' style='ghost' onClick={onShow}><RiEdit2Fill/>編輯</Button>
          :
          <Button size='sm' color='primary' onClick={onShow}><RiEdit2Fill/>新增一筆回答</Button>
      }
      <Modal isShow={isShow} onHide={onHide} size='xl' closeButton backdrop={false}>
        <ModalHeader>
          <ModalTitle>{record ? '編輯申論題回答' : '新增申論題回答'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className='my-2'>
            {q?.question}
          </div>
          <div className='p-1'>
            <textarea className='textarea w-full min-h-80' placeholder='請輸入回答內容' {...register('content')}/>
          </div>
          <div className='text-xs italic opacity-70'>
            ※ 回答內容支援 MD 格式預覽，如何編寫請參考<a href='https://zh.wikipedia.org/zh-tw/Markdown'
                                                        className='link'>維基百科</a>中範例部分。
          </div>
        </ModalBody>
        <ModalFooter>
          <Row className='w-full'>
            <Col xs={12} md={6} className='flex gap-1'>
              <label className='label'>
                <input type='checkbox' className='toggle toggle-sm' {...register('is_public')}/>
                公開分享
              </label>
              <label className='label'>
                <input type='checkbox' className='toggle toggle-sm' {...register('is_anonymous')}/>
                匿名發表
              </label>
            </Col>
            <Col xs={12} md={6} className='flex justify-end gap-1'>
              {record &&
                <Button size='sm' style='outline' color='error' onClick={onCheckDelete}><FaTrash/>刪除</Button>
              }
              <Button size='sm' color='success' onClick={handleSubmit(onSubmit)}><FaSave/>儲存</Button>
            </Col>
          </Row>
        </ModalFooter>
      </Modal>
    </>
  )
}
