import {useSortable,} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities' //把內部的 transform 物件轉為 style 用字串
import {twMerge} from "tailwind-merge";
import {ReactNode} from "react";
import clsx from "clsx";
import {Button} from "@/component";
import {FaXmark} from "react-icons/fa6";
import {RxDragHandleDots2} from "react-icons/rx";

type Props = {
  id: string | number,
  onDelete: () => void,
  className?: string,
  children: ReactNode,
}

/**
 * 可拖曳的清單項目
 * @param id 一定要傳入指定ID
 * @param onDelete 刪除這個項目的函數
 * @param className
 * @param children
 * @constructor
 */
export default function DnDListItem({id, onDelete, className, children,}: Props) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const classes = twMerge(
    'list-row hover:bg-base-200 items-center',
    className,
    clsx({
      'z-20 opacity-90 backdrop-blur-lg border-2 border-accent': isDragging,
    })
  )

  return (
    <li
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={classes}
    >
      <button {...listeners} className="btn btn-sm btn-accent btn-ghost btn-circle cursor-grab ">
        <RxDragHandleDots2 className='text-lg'/>
      </button>
      {children}
      <Button size='sm' color='error' style='soft' shape='circle' className='ml-auto'
              onClick={onDelete}>
        <FaXmark/>
      </Button>
    </li>
  )
}