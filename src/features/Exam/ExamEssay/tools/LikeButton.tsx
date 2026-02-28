import {ExamEssayAnswerData} from "@/types/exam-types.ts";
import {useAxios} from "@/hooks";
import {useState} from "react";
import {POLICE_API} from "@/utils/config.ts";
import {Button} from "@/component";
import {BiLike, BiSolidLike} from "react-icons/bi";

type Props = {
  readonly obj: ExamEssayAnswerData
}

export default function LikeButton({obj}: Props) {
  const api = useAxios();
  const [isLiked, setIsLiked] = useState<boolean>(obj.is_liked);
  const [likesCount, setLikesCount] = useState<number>(obj.likes_count);

  const onLike = () => {
    api<{ is_liked: boolean, likes_count: number }>({
      method: 'POST',
      url: POLICE_API + `/exam_essay_answer/${obj.id}/like/`,
    }).then((res) => {
      setIsLiked(res.data.is_liked);
      setLikesCount(res.data.likes_count);
    })
  }

  return (
    <>
      <Button size='sm' style='ghost' shape='circle' className='ml-auto'
              onClick={onLike}>
        {isLiked ? <BiSolidLike className='text-primary text-xl'/> : <BiLike className='text-xl'/>}
      </Button>
      <span className='font-bold'>{likesCount}</span>
    </>
  )
}