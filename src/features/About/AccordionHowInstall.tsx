import {MdLaptopChromebook, MdMoreVert} from "react-icons/md";
import {IoPhonePortraitOutline, IoPhonePortraitSharp, IoShareOutline} from "react-icons/io5";
import {SiGooglechrome, SiSafari} from "react-icons/si";
import {FaEdge} from "react-icons/fa";
import {Collapse, CollapseContent, CollapseTitle} from "@/component";

export default function AccordionHowInstall() {
  return (
    <>
      <Collapse icon='plus' inputName='how-install' className='mt-2' defaultChecked>
        <CollapseTitle className='flex items-center font-bold'>
          <IoPhonePortraitOutline className='mr-2'/>
          iOS裝置（iPhone）
        </CollapseTitle>
        <CollapseContent>
          <ol className='list-decimal pl-6'>
            <li>
              使用【<SiSafari className='inline'/>Safari】或【<SiGooglechrome className='inline'/>Chrome】瀏覽器進入本網站
            </li>
            <li>
              點擊【<IoShareOutline className='inline'/> 分享按鈕】👉點擊【加入主畫面】
            </li>
            <li>
              返回主畫面，即可開啟「交通鴿手」
            </li>
          </ol>
        </CollapseContent>
      </Collapse>
      <Collapse icon='plus' inputName='how-install' className='mt-2'>
        <CollapseTitle className='flex items-center font-bold'>
          <IoPhonePortraitSharp className='mr-2'/>
          Android裝置
        </CollapseTitle>
        <CollapseContent>
          <ol className='list-decimal pl-6'>
            <li>
              使用【<SiGooglechrome className='inline'/>Chrome】瀏覽器打開本網站
            </li>
            <li>
              點擊【<MdMoreVert className='inline'/>選單按鈕】👉點擊【加到主畫面】
            </li>
            <li>
              安裝後返回主畫面，即可開啟「交通鴿手」
            </li>
          </ol>
        </CollapseContent>
      </Collapse>
      <Collapse icon='plus' inputName='how-install' className='mt-2'>
        <CollapseTitle className='flex items-center font-bold'>
          <MdLaptopChromebook className='mr-2'/>
          PC電腦
        </CollapseTitle>
        <CollapseContent>
          <ol className='list-decimal pl-6'>
            <li>
              使用【<FaEdge className='inline'/>Edge】或【<SiGooglechrome className='inline'/>Chrome】瀏覽器打開本網站
            </li>
            <li>
              在網址列右側，會出現【安裝 鴿手】圖示，點擊安裝
            </li>
            <li>
              即可將應用程式加入電腦桌面
            </li>
          </ol>
        </CollapseContent>
      </Collapse>
    </>
  )
}