import {Col, Row} from "@/component";
import ImageCarousel from "@/features/News/content/ImageCarousel.tsx";
import Announcement from "@/features/News/content/Announcement.tsx";
import Recommend from "@/features/News/content/Recommend.tsx";
import {HtmlTitle} from "@/layout";

export default function News() {

  return (
    <>
      <HtmlTitle title='最新快訊'/>
      <ImageCarousel/>
      <Row>
        <Col xs={12} md={6} className='mt-4 md:px-1'>
          <Announcement/>
        </Col>
        <Col xs={12} md={6} className='mt-4 md:px-1'>
          <Recommend/>
        </Col>
      </Row>
    </>

  )
}