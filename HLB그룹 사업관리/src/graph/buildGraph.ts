import dagre from 'dagre'
import type { Edge, Node } from '@xyflow/react'
import type { GraphData, NodeKind } from '../data/types'
import { KIND_COLOR } from '../data/types'

export interface GraphNodeData extends Record<string, unknown> {
  kind: NodeKind
  label: string
  sub?: string
  /** 원본 엔티티 id (kind 내에서 유일) */
  refId: string
}

export type FlowNode = Node<GraphNodeData>

const NODE_W = 190
const NODE_H = 52

/** GraphData → react-flow 노드/엣지로 변환 후 dagre 자동 레이아웃 적용 */
export function buildGraph(data: GraphData, filterCompanyId: string | null): {
  nodes: FlowNode[]
  edges: Edge[]
} {
  const nodes: FlowNode[] = []
  const edges: Edge[] = []
  const nodeIds = new Set<string>()

  const add = (id: string, d: GraphNodeData) => {
    if (nodeIds.has(id)) return
    nodeIds.add(id)
    nodes.push({ id, position: { x: 0, y: 0 }, data: d, type: 'entity' })
  }
  const link = (source: string, target: string, label: string) => {
    if (!nodeIds.has(source) || !nodeIds.has(target)) return
    edges.push({
      id: `${source}->${target}`,
      source,
      target,
      label,
      labelStyle: { fontSize: 10, fill: '#64748b' },
      style: { stroke: '#cbd5e1' },
    })
  }

  const showCompany = (cid: string) => !filterCompanyId || filterCompanyId === cid

  // 계열사
  for (const c of data.companies) {
    if (!showCompany(c.id)) continue
    add(`company:${c.id}`, {
      kind: 'company',
      label: c.name,
      sub: `${c.listing} · ${c.sector}`,
      refId: c.id,
    })
  }

  // 사업
  for (const b of data.businesses) {
    if (!showCompany(b.companyId)) continue
    add(`business:${b.id}`, {
      kind: 'business',
      label: b.name,
      sub: b.status,
      refId: b.id,
    })
    link(`company:${b.companyId}`, `business:${b.id}`, '보유')
  }

  // 이사회
  for (const m of data.boards) {
    if (!showCompany(m.companyId)) continue
    add(`board:${m.id}`, {
      kind: 'board',
      label: m.title,
      sub: m.date,
      refId: m.id,
    })
    link(`company:${m.companyId}`, `board:${m.id}`, '개최')
    for (const bid of m.businessIds) {
      link(`board:${m.id}`, `business:${bid}`, '논의/의결')
    }
  }

  // 지원활동 + 팀원 (지원 대상이 현재 필터에 보일 때만 노출)
  // 대상 노드가 보이는 지원활동만 추린 뒤, 관련 팀원 노드 → 지원활동 노드 순으로 추가한다.
  const visibleSupports = data.supports
    .map((s) => {
      const targetNodeId = nodeIds.has(`business:${s.targetId}`)
        ? `business:${s.targetId}`
        : nodeIds.has(`company:${s.targetId}`)
          ? `company:${s.targetId}`
          : null
      return targetNodeId ? { s, targetNodeId } : null
    })
    .filter((x): x is { s: (typeof data.supports)[number]; targetNodeId: string } => x !== null)

  const usedMembers = new Set(visibleSupports.map((x) => x.s.memberId))
  for (const p of data.members) {
    if (!usedMembers.has(p.id)) continue
    add(`member:${p.id}`, {
      kind: 'member',
      label: `${p.name} ${p.title}`,
      sub: '현장지원팀',
      refId: p.id,
    })
  }

  for (const { s, targetNodeId } of visibleSupports) {
    add(`support:${s.id}`, {
      kind: 'support',
      label: s.title,
      sub: `${s.status} · ${s.updatedAt}`,
      refId: s.id,
    })
    link(`member:${s.memberId}`, `support:${s.id}`, '수행')
    link(`support:${s.id}`, targetNodeId, '지원')
  }

  layout(nodes, edges)
  return { nodes, edges }
}

/** dagre 좌→우 계층 레이아웃 */
function layout(nodes: FlowNode[], edges: Edge[]) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', nodesep: 24, ranksep: 90 })

  for (const n of nodes) g.setNode(n.id, { width: NODE_W, height: NODE_H })
  for (const e of edges) g.setEdge(e.source, e.target)

  dagre.layout(g)

  for (const n of nodes) {
    const pos = g.node(n.id)
    n.position = { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 }
  }
}

export { KIND_COLOR }
