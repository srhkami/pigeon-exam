import {Button, Col, DetailRow, Row} from "@/component";
import {useNavigate, useParams} from "react-router";
import {useAxios, useToastApi} from "@/hooks";
import {useState} from "react";
import {PaperData} from "@/types/exam-types.ts";
import {MdDelete, MdOutlineContentCopy, MdOutlinePublishedWithChanges} from "react-icons/md";
import {FaEdit} from "react-icons/fa";
import toast from "react-hot-toast";
import {EXAM_API} from "@/lib/config.ts";
import {copyText, showToast} from "@/func";
import ModalQuestionToText from "@/features/Paper/for-manager/Manage/ModalQuestionToText.tsx";
import QsCardForView from "@/features/Select/for-manager/Question/QsCardForView.tsx";

export default function PaperDetail() {

  const api = useAxios();
  const navi = useNavigate();
  const {id} = useParams();

  const [reload, setReload] = useState<boolean>(false);
  const {data} = useToastApi<PaperData>({url: EXAM_API + '/papers/' + id + '/', reload: reload});

  if (!data) return null;

  // 確認刪除
  const onCheckDelete = () => {
    toast((t) => (
      <div className='w-52'>
        <div className='font-semibold'>
          是否確定刪除？此操作無法復原。
        </div>
        <Row className='flex justify-between mt-2'>
          <Col xs={5}>
            <Button size='sm' color='error' shape='block' onClick={() => {
              toast.dismiss(t.id);
              onDelete();
            }}>
              確定刪除
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
    ));
  }

  //  刪除
  const onDelete = () => {
    showToast(
      api({
        method: 'DELETE',
        url: EXAM_API + '/papers/' + id + '/',
      }), {label: '處理', success: '刪除成功'}
    ).then(() => navi('/exam/paper/1?ordering=-id'))
  }

  // 切換開放狀態
  const onPublic = () => {
    showToast(
      api({
        method: 'PATCH',
        url: EXAM_API + '/papers/' + id + '/',
        data: {
          is_public: !data.is_public,
        }
      }), {label: '處理', success: '變更成功'}
    ).then(() => setReload(p => !p))
  }

  return (
    <>
      <div className='text-3xl font-bold mb-3 border-l-4 border-l-primary pl-4'>
        試卷內容
      </div>
      <div className='divider'></div>
      <div className='my-2 flex gap-1'>
        <Button size='sm' color='success' onClick={() => navi('/manage/paper/edit/' + id)}>
          <FaEdit/>編輯試卷
        </Button>
        <Button size='sm' style='outline'
                onClick={() => copyText('https://exam.pigeonhand.tw/paper/' + data.uuid)}>
          <MdOutlineContentCopy/>複製網址
        </Button>
        <ModalQuestionToText paper={data}/>
        <Button size='sm' color='error' className='ml-auto' onClick={onCheckDelete}>
          <MdDelete/>刪除試卷
        </Button>
      </div>
      <ul>
        <DetailRow
          start='標題：'
          center={data.title}
        />
        <DetailRow
          start='建立者：'
          center={data.user_display}
        />
        <DetailRow
          start='建立時間：'
          center={data.created_at}
        />
        <DetailRow
          start='開放作答：'
          center={data.is_public ? '開放中' : '關閉中'}
          end={<Button style='outline' shape='circle' size='sm' onClick={onPublic}>
            <MdOutlinePublishedWithChanges/>
          </Button>}
        />
        <DetailRow
          start='考試類科：'
          center={data.category}
        />
        <DetailRow
          start='考試科目：'
          center={data.subject}
        />
        <div className='divider'></div>
        <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
          選擇題預覽
        </div>
        <ul className='list'>
          {
            data.select_questions.map((q, i) => {
              return (
                <QsCardForView
                  key={q.id}
                  q={q}
                  a={q.answer}
                  i={i}
                  config={{
                    showOptions: true,
                    showRating:true,
                    showLinks:false,
                    showComment:false,
                  }}
                />
              )
            })
          }
        </ul>
      </ul>
    </>
  )
}