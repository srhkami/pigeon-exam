import {closestCenter, DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors} from '@dnd-kit/core'
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable'
import {restrictToVerticalAxis, restrictToWindowEdges} from '@dnd-kit/modifiers'
import {Dispatch, HTMLAttributes, SetStateAction} from 'react'
import {twMerge} from "tailwind-merge";

type Props<T> = {
  items: Array<{ id: string | number } & T>
  setItems: Dispatch<SetStateAction<Array<{ id: string | number} & T>>>
}

/**
 * 可以拖曳的列表組件
 * @param children 子組件，應為DnDListItem
 * @param items 項目列表的State，需包含「id」欄位
 * @param setItems 設定項目列表State的函數
 * @param className
 * @constructor
 */
export default function DnDList<T>({
                                     children,
                                     items,
                                     setItems,
                                     className,
                                   }: Props<T> & HTMLAttributes<HTMLUListElement>) {

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // 防誤觸
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  )

  // 拖曳完成時更新排序
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(item => item.id === active.id)
    const newIndex = items.findIndex(item => item.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      setItems(prev => arrayMove(prev, oldIndex, newIndex));
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className={twMerge('list', className)}>
          {children}
        </ul>
      </SortableContext>
    </DndContext>
  )
}