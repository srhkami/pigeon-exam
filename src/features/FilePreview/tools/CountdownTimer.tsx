import {ReactNode, useEffect, useState} from "react";

type Props = {
  readonly initialTime: number, //初始秒數
  readonly url: string, //跳轉地址
}

/* 倒數時間的組件 */
export default function CountdownTimer({initialTime, url}: Props): ReactNode {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      window.location.href = url; // 跳轉到指定網址
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer); // 清除計時器以避免內存泄漏
  }, [url, timeLeft]);

  return <>（{timeLeft}）</>
}