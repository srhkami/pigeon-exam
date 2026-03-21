import {useNavigate} from "react-router";
import {useDataBrowser} from "@/hooks";
import {Button, DataBrowser, DataBrowserTitle, FabAction, FloatingActionButton} from "@/component";
import {RiEdit2Fill, RiNewspaperFill} from "react-icons/ri";
import {BsFileEarmarkPlusFill} from "react-icons/bs";
import {PaperData} from "@/types/exam-types.ts";
import {EXAM_API} from "@/lib/config.ts";
import {FilterConfig} from "@/types/api-types.ts";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {MdOutlineOpenInNew} from "react-icons/md";

/* 試卷管理 */
export default function PaperManage() {

  const navi = useNavigate();
  const {data, pageInfo} = useDataBrowser<PaperData>({url: EXAM_API + '/papers/'});

  const filterConfigs: Array<FilterConfig> = [
    {
      title: '排序',
      fieldName: 'ordering',
      options: [
        {label: '從新到舊', value: '-ud'},
        {label: '從舊到新', value: 'ud'},
      ]
    }
  ]

  const dataList = data.map(obj => {

    const iconClass = twMerge(
      'w-5 h-5',
      clsx({
        'text-warning':!obj.uuid,
        'text-error': obj.uuid && !obj.is_public,
      })
    )

    return (
      <li className="list-row hover:bg-base-200" key={obj.id}>
        <div className='flex items-center justify-center'>
          <RiNewspaperFill className={iconClass}/>
        </div>
        <div className="list-col-grow">
          <div className='textl-lg font-semibold'>
            {obj.title}
          </div>
          <div className="text-xs uppercase opacity-60 flex items-center">
            <span className='ml-1'>{obj.subject}</span>
            <span className='ml-1'>{obj.category}</span>
          </div>
        </div>
        <Button style='ghost' shape='circle' onClick={() => navi('/manage/paper/detail/' + obj.id)}>
          <MdOutlineOpenInNew className='text-xl'/>
        </Button>
      </li>
    )
  })
  return (
    <>
      <DataBrowser
        header={<DataBrowserTitle title='試卷管理'/>}
        filterConfigs={filterConfigs}
        placeholder='搜尋標題'
        pageOption={{...pageInfo, show: 2}}
      >
        <ul className="list mx-2">
          {dataList}
        </ul>
      </DataBrowser>
      <FloatingActionButton
        buttonContent={<RiEdit2Fill/>}
        color='primary'
        closeButton
      >
        <FabAction color='primary' label='新增試卷'
                   onClick={() => navi('/exam/paper/add')}>
          <BsFileEarmarkPlusFill/>
        </FabAction>
      </FloatingActionButton>
    </>
  )
}