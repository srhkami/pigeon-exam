import {HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {twMerge} from "tailwind-merge";
import clsx from "clsx";
import {createPortal} from 'react-dom'

type Props = {
  isShow: boolean,
  onHide: () => void,
  closeButton?: boolean,
  backdrop?: boolean,
  size?: 'xs'| 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full',
  children: ReactNode,
  titleId?: string,
  focusManagement?: boolean,
  initialFocusRef?: RefObject<HTMLElement | null>,
  returnFocusRef?: RefObject<HTMLElement | null>,
}

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({
                                isShow,
                                onHide,
                                closeButton = false,
                                backdrop = true,
                                size = 'md',
                                className,
                                children,
                                titleId,
                                focusManagement = false,
                                initialFocusRef,
                                returnFocusRef,
                              }: Props & HTMLAttributes<HTMLDivElement>) {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasShownRef = useRef(false);
  const latestReturnRef = useRef(returnFocusRef);
  latestReturnRef.current = returnFocusRef;

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  useLayoutEffect(() => {
    if (modalRoot && isShow && focusManagement) {
      (initialFocusRef?.current ?? dialogRef.current)?.focus();
    }
  }, [modalRoot, isShow, focusManagement, initialFocusRef]);

  useEffect(() => {
    if (focusManagement && wasShownRef.current && !isShow) latestReturnRef.current?.current?.focus();
    wasShownRef.current = focusManagement && isShow;
  }, [focusManagement, isShow]);

  useEffect(() => () => {
    if (wasShownRef.current) latestReturnRef.current?.current?.focus();
  }, []);

  if (!modalRoot || !isShow) return null;

  const modalBoxClass = twMerge(
    'modal-box max-h-[94vh] flex flex-col overflow-hidden',
    className,
    clsx({
      'max-w-[18rem]': size === 'xs',
      'max-w-[24rem]': size === 'sm',
      'max-w-[40rem]': size === 'lg',
      'max-w-[48rem]': size === 'xl',
      'max-w-[64rem]': size === '2xl',
      'max-w-full': size === 'full',
    })
  );

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!focusManagement) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      onHide();
      return;
    }
    if (event.key !== 'Tab') return;
    const nodes = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
    if (!nodes.length) {
      event.preventDefault();
      dialogRef.current?.focus();
    } else if (event.shiftKey && (document.activeElement === nodes[0] || document.activeElement === dialogRef.current)) {
      event.preventDefault();
      nodes[nodes.length - 1].focus();
    } else if (!event.shiftKey && document.activeElement === nodes[nodes.length - 1]) {
      event.preventDefault();
      nodes[0].focus();
    }
  };

  return createPortal(
    <div role="dialog" aria-modal={focusManagement || undefined} aria-labelledby={titleId}
         className={clsx("modal", {"modal-open": isShow})} onKeyDown={onKeyDown}>
      <div ref={dialogRef} tabIndex={focusManagement ? -1 : undefined} className={modalBoxClass}>
        {closeButton &&
          <button type='button' className="btn btn-ghost btn-sm btn-circle absolute right-2 top-2"
                  aria-label='關閉視窗' onClick={onHide}>✕</button>
        }
        {children}
      </div>
      {backdrop &&
        <label className="modal-backdrop" onClick={onHide}>Close</label>
      }
    </div>,
    modalRoot
  );
}
