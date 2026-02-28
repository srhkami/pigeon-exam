import {HtmlTitle, IndexPage} from "@/layout";
import {Link} from "react-router";
import toast from "react-hot-toast";
import {MEDIA_IP, POLICE_API} from "@/utils/config.ts";
import {AllPages} from "@/routes/pages.ts";
import {Collapse, CollapseContent, CollapseTitle} from "@/component";
import {useCacheApi} from "@/hooks";

type ExamInfo = {
  select_count: number,
  essay_count: number
  essay_answer_count: number
  result_count: number,
}

/**
 * 考古題的入口頁面
 * @constructor
 */
export default function ExamIntro() {

  const {data} = useCacheApi<ExamInfo>({url: POLICE_API + "/exam/home_info/"});

  const title = '小試鴿手';
  return (
    <>
      <HtmlTitle title={title}/>
      <IndexPage>
        <div>
          <img src={MEDIA_IP + '/media/image/小試鴿手.jpg'} alt='無法載入' className='w-full rounded-xl mb-3'/>
          <div className="stats shadow w-full mb-3">
            <div className="stat place-items-center">
              <div className="stat-title">已蒐錄選擇題</div>
              <div className="stat-value text-primary">
                {data?.select_count}
                <span className='text-lg ml-1'>題</span>
              </div>
              <div className="stat-desc text-success">提供測驗 {data?.result_count} 次</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">已蒐錄申論題</div>
              <div className="stat-value text-primary">
                {data?.essay_count}
                <span className='text-lg ml-1'>題</span>
              </div>
              <div className="stat-desc text-success">提供作答 {data?.essay_answer_count} 題</div>
            </div>
          </div>
          <section id='這是什麼？' className='scroll-mt-30'>
            <Collapse className='mb-3 bg-base-100' icon='plus'>
              <CollapseTitle className='flex items-center'>
                <img src={MEDIA_IP + '/media/icon/ask.png'} alt="" className='w-6 h-6 mr-2'/>
                「小試鴿手」是什麼？
              </CollapseTitle>
              <CollapseContent>
                <img src={MEDIA_IP + '/media/image/小試鴿手_03.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
                <img src={MEDIA_IP + '/media/image/小試鴿手_04.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
                <img src={MEDIA_IP + '/media/image/小試鴿手_05.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
                <img src={MEDIA_IP + '/media/image/小試鴿手_21.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
                <img src={MEDIA_IP + '/media/image/小試鴿手_22.JPG'} alt='無法載入' className='w-full rounded-xl mb-3'/>
                <div className='divider'></div>
                <div className='font-bold'>
                  本功能題庫由桃園市政府警察局陳芳振與中央警察大學張維容、陳文雄老師共同彙整，提供中央警察大學學生無償使用。
                  <br/>若您有意願參與題庫編輯工作、幫助後進，歡迎<Link to='/feedback/web?option=4'
                                                                     className='link'>與我們聯繫</Link>。
                </div>
              </CollapseContent>
            </Collapse>
          </section>
          <section id={AllPages.examSelect.name}
                   className='scroll-mt-30 card card-border border-base-300 bg-base-100 hover:bg-base-300 mb-3'>
            <Link to={AllPages.examSelect.url} className='card-body'>
              <div className='flex items-center'>
                <img className='w-15 h-15 mr-4' src={MEDIA_IP + AllPages.examSelect.icon}
                     alt={AllPages.examSelect.name}/>
                <div>
                  <div className='card-title mb-1'>
                    {AllPages.examSelect.name}
                  </div>
                  <p>本模式提供評分及紀錄，透過反覆練習，為知識打下堅實的基礎</p>
                </div>
              </div>
            </Link>
          </section>
          <section id={AllPages.examEssay.name}
                   className='scroll-mt-30 card card-border border-base-300 bg-base-100 hover:bg-base-300 mb-3'>
            <Link to={AllPages.examEssay.url} className='card-body'>
              <div className='flex items-center'>
                <img className='w-15 h-15 mr-4' src={MEDIA_IP + AllPages.examEssay.icon}
                     alt={AllPages.examEssay.name}/>
                <div>
                  <div className='card-title mb-1'>
                    {AllPages.examEssay.name}
                  </div>
                  <p>本模式不提供評分，鼓勵同學分享作答成果，增加對各類提型的熟練度</p>
                </div>
              </div>
            </Link>
          </section>
          <section id={AllPages.examSpecial.name}
                   className='scroll-mt-30 card card-border border-base-300 bg-base-100 hover:bg-base-300 mb-3'>
            <Link to='/exam' className='card-body' onClick={() => toast.error('本模式不對外開放！')}>
              <div className='flex items-center'>
                <img className='w-15 h-15 mr-4' src={MEDIA_IP + AllPages.examSpecial.icon}
                     alt={AllPages.examSpecial.name}/>
                <div>
                  <div className='card-title mb-1'>
                    {AllPages.examSpecial.name}
                  </div>
                  <p>由老師專門進行選題，本模式採用邀請制，請向老師取得試卷連結</p>
                </div>
              </div>
            </Link>
          </section>
          <section id={AllPages.examStatistics.name}
                   className='scroll-mt-30 card card-border border-base-300 bg-base-100 hover:bg-base-300 mb-3'>
            <Link to={AllPages.examStatistics.url} className='card-body'>
              <div className='flex items-center'>
                <img className='w-15 h-15 mr-4' src={MEDIA_IP + AllPages.examStatistics.icon} alt={AllPages.examStatistics.name}/>
                <div>
                  <div className='card-title mb-1'>
                    {AllPages.examStatistics.name}
                  </div>
                  <p>針對測驗結果，進行統計及分析，找出個人弱項（本功能開發中）</p>
                </div>
              </div>
            </Link>
          </section>
        </div>
      </IndexPage>
    </>
  )
}