import {Button} from "@/component"
import {FaCirclePlus} from "react-icons/fa6"
import type {LawProvisionSearchHit} from "./lawPickerApi.ts"
import type {LawProvisionSummary} from "./lawReferenceController.ts"

const label = (provision: LawProvisionSummary) => `第 ${provision.ordinal_code} ${provision.provision_type === 'point' ? '點' : '條'}`

type Props = {
  readonly hit: LawProvisionSearchHit
  readonly selected?: boolean
  readonly disabled?: boolean
  readonly onSelect: (provision: LawProvisionSummary) => void
}

export default function LawProvisionResultCard({hit, selected = false, disabled = false, onSelect}: Props) {
  const {provision} = hit
  const preview = (hit.search_text_preview || provision.md_content || '').slice(0, 160)

  return <div className='rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm'>
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div className='min-w-0 flex-1'>
        <p className='break-words font-semibold'>{provision.document_title}</p>
        <div className='mt-1 flex flex-wrap gap-2 text-xs text-base-content/70'>
          {provision.document_code ? <span className='font-mono'>{provision.document_code}</span> : null}
          <span>{label(provision)}</span>
          {provision.heading ? <span>{provision.heading}</span> : null}
        </div>
        {preview ? <p className='mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm text-base-content/75'>{preview}</p> : null}
      </div>
      <Button type='button' size='sm' color={selected ? 'success' : 'primary'} disabled={disabled || selected} onClick={() => onSelect(provision)}>
        <FaCirclePlus/>{selected ? '已加入' : '加入'}
      </Button>
    </div>
  </div>
}
