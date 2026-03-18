import {useDataBrowser} from "@/hooks";
import {DataBrowser, DataBrowserTitle, FabAction, FloatingActionButton} from "@/component";
import {SelectCardConfig, SelectQuestionData} from "@/types/exam-types.ts";
import {RiEdit2Fill} from "react-icons/ri";
import {TbReload} from "react-icons/tb";
import {useForm} from "react-hook-form";
import ModalSelectFilter from "@/features/Select/for-manager/Manage/ModalSelectFilter.tsx";
import ModalSelectAdd from "@/features/Select/for-manager/Manage/Edit/ModalSelectAdd.tsx";
import {POLICE_API} from "@/lib/config.ts";
import QsCardForEdit from "@/features/Select/for-manager/Question/QsCardForEdit.tsx";

/* 選擇題管理 */
export default function SelectManage() {

  const title = '單選題管理';
  // const [config, setConfig] = useState<SelectCardConfig>()
  const {data, pageInfo, onRefetch} = useDataBrowser<SelectQuestionData>({url: POLICE_API + '/exam_select/'});

  const {register, getValues} = useForm<SelectCardConfig>();
  // const onSubmit: SubmitHandler<SelectCardConfig> = (formData) => {
  //   setConfig(formData);
  // }
  // useEffect(() => {
  //   // 訂閱表單變動
  //   const subscription = watch(() => {
  //     handleSubmit(onSubmit)();
  //   })
  //   // 清除訂閱以避免記憶體洩漏
  //   return () => subscription.unsubscribe();
  // }, [watch, handleSubmit]);

  const dataList = data.map(obj => {
    return (
      <QsCardForEdit key={obj.id} q={obj} a={[]} i={obj.id-1} config={getValues()} onRefetch={onRefetch}/>
    )
  })

  return (
    <>
      <DataBrowser
        header={
          <>
            <DataBrowserTitle title={title}/>
            <ModalSelectFilter/>
          </>
        }
        placeholder='搜尋題目/年份'
        pageOption={{...pageInfo, show: 2}}
      >
        <form className='grid grid-cols-2 sm:grid-cols-4 gap-1'>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showOptions')}/>
            <span className='label'> 顯示選項</span>
          </div>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showRating')}/>
            <span className='label'> 顯示難度</span>
          </div>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showLinks')}/>
            <span className='label'> 顯示關聯</span>
          </div>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showComment')}/>
            <span className='label'> 顯示註解</span>
          </div>
        </form>
        <ul className="list mx-2">
          {dataList}
        </ul>
      </DataBrowser>
      <FloatingActionButton
        buttonContent={<RiEdit2Fill/>}
        color='primary'
        closeButton
      >
        <ModalSelectAdd onRefetch={onRefetch}/>
        <FabAction color='neutral' label='更新資料'
                   onClick={() => onRefetch()}>
          <TbReload/>
        </FabAction>
      </FloatingActionButton>
    </>
  )
}