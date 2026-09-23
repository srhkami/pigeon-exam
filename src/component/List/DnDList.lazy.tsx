import {lazy, Suspense, type ComponentType, type Dispatch, type HTMLAttributes, type SetStateAction} from 'react';

type Props<T> = {
  items: Array<{id: string | number} & T>;
  setItems: Dispatch<SetStateAction<Array<{id: string | number} & T>>>;
} & HTMLAttributes<HTMLUListElement>;

const Implementation = lazy(() => import('./DnDList.tsx'));

export default function DnDList<T>(props: Props<T>) {
  const List = Implementation as unknown as ComponentType<Props<T>>;
  return <Suspense fallback={null}><List {...props}/></Suspense>;
}
