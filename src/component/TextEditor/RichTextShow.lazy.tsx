import {lazy, Suspense, type ComponentProps} from 'react';

type Props = ComponentProps<typeof import('./RichTextShow.tsx').default>;
const Implementation = lazy(() => import('./RichTextShow.tsx'));

export default function RichTextShow(props: Props) {
  return <Suspense fallback={null}><Implementation {...props}/></Suspense>;
}
