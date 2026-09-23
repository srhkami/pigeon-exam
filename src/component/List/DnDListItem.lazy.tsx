import {lazy, Suspense, type ComponentProps} from 'react';

type Props = ComponentProps<typeof import('./DnDListItem.tsx').default>;
const Implementation = lazy(() => import('./DnDListItem.tsx'));

export default function DnDListItem(props: Props) {
  return <Suspense fallback={null}><Implementation {...props}/></Suspense>;
}
