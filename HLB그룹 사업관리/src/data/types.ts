// HLB 현장지원팀 지식그래프 데이터 모델
//
// 그래프는 5종의 노드(엔티티)와 그 사이의 연결로 구성된다.
//   계열사(company) ──보유── 사업(business)
//   계열사(company) ──개최── 이사회(board)
//   이사회(board)   ──논의/의결── 사업(business)
//   팀원(member)    ──수행── 지원활동(support)
//   지원활동(support) ──지원── 사업(business) / 계열사(company)
//
// 이 모델이 1단계(지식그래프)의 척추이며, 이후 2단계(업무로그)·3단계(주간보고)가
// support / business 노드에 그대로 얹힌다.

export type NodeKind = 'company' | 'business' | 'board' | 'member' | 'support'

/** 계열사 */
export interface Company {
  id: string
  name: string
  /** 상장 여부 — 비상장사는 이사회 안건이 미공개 민감정보 */
  listing: '상장' | '비상장'
  sector: string
  note?: string
}

/** 사업 / 사업 안건 */
export interface Business {
  id: string
  companyId: string
  name: string
  status: '구상' | '진행' | '보류' | '완료'
  note?: string
}

/** 이사회 (회사가 개최, 사업 안건을 논의/의결) */
export interface Board {
  id: string
  companyId: string
  date: string // YYYY-MM-DD
  title: string
  /** 이 이사회에서 논의/의결된 사업 id 목록 */
  businessIds: string[]
  note?: string
}

/** 현장지원팀원 */
export interface Member {
  id: string
  name: string
  title: string // 부장, 차장 등
  note?: string
}

/** 지원활동 (팀원이 수행, 사업/계열사를 지원) */
export interface Support {
  id: string
  memberId: string
  /** 지원 대상 — 사업 id 또는 계열사 id */
  targetId: string
  title: string
  status: '진행' | '대기' | '완료'
  updatedAt: string // YYYY-MM-DD
  note?: string
}

export interface GraphData {
  companies: Company[]
  businesses: Business[]
  boards: Board[]
  members: Member[]
  supports: Support[]
}

export const KIND_LABEL: Record<NodeKind, string> = {
  company: '계열사',
  business: '사업',
  board: '이사회',
  member: '팀원',
  support: '지원활동',
}

export const KIND_COLOR: Record<NodeKind, string> = {
  company: '#2563eb', // 파랑
  business: '#0d9488', // 청록
  board: '#9333ea', // 보라
  member: '#ea580c', // 주황
  support: '#65a30d', // 연두
}
