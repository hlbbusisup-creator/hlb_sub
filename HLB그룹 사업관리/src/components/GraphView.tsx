import { useMemo } from 'react'
import {
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { EntityNode } from './EntityNode'
import { buildGraph, type FlowNode } from '../graph/buildGraph'
import type { GraphData } from '../data/types'

const nodeTypes = { entity: EntityNode }

interface Props {
  data: GraphData
  filterCompanyId: string | null
  selectedId: string | null
  onSelect: (id: string | null) => void
}

export function GraphView({ data, filterCompanyId, selectedId, onSelect }: Props) {
  const { nodes, edges } = useMemo(
    () => buildGraph(data, filterCompanyId),
    [data, filterCompanyId],
  )

  const styledNodes: FlowNode[] = useMemo(
    () => nodes.map((n) => ({ ...n, selected: n.id === selectedId })),
    [nodes, selectedId],
  )

  const styledEdges: Edge[] = useMemo(() => {
    if (!selectedId) return edges
    return edges.map((e) => {
      const touches = e.source === selectedId || e.target === selectedId
      return touches
        ? { ...e, animated: true, style: { ...e.style, stroke: '#475569', strokeWidth: 2 } }
        : { ...e, style: { ...e.style, opacity: 0.35 } }
    })
  }, [edges, selectedId])

  const handleNodeClick: NodeMouseHandler = (_, node) => onSelect(node.id)

  return (
    <ReactFlow
      nodes={styledNodes}
      edges={styledEdges}
      nodeTypes={nodeTypes}
      onNodeClick={handleNodeClick}
      onPaneClick={() => onSelect(null)}
      fitView
      minZoom={0.2}
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#e2e8f0" gap={20} />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}
