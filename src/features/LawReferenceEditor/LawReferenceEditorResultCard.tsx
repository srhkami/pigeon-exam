import {FaEye} from 'react-icons/fa6'
import type {LawProvisionSearchHit} from '@/features/Link/ArticleLink/lawPickerApi.ts'
import type {NewProvision} from './lawReferenceEditorController.ts'

type Props = {
  readonly hit: LawProvisionSearchHit
  readonly selected?: boolean
  readonly disabled?: boolean
  readonly onSelect: (provision: NewProvision) => void
  readonly onPreview: (provision: NewProvision) => void
}

export default function LawReferenceEditorResultCard({hit, selected = false, disabled = false, onSelect, onPreview}: Props) {
  const {provision} = hit
  const preview = (hit.search_text_preview || provision.md_content || '').slice(0, 160)

  return <div className='rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm'>
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div className='min-w-0 flex-1'>
        <div className='flex items-center gap-1 font-semibold'>{provision.document_title} | {provision.ordinal_code}
          <button className='btn btn-ghost btn-xs' type='button' disabled={disabled}
                  onClick={() => onPreview(provision)} aria-label={`預覽${provision.document_title}${provision.ordinal_code}`}>
            <FaEye/>
          </button>
        </div>
        {preview ? <p className='mt-2 line-clamp-3 text-sm opacity-75'>{preview}</p> : null}
      </div>
      <button className={`btn btn-sm ${selected ? 'btn-success' : 'btn-primary'}`} type='button'
              disabled={disabled || selected} onClick={() => onSelect(provision)}>
        {selected ? '已選取' : '選取'}
      </button>
    </div>
  </div>
}
