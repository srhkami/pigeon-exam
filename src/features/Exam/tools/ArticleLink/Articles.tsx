import {useForm} from "react-hook-form";
import {ApiKeywordForm} from "@/types/api-types.ts";
import {PoliceLawData} from "@/types/policelaw-types.ts";
import {Dispatch, SetStateAction} from "react";
import {Button} from "@/component";
import toast from "react-hot-toast";
import {FaArrowLeft, FaCirclePlus} from "react-icons/fa6";

type Props = {
  readonly law: PoliceLawData,
  readonly setLaw: Dispatch<SetStateAction<PoliceLawData | null>>,
  readonly setArticleLink: Dispatch<SetStateAction<Array<[string, string]>>>,
}

export default function Articles({law, setLaw, setArticleLink}: Props) {


  const {register, watch} = useForm<ApiKeywordForm>();

  const [keyword] = watch(['keyword']);

  const articleList = law.content.map(item => {

    const onSelect = () => {
      setArticleLink(p => [...p, [law.law_name, item.article]])
      toast.success('加入成功')
    }

    // 如果有關鍵字，且關鍵字不在條文之中
    if (keyword && !item.text.includes(keyword)) return null
    // 如果沒有內文，則為標題
    if (!item.text) return null

    // 如果有關鍵字，則替換為指定html標籤
    const text = keyword ?
      item.text.replaceAll(keyword, `<span class="bg-warning text-warning-content font-bold">${keyword}</span>`)
      : item.text;

    return (
      <section key={item.article} id={item.article} className='scroll-mt-20'>
        <div className='text-lg text-primary border-l-3 border-l-primary pl-2 my-2'>
          <Button size='sm' color='primary' className='mr-2'
                  onClick={onSelect}>
            <FaCirclePlus />加入
          </Button>
          {item.article}
        </div>
        <div dangerouslySetInnerHTML={{
          __html: text
        }} className='leading-7 whitespace-pre-wrap'>
        </div>
      </section>
    )
  })

  return (
    <div>
      <div className='sticky top-0 z-10 p-1 flex gap-1'>
        <Button size='sm' color='neutral' onClick={() => setLaw(null)}>
          <FaArrowLeft />返回法規
        </Button>
        <input placeholder='搜尋內文' className='input input-sm w-36'
               {...register('keyword', {required: true})}/>
      </div>
      <ul className='list'>
        {articleList}
      </ul>
    </div>


  )
}