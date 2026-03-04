import {useDataBrowser} from "@/hooks";
import {ExamEssayCardConfig, ExamEssayData} from "@/types/exam-types.ts";
import {POLICE_API} from "@/lib/config.ts";
import {HtmlTitle} from "@/layout";
import {DataBrowser, DataBrowserTitle, FloatingActionButton} from "@/component";
import {RiEdit2Fill} from "react-icons/ri";
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import EsamManageCard from "@/features/Essay/for-manager/EsamManageCard.tsx";
import ModalEssayAdd from "@/features/Essay/for-manager/Edit/ModalEssayAdd.tsx";
import ModalEssayFilter from "@/features/Essay/for-manager/tools/ModalEssayFilter.tsx";

export default function EssayManage() {

  const title = '申論題管理';
  const [config, setConfig] = useState<ExamEssayCardConfig>()
  const {data, pageInfo, onRefetch} = useDataBrowser<ExamEssayData>({url:POLICE_API + '/exam_essay/'});

  const {register, handleSubmit, watch} = useForm<ExamEssayCardConfig>();
  const onSubmit: SubmitHandler<ExamEssayCardConfig> = (formData) => {
    setConfig(formData);
  }
  useEffect(() => {
    // 訂閱表單變動
    const subscription = watch(() => {
      handleSubmit(onSubmit)();
    })
    // 清除訂閱以避免記憶體洩漏
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit]);

  const dataList = data.map(q => {
    return (
      <EsamManageCard key={q.id} q={q} i={q.id - 1} config={config} onRefetch={onRefetch}/>
    )
  })

  return (
    <>
      <HtmlTitle title={title}/>
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
        <ModalEssayAdd onRefetch={onRefetch}/>
      </FloatingActionButton>
    </>
  )
}