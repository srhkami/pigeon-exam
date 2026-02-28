import {useState} from "react";
import {useKeenSlider} from "keen-slider/react";
import {HiOutlineChevronLeft, HiOutlineChevronRight} from "react-icons/hi";
import {Button} from "@/component";
import {Link} from "react-router";
import {WEB_API} from "@/utils/config.ts";
import {CarouselImage} from "@/types/media-types.ts";
import {useCacheApi} from "@/hooks";

export default function ImageCarousel() {

  const {data} = useCacheApi<Array<CarouselImage>>({url: WEB_API +'/cache/get/?key=pigeon-hand-images'})

  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      created() {
        setLoaded(true)
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>
        let mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 3000)
        }

        slider.on("created", () => {
          slider.container.addEventListener("mouseover", () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener("mouseout", () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on("dragStarted", clearNextTimeout)
        slider.on("animationEnded", nextTimeout)
        slider.on("updated", nextTimeout)
      },
    ]
  )

  const items = data?.map((item) => {
    return (
      <div key={item.id} className="keen-slider__slide">
        <Link to={item.link}>
          <img src={item.src} alt={item.alt}
               className='image-full'/>
        </Link>
      </div>
    )
  })

  if (!data || data.length === 0) {
    return <></>
  }

  return (
    <div className="navigation-wrapper relative card overflow-hidden">
      <div ref={sliderRef} className="keen-slider">
        {items}
      </div>
      {loaded && instanceRef.current && (
        <>
          <Button shape='circle' style='ghost'
                  className='left-5 absolute top-[50%] opacity-80'
                  disabled={currentSlide === 0}
                  onClick={(e: any) => e.stopPropagation() ?? instanceRef.current?.prev()}>
            <HiOutlineChevronLeft/>
          </Button>
          <Button shape='circle' style='ghost'
                  className='right-5 absolute top-[50%] opacity-80'
                  disabled={currentSlide === instanceRef.current.track.details.slides.length - 1}
                  onClick={(e: any) => e.stopPropagation() ?? instanceRef.current?.next()}>
            <HiOutlineChevronRight/>
          </Button>
        </>
      )}
    </div>
  )
}
