type Props = {
  readonly title: string,
}

/* 資料顯示組件的標題 */
export default function DataBrowserTitle({title}: Props) {
  return <div className='text-2xl font-bold border-l-4 border-l-primary pl-4 flex items-center'>{title}</div>
}