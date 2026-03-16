import {Col, Row} from "@/component";
import {APP_VER, UPDATE_AT} from "@/lib/logs.ts";

export default function Footer(){
  return(
    <footer className="text-base-content rounded-lg p-10">
      <Row>
        <Col xs={12} md={6} className='p-3'>
          <h5 className='text-center text-lg font-bold'>免責聲明</h5>
          <p className='text-start text-xs'>
            「鴿手」所提供之內容無法保證完全無誤，亦不能保證適用於各地機關，在參照本網站內容作為執勤用途前，務必再次確認是否適法，或先洽詢該管業務單位。
          </p>
        </Col>
        <Col xs={12} md={6} className='p-3'>
          <h5 className='text-center text-lg font-bold'>轉載規範</h5>
          <p className='text-start text-xs'>
            「鴿手」蒐錄之所有資料，包含但不限於機關函文、內規、作業程序、宣導資料等等，僅提供經實名認證之警職人員瀏覽、下載。在轉載前述資料時，請務必遵守公務員保密義務，以免觸法。
          </p>
        </Col>
      </Row>
      <aside className='text-center mt-3 text-sm'>
        <p>Ver.{APP_VER}（{UPDATE_AT}）</p>
      </aside>
      <aside className='text-center text-sm mt-1'>
        <p>Copyright © {new Date().getFullYear()} C.K.SAI All Rights Reserved</p>
      </aside>
    </footer>
  )
}