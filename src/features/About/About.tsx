import {HtmlTitle, IndexPage} from "@/layout";
import ModalChangeLog from "@/features/About/ModalChangeLog.tsx";
import ModalLine from "@/features/Feedback/ModalLine.tsx";
import {APP_VER, UPDATE_AT} from "@/lib/logs.ts";
import ModalManagers from "@/features/About/ModalManagers.tsx";
import AccordionHowInstall from "@/features/About/AccordionHowInstall.tsx";
import PageHeader from "@/layout/PageHeader.tsx";

export default function About() {
  const title = '關於本網站';
  return (
    <>
      <HtmlTitle title={title}/>
      <IndexPage>
        <div>
          <PageHeader title={title}/>
          <section id='版本' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
            <div className='card-body font-semibold'>
              <div className='flex items-center justify-between'>
                <h5 className='text-lg font-bold'>版本</h5>
                <ModalChangeLog/>
              </div>
              <div className='divider m-0'></div>
              <h4 className='text-xl'>{APP_VER}</h4>
              <h5 className='opacity-70'>更新日期：{UPDATE_AT}</h5>
            </div>
          </section>
          <section id='安裝應用程式' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
            <div className='card-body font-semibold'>
              <div className='flex items-center justify-between'>
                <h5 className='text-lg font-bold'>安裝應用程式</h5>
              </div>
              <div className='divider m-0'></div>
              <AccordionHowInstall/>
            </div>
          </section>
          <section id='開發者' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
            <div className='card-body font-semibold'>
              <div className='flex items-center justify-between'>
                <h5 className='text-lg font-bold'>網站作者</h5>
                <ModalLine/>
              </div>
              <div className='divider m-0'></div>
              <h4 className='text-xl'>蔡智楷 C.K.SAI</h4>
              <h5 className='opacity-70'>嘉義縣警察局民雄分局</h5>
            </div>
          </section>
          <section id='出力人員' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
            <div className='card-body font-semibold'>
              <div className='flex items-center justify-between'>
                <h5 className='text-lg font-bold'>出力人員</h5>
                <ModalManagers/>
              </div>
              <div className='divider m-0'></div>
              <h4 className='text-xl'>邢立元</h4>
              <h5 className='opacity-70'>維護「開心上班資料庫」</h5>
              <h4 className='text-xl'>施志鴻、張維容、陳芳振 老師</h4>
              <h5 className='opacity-70'>彙整「警察執法初探」</h5>
            </div>
          </section>
          <section id='特別銘謝' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
            <div className='card-body font-semibold'>
              <div className='flex items-center justify-between'>
                <h5 className='text-lg font-bold'>特別銘謝</h5>
              </div>
              <div className='divider m-0'></div>
              <h4 className='text-xl'>「全國刑案追追追」社群</h4>
              <h5 className='opacity-70'>本站部分伺服器費用由社群管理員共同出資</h5>
              <h4 className='text-xl'>財團法人桃園佛教蓮社</h4>
              <h5 className='opacity-70'>贊助「警察執法初探」功能開發</h5>
            </div>
          </section>
          <section id='素材來源' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
            <div className='card-body font-semibold'>
              <h5 className='text-lg font-bold'>素材來源</h5>
              <div className='divider m-0'></div>
              <h5 className='opacity-70'>本網站所使用之圖像素材來自於下列出處</h5>
              <ul className='list'>
                <li className='list-row'>
                  <a href="https://www.instagram.com/cgbutterfly.yun/" className='link'>青灰蝶（LOGO設計）</a>
                </li>
                <li className='list-row'>
                  <a href="https://zh.pngtree.com/" className='link'>pngtree（個人商業許可證）</a>
                </li>
                <li className='list-row'>
                  <a href="https://icons8.com/" className='link'>icons8（免費授權圖標）</a>
                </li>
                <li className='list-row'>
                  <a href="https://react-icons.github.io/react-icons/" className='link'>react-icons</a>
                </li>
                <li className='list-row'>
                  <a href="https://react-icons.github.io/react-icons/" className='link'>Gemini（非商業用途，如有侵權請告知）</a>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </IndexPage>
    </>
  )
}