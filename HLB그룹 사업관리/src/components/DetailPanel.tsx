import type { GraphData, NodeKind } from '../data/types'
import { KIND_COLOR, KIND_LABEL } from '../data/types'

interface Props {
  data: GraphData
  selectedId: string | null
}

interface Row {
  k: string
  v: string
}

interface Detail {
  kind: NodeKind
  title: string
  rows: Row[]
  links: string[] // 연결된 항목 설명
}

/** "company:c1" 형태의 선택 id를 파싱해 상세 정보를 구성 */
function resolve(data: GraphData, selectedId: string): Detail | null {
  const [kind, refId] = selectedId.split(':') as [NodeKind, string]

  if (kind === 'company') {
    const c = data.companies.find((x) => x.id === refId)
    if (!c) return null
    const biz = data.businesses.filter((b) => b.companyId === c.id)
    const boards = data.boards.filter((m) => m.companyId === c.id)
    return {
      kind,
      title: c.name,
      rows: [
        { k: '상장구분', v: c.listing },
        { k: '분야', v: c.sector },
      ],
      links: [
        ...biz.map((b) => `사업 · ${b.name} (${b.status})`),
        ...boards.map((m) => `이사회 · ${m.title} (${m.date})`),
      ],
    }
  }

  if (kind === 'business') {
    const b = data.businesses.find((x) => x.id === refId)
    if (!b) return null
    const company = data.companies.find((c) => c.id === b.companyId)
    const boards = data.boards.filter((m) => m.businessIds.includes(b.id))
    const supports = data.supports.filter((s) => s.targetId === b.id)
    return {
      kind,
      title: b.name,
      rows: [
        { k: '소속', v: company?.name ?? '-' },
        { k: '상태', v: b.status },
      ],
      links: [
        ...boards.map((m) => `이사회 · ${m.title} (${m.date})`),
        ...supports.map((s) => {
          const p = data.members.find((x) => x.id === s.memberId)
          return `지원 · ${s.title} — ${p?.name ?? '?'} ${p?.title ?? ''} (${s.status})`
        }),
      ],
    }
  }

  if (kind === 'board') {
    const m = data.boards.find((x) => x.id === refId)
    if (!m) return null
    const company = data.companies.find((c) => c.id === m.companyId)
    const biz = data.businesses.filter((b) => m.businessIds.includes(b.id))
    return {
      kind,
      title: m.title,
      rows: [
        { k: '개최사', v: company?.name ?? '-' },
        { k: '일자', v: m.date },
        ...(m.note ? [{ k: '비고', v: m.note }] : []),
      ],
      links: biz.map((b) => `안건 · ${b.name} (${b.status})`),
    }
  }

  if (kind === 'member') {
    const p = data.members.find((x) => x.id === refId)
    if (!p) return null
    const supports = data.supports.filter((s) => s.memberId === p.id)
    return {
      kind,
      title: `${p.name} ${p.title}`,
      rows: [{ k: '소속', v: '현장지원팀' }],
      links: supports.map((s) => `지원 · ${s.title} (${s.status} · ${s.updatedAt})`),
    }
  }

  if (kind === 'support') {
    const s = data.supports.find((x) => x.id === refId)
    if (!s) return null
    const p = data.members.find((x) => x.id === s.memberId)
    const targetBiz = data.businesses.find((b) => b.id === s.targetId)
    const targetCo = data.companies.find((c) => c.id === s.targetId)
    return {
      kind,
      title: s.title,
      rows: [
        { k: '담당', v: p ? `${p.name} ${p.title}` : '-' },
        { k: '대상', v: targetBiz?.name ?? targetCo?.name ?? '-' },
        { k: '상태', v: s.status },
        { k: '갱신일', v: s.updatedAt },
      ],
      links: [],
    }
  }

  return null
}

export function DetailPanel({ data, selectedId }: Props) {
  if (!selectedId) {
    return (
      <aside className="detail detail--empty">
        <p>노드를 클릭하면 상세 정보와 연결 관계가 여기에 표시됩니다.</p>
      </aside>
    )
  }

  const detail = resolve(data, selectedId)
  if (!detail) {
    return (
      <aside className="detail detail--empty">
        <p>정보를 찾을 수 없습니다.</p>
      </aside>
    )
  }

  const color = KIND_COLOR[detail.kind]
  return (
    <aside className="detail">
      <div className="detail__kind" style={{ color }}>
        {KIND_LABEL[detail.kind]}
      </div>
      <h2 className="detail__title">{detail.title}</h2>
      <dl className="detail__rows">
        {detail.rows.map((r) => (
          <div key={r.k} className="detail__row">
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
          </div>
        ))}
      </dl>
      {detail.links.length > 0 && (
        <div className="detail__links">
          <div className="detail__links-title">연결된 항목</div>
          <ul>
            {detail.links.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
