import {Link, useLocation, useParams, useSearchParams} from "react-router";
import {FaAngleDoubleLeft, FaAngleDoubleRight} from "react-icons/fa";

type AppProps = {
  readonly pageCount: number, // 頁面總數
  readonly showPages?: number, // 顯示當前頁左右兩側頁碼的數量，預設為2 (包含現有頁數共為5）
}

/* 頁碼按鈕組件 */
export default function PageButtons({pageCount, showPages = 2}: AppProps) {

  const {page} = useParams(); // 頁數
  const [searchParams] = useSearchParams();
  const path = useLocation().pathname.replace(`/${page}`, ""); // 取得基礎網址

  const pageNumber = Number(page);
  let first = pageNumber - 2;
  let last = pageNumber + 2;
  if (pageCount <= showPages * 2 + 1) {
    first = 1;
    last = pageCount;
  } else if (pageNumber <= showPages) {
    first = 1;
    last = showPages * 2 + 1;
  } else if (pageCount - pageNumber <= showPages) {
    first = pageCount - showPages * 2;
    last = pageCount;
  }
  const list = Array.from({length: last - first + 1}, (_, i) => first + i);
  const pageList = list.map((i: number) => {
    return (
      <Link to={path + '/' + i + '?' + searchParams.toString()}
            className={'join-item btn btn-sm' + (i === pageNumber ? ' btn-disabled' : '')} key={i}>
        {i}
      </Link>
    )
  })

  if (pageCount === 1){
    return null
  }

  return (
    <div className="join">
      <Link to={path + '/' + 1 + '?' + searchParams.toString()}
            className={'join-item btn btn-sm' + (pageNumber === 1 ? ' btn-disabled' : '')}>
        <FaAngleDoubleLeft/>
      </Link>
      {pageList}
      <Link to={path + '/' + pageCount + '?' + searchParams.toString()}
            className={'join-item btn btn-sm' + (pageNumber === pageCount ? ' btn-disabled' : '')}>
        <FaAngleDoubleRight/>
      </Link>
    </div>
  )
}
