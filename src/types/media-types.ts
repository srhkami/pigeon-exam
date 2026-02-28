// 輪播圖片的類型
export type CarouselImage = {
  id: string
  src: string, //圖片連結
  link: string, //要跳轉的連結
  alt: string //圖片描述
}

// 公告
export type Notice = {
  id: string,
  date: string,
  text: string,
  link: string, //要跳轉的連結
}