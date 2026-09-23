import {lazy, Suspense, type ComponentProps} from 'react';

type Props = ComponentProps<typeof import('./ModalTextEditor.tsx').default>;
const Implementation = lazy(() => import('./ModalTextEditor.tsx'));

export default function ModalTextEditor(props: Props) {
  return <Suspense fallback={null}><Implementation {...props}/></Suspense>;
}
