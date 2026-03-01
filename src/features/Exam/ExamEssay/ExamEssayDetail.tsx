import {ExamEssayData} from "@/types/exam-types.ts";
import {HtmlTitle, PageHeader} from "@/layout";
import ExamEssayCard from "@/features/Exam/ExamEssay/ExamEssayCard.tsx";
import {useState} from "react";
import {Button, Col, ModalTextEditor, Row} from "@/component";
import {JSONContent} from "@tiptap/react";
import {FaCheck, FaDoorClosed, FaDoorOpen} from "react-icons/fa";
import toast from "react-hot-toast";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";
import {useAuth, useAxios, useToastApi} from "@/hooks";
import {useParams} from "react-router";

export default function ExamEssayDetail() {

  const title = '申論題題目';
  const api = useAxios();
  const {id} = useParams();
  const {userInfo} = useAuth();
  const {data} = useToastApi<ExamEssayData>({url: `${POLICE_API}/exam_essay/${id}/`})

  const [showSample, setShowSample] = useState<boolean>(false);
  const [answer, setAnswer] = useState<JSONContent | null>(null);

  const onCheckSubmit = () => {
    if (!answer) {
      toast.error('答案請勿留空')
      return
    }
    toast((t) => (
      <div className='w-52'>
        <div className='font-semibold'>
          是否確定提交答案？答案提交後，會分享給其他同學參考，您亦可隨時刪除作答內容。
        </div>
        <Row className='flex justify-between mt-2'>
          <Col xs={5}>
            <Button size='sm' color='primary' shape='block' onClick={() => {
              toast.dismiss(t.id);
              onSubmit();
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

  const onSubmit = () => {
    showToast(
      api<ExamEssayData>({
        method: 'POST',
        url: POLICE_API + '/exam_essay_answer/create/',
        data: {
          user: userInfo.id,
          question: id,
          content: answer,
        },
      }),
      {
        label: '處理',
        success: '提交成功',
        error:
          err => JSON.stringify(err.response?.data)
      }
    )
      .then(() => {
        setAnswer(null);
        setShowSample(true)
      })
  }

  if (!data) {
    return null
  }

  return (
    <>
      <HtmlTitle title={title}/>
      <PageHeader title={title}/>
      <ExamEssayCard q={data} i={data.id - 1} config={{showDetail: true, showLinks: true, showSample: showSample}}/>
      <div className='label mt-4'>
        我的回答
      </div>
      <ModalTextEditor content={answer} setContent={setAnswer}/>
      <div className='flex mt-4'>
        {!showSample &&
          <Button size='sm' color='warning' onClick={() => setShowSample(true)}><FaDoorOpen/>參考別人答案</Button>
        }
        {showSample &&
          <Button size='sm' color='warning' onClick={() => setShowSample(false)}><FaDoorClosed/>我要靠自己！</Button>
        }
        <Button size='sm' color='primary' className='ml-auto' onClick={onCheckSubmit}><FaCheck/>提交我的答案</Button>
      </div>
    </>
  )
}