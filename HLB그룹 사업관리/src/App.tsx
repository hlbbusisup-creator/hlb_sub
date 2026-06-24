import { useMemo, useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { GraphView } from './components/GraphView'
import { DetailPanel } from './components/DetailPanel'
import { seed } from './data/seed'
import { KIND_COLOR, KIND_LABEL, type NodeKind } from './data/types'

const LEGEND: NodeKind[] = ['company', 'business', 'board', 'member', 'support']

export default function App() {
  const data = seed
  const [filterCompanyId, setFilterCompanyId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const kpis = useMemo(() => {
    const scope = filterCompanyId
      ? data.businesses.filter((b) => b.companyId === filterCompanyId)
      : data.businesses
    const scopeIds = new Set(scope.map((b) => b.id))
    const supports = filterCompanyId
      ? data.supports.filter((s) => scopeIds.has(s.targetId) || s.targetId === filterCompanyId)
      : data.supports
    return {
      companies: filterCompanyId ? 1 : data.companies.length,
      businessActive: scope.filter((b) => b.status === '진행').length,
      supportActive: supports.filter((s) => s.status === '진행').length,
      boards: filterCompanyId
        ? data.boards.filter((m) => m.companyId === filterCompanyId).length
        : data.boards.length,
    }
  }, [data, filterCompanyId])

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo">HLB</span>
          <div>
            <div className="topbar__title">현장지원팀 · 사업지원 대시보드</div>
            <div className="topbar__sub">계열사 · 사업 지식그래프 (v1)</div>
          </div>
        </div>
        <div className="topbar__filter">
          <label>계열사</label>
          <select
            value={filterCompanyId ?? ''}
            onChange={(e) => {
              setFilterCompanyId(e.target.value || null)
              setSelectedId(null)
            }}
          >
            <option value="">전체</option>
            {data.companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.listing})
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="kpis">
        <Kpi label="계열사" value={kpis.companies} />
        <Kpi label="진행 사업" value={kpis.businessActive} />
        <Kpi label="진행 지원활동" value={kpis.supportActive} />
        <Kpi label="이사회" value={kpis.boards} />
        <div className="legend">
          {LEGEND.map((k) => (
            <span key={k} className="legend__item">
              <i style={{ background: KIND_COLOR[k] }} />
              {KIND_LABEL[k]}
            </span>
          ))}
        </div>
      </section>

      <main className="content">
        <div className="graph-wrap">
          <ReactFlowProvider>
            <GraphView
              data={data}
              filterCompanyId={filterCompanyId}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </ReactFlowProvider>
        </div>
        <DetailPanel data={data} selectedId={selectedId} />
      </main>
    </div>
  )
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="kpi">
      <div className="kpi__value">{value}</div>
      <div className="kpi__label">{label}</div>
    </div>
  )
}
