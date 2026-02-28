import {useEffect, useState} from 'react'
import {useLocation} from "react-router";

/* 自訂的浮動監控hook
*  1. 在需要監控的頁面組件中，使用section標籤包裹元件，並命名ID
*  2. 調用這個hook
*  3. hook回傳所有ID及觸發的ID
*  4. 在頁面內刷新索引，並高亮觸發的ID
*  */
export default function useScrollSpy() {
  const [ids, setIds] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const param = useLocation().search

  useEffect(() => {
    // 抓取 main 元素下所有 section 的 id
    const container = document.querySelector('main') || document.body
    const idList = Array.from(container.querySelectorAll('[id]'))
      .filter(el => el.tagName === 'SECTION') // 可改成你需要的 tag
      .map(el => el.id)
    setIds(idList)
  }, [param])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {rootMargin: '0px 0px -70% 0px', threshold: 0}
    )

    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[]

    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [ids])

  return {ids, activeId}
}