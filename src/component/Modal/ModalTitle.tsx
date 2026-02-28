import type {ReactNode} from "react";

type Props = {
  readonly className?: string,
  readonly children: ReactNode,
}

export default function ModalTitle({className, children}: Props) {
  return (
    <div className={'border-l-4 border-l-primary pl-4 text-xl font-bold ' + className}>{children}</div>
  )
}