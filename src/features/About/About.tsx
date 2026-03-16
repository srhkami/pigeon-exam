import ModalChangeLog from "@/features/About/ModalChangeLog.tsx";
import ModalLine from "@/features/Feedback/ModalLine.tsx";
import {APP_VER, UPDATE_AT} from "@/lib/logs.ts";
import ModalManagers from "@/features/About/ModalManagers.tsx";
import PageHeader from "@/features/Layout/PageHeader.tsx";

export default function About() {
  return (
    <div>
      <PageHeader title='關於本網站'/>
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
      <section id='題庫維護' className='scroll-mt-20 card card-border border-base-300 bg-base-100 mb-3'>
        <div className='card-body font-semibold'>
          <div className='flex items-center justify-between'>
            <h5 className='text-lg font-bold'>題庫維護</h5>
            <ModalManagers/>
          </div>
          <h4 className='text-xl'>陳芳振、張維容、陳文雄 老師</h4>
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
              <a href="https://react-icons.github.io/react-icons/"
                 className='link'>Gemini（非商業用途，如有侵權請告知）</a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}