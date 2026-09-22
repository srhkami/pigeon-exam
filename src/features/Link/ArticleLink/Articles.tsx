import LawProvisionResultCard from "./LawProvisionResultCard.tsx"
import type {LawProvisionSearchHit} from "./lawPickerApi.ts"
import type {LawProvisionSummary} from "./lawReferenceController.ts"

type Props = {
  readonly hits: LawProvisionSearchHit[]
  readonly selectedProvisionIds: number[]
  readonly onSelect: (provision: LawProvisionSummary) => void
}

export default function Articles({hits, selectedProvisionIds, onSelect}: Props) {
  if (hits.length === 0) return <p className='p-2 text-sm text-base-content/70'>沒有找到符合條件的法條</p>
  return <div className='grid gap-2'>
    {hits.map((hit) => <LawProvisionResultCard key={hit.provision.id} hit={hit} selected={selectedProvisionIds.includes(hit.provision.id)} onSelect={onSelect}/>) }
  </div>
}
