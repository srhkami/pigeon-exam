import {ExamEssayAnswerData} from "@/types/exam-types.ts";
import {FaEdit, FaRegStickyNote, FaSave, FaTrash} from "react-icons/fa";
import {Badge, Button, Col, ModalTextEditor, RichTextShow, Row} from "@/component";
import {RiEdit2Fill} from "react-icons/ri";
import {useNavigate} from "react-router";
import {Dispatch, SetStateAction, useState} from "react";
import {JSONContent} from "@tiptap/react";
import {showToast} from "@/utils/handleToast.ts";
import {useAxios} from "@/hooks";
import {POLICE_API} from "@/lib/config.ts";
import toast from "react-hot-toast";
import {BiSolidLike} from "react-icons/bi";

type Props = {
  readonly obj: ExamEssayAnswerData,
  readonly setReload: Dispatch<SetStateAction<boolean>>
}

/**
 * 顯示申論題答案的卡片
 * @param obj 答案的物件
 * @param setReload 重新整理的函數
 * @constructor
 */
export default function ExamEssaySelfAnswerCard({obj, setReload}: Props) {

  const api = useAxios();
  const navi = useNavigate();
  const [content, setContent] = useState<JSONContent | null>(obj.content);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSave = () => {
    if (content === obj.content) {
      toast.error('內容未修改')
      return
    }
    if (!content) {
      toast.error('如果不填寫答案，請直接刪除此筆作答')
      return
    }
    showToast(
      api({
        method: 'PATCH',
        url: POLICE_API + '/exam_essay_answer/' + obj.id + '/',
        data: {
          content: content,
        }
      }), {baseText: '處理', success: '更新成功', error: err => JSON.stringify(err.response.data)}
    )
      .then(() => setReload(p => !p))
      .finally(() => setIsEdit(false))
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
        url: POLICE_API + '/exam_essay_answer/' + obj.id + '/',
      }), {baseText: '處理', success: '更新成功', error: err => JSON.stringify(err.response.data)}
    ).then(() => setReload(p => !p))
  }

  return (
    <div className='hover:bg-base-200 card card-border border-base-300 my-1 relative'>
      <div className='p-5'>
        <div className='font-bold'>
          <span>{obj.question_display}</span>
        </div>
        <div className='flex justify-end'>
          <Button size='xs' color='primary' style='outline' className='ml-auto'
                  onClick={() => navi('/exam/essay/detail/' + obj.question)}>
            <RiEdit2Fill/>檢視題目
          </Button>
        </div>
        <div className='mt-1'>
          <div className='divider m-0'></div>
          <div className='flex items-center mb-2'>
            <Badge color='info'><FaRegStickyNote/>我的回答</Badge>
            <BiSolidLike className='mx-1'/>{obj.likes_count}
            {!isEdit &&
              <Button size='xs' color='neutral' style='outline' className='ml-auto' onClick={() => setIsEdit(true)}>
                <FaEdit/> 編輯模式
              </Button>
            }
          </div>
          {
            isEdit ?
              <div>
                <ModalTextEditor content={content} setContent={setContent}/>
                <div className='flex justify-between items-center mt-2'>
                  <Button size='sm' color='error' style='outline' onClick={onCheckDelete}>
                    <FaTrash/> 刪除此筆
                  </Button>
                  <Button size='sm' color='primary' onClick={onSave}><FaSave/>儲存答案</Button>
                </div>
              </div>
              :
              <RichTextShow jsonContent={content}/>
          }
        </div>
      </div>
    </div>
  )
}