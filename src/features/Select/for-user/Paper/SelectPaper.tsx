import {useNavigate, useParams} from "react-router";
import {useAxios} from "@/hooks";
import {useEffect, useState} from "react";
import {ExamPaperData} from "@/types/exam-types.ts";
import {showToast} from "@/func";
import {POLICE_API} from "@/lib/config.ts";
import {PageHeader} from "@/features";
import {Alert, Button, Col, DetailRow, Row} from "@/component";
import {IoWarningOutline} from "react-icons/io5";
import toast from "react-hot-toast";
import {FaCheck} from "react-icons/fa";
import Questions from "@/features/Select/for-user/Question/Questions.tsx";

/**
 * 試卷
 * @constructor
 */
export default function SelectPaper() {

  const api = useAxios();
  const navi = useNavigate();
  const {uuid} = useParams();

  const [data, setData] = useState<ExamPaperData>();
  const [selectAnswers, setSelectAnswers] = useState<Array<Array<number | null>>>([]);

  useEffect(() => {
    showToast(
      async () => {
        const res = await api<ExamPaperData>({
          method: "GET",
          url: POLICE_API + '/exam_paper/uuid/',
          params: {uuid: uuid},
        })
        setData(res.data)
        const questions = res.data.questions; // 取出題目清單
        setSelectAnswers(new Array(questions.select?.length).fill([null])) // 產生答案空清單
      }, {label: '載入', error: err => err.response.data.detail}
    ).catch(() => navi('/exam'))
  }, []);

  if (!data) {
    return null;
  }

  if (!data.is_public) {
    return (
      <Alert>
        <IoWarningOutline className='text-3xl'/>
        <div>
          <div className="text-xl font-bold">
            本試卷未開放
          </div>
          <div className='text-sm'>
            此份試卷目前已關閉作答，如有需求請恰老師。
          </div>
        </div>
      </Alert>
    )
  }

  // 確認提交
  const onCheck = () => {
    const nullIndex = selectAnswers.findIndex(i => i[0] === null)
    if (nullIndex !== -1) {
      toast.error(`第${nullIndex + 1}題尚未作答！`)
      return
    }
    toast((t) => (
      <div className='w-52'>
        <div className='font-semibold'>
          是否確定提交試卷？
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
    ));
  }

  // 提交
  const onSubmit = () => {
    showToast(
      api({
        method: "POST",
        url: POLICE_API + '/exam_paper/submit/',
        data: {
          paper_id: data.id,
          title: data.title,
          subject: data.subject,
          category: data.category,
          questions: data.questions,
          answers: {select: selectAnswers, input: []}
        }
      }), {error: err => JSON.stringify(err.response.data)}
    )
      .then(res => navi('/exam/result/' + res.data.id))
  }

  return (
    <div>
      <PageHeader title={data.title}/>
      <div>
        <DetailRow
          start='建立者：'
          center={data.user_display}
        />
        <DetailRow
          start='類科：'
          center={data.category}
        />
        <DetailRow
          start='科目：'
          center={data.subject}
        />
      </div>
      <div className='divider'></div>
      <div className='border-l-4 border-l-primary pl-4 text-lg font-bold mb-2'>
        選擇題（共{data.questions.select?.length}題）
      </div>
      <Questions questions={data.questions} setSelectAnswers={setSelectAnswers}/>
      <div className='flex justify-end'>
        <Button color='primary' onClick={onCheck}>
          <FaCheck/>交卷
        </Button>
      </div>
    </div>
  )
}