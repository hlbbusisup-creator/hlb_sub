import { Handle, Position, type NodeProps } from '@xyflow/react'
import { KIND_COLOR, KIND_LABEL } from '../data/types'
import type { GraphNodeData } from '../graph/buildGraph'

export function EntityNode({ data, selected }: NodeProps & { data: GraphNodeData }) {
  const color = KIND_COLOR[data.kind]
  return (
    <div
      className="entity-node"
      style={{
        borderLeft: `4px solid ${color}`,
        boxShadow: selected ? `0 0 0 2px ${color}` : undefined,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: color }} />
      <div className="entity-node__kind" style={{ color }}>
        {KIND_LABEL[data.kind]}
      </div>
      <div className="entity-node__label">{data.label}</div>
      {data.sub && <div className="entity-node__sub">{data.sub}</div>}
      <Handle type="source" position={Position.Right} style={{ background: color }} />
    </div>
  )
}
