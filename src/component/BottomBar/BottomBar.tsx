import {HTMLAttributes, ReactNode} from "react";
import {twMerge} from "tailwind-merge";

type Props = {
  readonly mainButton?: ReactNode;
  readonly className?: string;
  readonly children?: ReactNode;
}

/**
 * 底部欄
 * 具有透明效果及分散效果
 * @param mainButton 傳入專用按鈕BottomMainButton，在右側的主要按鈕，建議用outline凸顯顏色
 * @param children 傳入專用按鈕BottomButton，不可調整形狀及大小，建議用ghost隱藏顏色
 * @param className
 * @constructor
 */
export default function BottomBar({mainButton, className, children}: Props & HTMLAttributes<HTMLDivElement>) {

  const classes = twMerge(
    'sticky bottom-2 mt-2 flex items-center px-2',
    className,
  )

  return (
    <div className={classes}>
      {children &&
        <div
          className='py-1 border border-base-300 rounded-4xl bg-base-100/30 backdrop-blur-xs shadow-md shadow-base-content/30'>
          {children}
        </div>
      }
      {mainButton &&
        <div className='ml-auto'>
          {mainButton}
        </div>
      }
    </div>
  )
}