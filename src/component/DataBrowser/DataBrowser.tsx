import type {ReactNode} from "react";
import {ApiResInfo, FilterConfig} from "@/types/api-types.ts";
import {BottomBar} from "@/component";
import ModalFilter from "@/component/DataBrowser/ModalFilter.tsx";
import PageButtons from "@/component/DataBrowser/PageButtons.tsx";

type Props = {
  readonly header?: ReactNode,
  readonly placeholder?: string,
  readonly filterConfigs?: FilterConfig[],
  readonly pageOption: {show: number } & ApiResInfo,
  readonly mainButton?: ReactNode,
  readonly bottomButtons?: ReactNode,
  readonly children: ReactNode,
}

/**
 *  顯示資料的卡片組件，通常作為一個頁面
 * @param header 標題文字或組件
 * @param placeholder 搜尋欄提示詞
 * @param filterConfigs 篩選設定，不傳入則不會顯示篩選組件
 * @param pageOption 總頁數，從API獲取，作為一個State、顯示的頁碼數量
 * @param mainButton 底端欄的主按鈕
 * @param bottomButtons 底端欄的按鈕
 * @param children 主體內的列表或表格
 * @constructor
 */
export default function DataBrowser({
                                      header,
                                      placeholder = '關鍵字',
                                      filterConfigs,
                                      pageOption,
                                      mainButton,
                                      bottomButtons,
                                      children,
                                    }: Props) {

  return (
    <div>
      <div className='card bg-base-100 card-border border-base-300 overflow-hidden'>
        <div className='card-body'>
          <div className='flex justify-between items-center'>
            {header}
            {filterConfigs && <ModalFilter filterConfigs={filterConfigs} placeholder={placeholder}/>}
          </div>
          <div className='divider m-0'></div>
          {children}
          <div className='text-xs text-center opacity-50 divider'>
            共{pageOption.page_count}頁︱{pageOption.total_count}筆資料
          </div>
          <div className='flex justify-center'>
            <PageButtons pageCount={pageOption.page_count} showPages={pageOption.show}/>
          </div>
        </div>
      </div>
      <BottomBar mainButton={mainButton}>
        {bottomButtons}
      </BottomBar>
    </div>
  )
}