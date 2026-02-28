import {SubmitHandler, useForm} from "react-hook-form";
import {ApiKeywordForm} from "@/types/api-types.ts";
import {useNavigate, useParams} from "react-router";

type Props = {
  readonly searchPage: string, // 從/開始至/結束的路徑
  readonly placeholder?: string, // 提示詞
}


/* 通用的表單輸入框 */
export default function KeywordForm({searchPage, placeholder = '搜尋關鍵字'}: Props) {

  const navi = useNavigate();
  const {keyword} = useParams(); //從網址取得當前資料夾ID
  const {register, handleSubmit} = useForm<ApiKeywordForm>({defaultValues: {keyword: keyword}});


  // 關鍵字搜尋
  const handleSearch: SubmitHandler<ApiKeywordForm> = (formData) => {
    const newKeyword = formData.keyword; // 取得新的關鍵字
    navi(searchPage + newKeyword) // 跳轉至對應搜尋頁面
  }

  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <input type="text" placeholder={placeholder} className="input input-sm max-w-36"
             {...register('keyword',{required: true})}/>
    </form>
  )
}