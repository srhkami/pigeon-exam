import {type ReactNode} from 'react'

type LawProvisionNode = {
  text: string
  children?: LawProvisionNode[] | null
}

type Props = {
  nodesJson: unknown
  mdContent: unknown
}

function isLawProvisionNode(value: unknown): value is LawProvisionNode {
  if (!value || typeof value !== 'object') return false
  const node = value as {text?: unknown, children?: unknown}
  return typeof node.text === 'string' && (node.children === undefined || node.children === null || (Array.isArray(node.children) && node.children.every(isLawProvisionNode)))
}

function renderNode(node: LawProvisionNode, depth = 0): ReactNode {
  return <div key={`${depth}-${node.text}`} className={depth > 0 ? 'pl-4' : ''}>
    <p className='whitespace-pre-wrap break-words leading-7'>{node.text}</p>
    {node.children?.map((child) => renderNode(child, depth + 1))}
  </div>
}

export default function LawProvisionNodes({nodesJson, mdContent}: Props) {
  if (Array.isArray(nodesJson) && nodesJson.length > 0 && nodesJson.every(isLawProvisionNode)) {
    return <>{nodesJson.map((node) => renderNode(node))}</>
  }
  if (typeof mdContent === 'string' && mdContent.trim()) return <p className='whitespace-pre-wrap break-words leading-7'>{mdContent}</p>
  return <p className='text-base-content/70'>目前無可顯示的條文內容</p>
}
