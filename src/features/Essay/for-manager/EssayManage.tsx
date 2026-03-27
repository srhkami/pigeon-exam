import {useDataBrowser} from "@/hooks";
import {EssayCardConfig, EssayQuestionData} from "@/types/exam-types.ts";
import {EXAM_API} from "@/lib/config.ts";
import {DataBrowser, DataBrowserTitle, FloatingActionButton} from "@/component";
import {RiEdit2Fill} from "react-icons/ri";
import {useForm} from "react-hook-form";
import QsCardForEdit from "@/features/Essay/for-manager/QsCardForEdit.tsx";
import ModalEssayEdit from "@/features/Essay/for-manager/Edit/ModalEssayEdit.tsx";
import ModalEssayFilter from "@/features/Essay/for-manager/tools/ModalEssayFilter.tsx";

export default function EssayManage() {

  const title = '申論題管理';
  const {data, pageInfo, onRefetch} = useDataBrowser<EssayQuestionData>({url: EXAM_API + '/essay_questions/'});
  const {register, watch} = useForm<EssayCardConfig>();
  const config = watch();

  const dataList = data.map(q => {
    return (
      <QsCardForEdit key={q.id} q={q} i={q.id - 1} config={config} onRefetch={onRefetch}/>
    )
  })

  return (
    <>
      <DataBrowser
        header={<>
          <DataBrowserTitle title={title}/>
          <ModalEssayFilter/>
        </>}
        pageOption={{...pageInfo, show: 2}}
      >
        <form className='grid grid-cols-3 gap-1'>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showDetail')}/>
            <span className='label'>顯示詳情</span>
          </div>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showLinks')}/>
            <span className='label'>顯示關聯</span>
          </div>
          <div className='flex justify-center items-center gap-1'>
            <input type="checkbox" className='toggle toggle-sm'
                   {...register('showSample')}/>
            <span className='label'>顯示擬答</span>
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
        <ModalEssayEdit onRefetch={onRefetch}/>
      </FloatingActionButton>
    </>
  )
}