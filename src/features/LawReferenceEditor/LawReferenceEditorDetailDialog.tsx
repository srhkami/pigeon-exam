import {Modal, ModalBody, ModalHeader, ModalTitle} from '@/component'

type LawProvisionNode = {
  text: string
  children?: LawProvisionNode[]
  marker?: string | null
}

const isLawProvisionNode = (value: unknown): value is LawProvisionNode => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const node = value as {text?: unknown, children?: unknown, marker?: unknown}
  return typeof node.text === 'string'
    && (node.marker === undefined || node.marker === null || typeof node.marker === 'string')
    && (node.children === undefined || (Array.isArray(node.children) && node.children.every(isLawProvisionNode)))
}

const LawProvisionNodeTreeItem = ({node}: {node: LawProvisionNode}) => {
  const children = node.children ?? []
  return <div className='min-w-0 space-y-1'>
    <div className='min-w-0 break-words text-sm'>
      <span className='opacity-70'>{node.marker ?? ''}</span>
      {node.marker ? <span className='mr-1'/> : null}
      <span className='leading-normal'>{node.text}</span>
    </div>
    {children.length > 0 ? <div className='min-w-0 pl-4'>{children.map((child, index) =>
      <LawProvisionNodeTreeItem key={`${node.text}-${index}`} node={child}/>)}
    </div> : null}
  </div>
}

const LawProvisionNodeTree = ({nodes}: {nodes: unknown}) => {
  if (!Array.isArray(nodes) || nodes.length === 0 || !nodes.every(isLawProvisionNode)) {
    return <div className='opacity-60'>無條文節點</div>
  }
  return <div className='min-w-0 space-y-1'>
    {nodes.map((node, index) => <LawProvisionNodeTreeItem key={`${node.text}-${index}`} node={node}/>)}
  </div>
}

export type LawReferenceEditorPreviewProvision = {
  ordinal_code: string
  heading: string | null
  provision_type: string
  structure_labels: unknown[]
  nodes_json: unknown
  md_content: string
}

type Props = {
  readonly provision: LawReferenceEditorPreviewProvision | null
  readonly onHide: () => void
}

const provisionTypeLabels: Record<string, string> = {
  article: '條文',
  point: '項',
}

const formatProvisionType = (value: string) => provisionTypeLabels[value] ?? '其他類型'

export default function LawReferenceEditorDetailDialog({provision, onHide}: Props) {
  const dialogTitle = provision
    ? `條文詳情：${provision.ordinal_code}${provision.heading ? ` ${provision.heading}` : ''}`
    : '條文詳情'

  return <Modal isShow={provision !== null} onHide={onHide} closeButton size='xl'>
    <ModalHeader>
      <ModalTitle>{dialogTitle}</ModalTitle>
    </ModalHeader>
    <ModalBody className='max-h-[70vh] space-y-5 overflow-y-auto pr-1'>
      {provision ? <>
        <section aria-label='條文資訊'>
          <dl className='grid gap-3 text-sm sm:grid-cols-2'>
            <div>
              <dt className='text-base-content/65'>條文類型</dt>
              <dd className='mt-1'>{formatProvisionType(provision.provision_type)}</dd>
            </div>
            <div>
              <dt className='text-base-content/65'>所屬章節</dt>
              <dd className='mt-1'>{provision.structure_labels.map(String).join(' / ') || '未提供'}</dd>
            </div>
          </dl>
        </section>

        <section className='border-t border-base-300 pt-4' aria-label='完整條文內容'>
          <h3 className='font-semibold'>完整條文內容</h3>
          <div className='mt-3'>
            <LawProvisionNodeTree nodes={provision.nodes_json}/>
          </div>
        </section>

        {provision.md_content.trim() ? <details className='border-t border-base-300 pt-4'>
          <summary className='cursor-pointer font-medium'>原始文字</summary>
          <pre className='mt-3 whitespace-pre-wrap break-words rounded-lg bg-base-200 p-3 text-sm'>{provision.md_content}</pre>
        </details> : null}
      </> : null}
    </ModalBody>
  </Modal>
}
