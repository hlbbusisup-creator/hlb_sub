import type { GraphData } from './types'

// ⚠️ 예시(샘플) 데이터입니다.
// 계열사명은 공개된 그룹사명을 사용했지만, 사업·이사회 안건·지원활동 내용은
// 구조를 보여주기 위한 가상의 예시이며 실제 비공개 정보가 아닙니다.
// 실제 운영 시 이 파일의 내용을 팀의 실데이터로 교체하세요.

export const seed: GraphData = {
  companies: [
    { id: 'c1', name: 'HLB생명과학', listing: '상장', sector: '제약/바이오' },
    { id: 'c2', name: 'HLB제약', listing: '상장', sector: '제약' },
    { id: 'c3', name: 'HLB바이오스텝', listing: '비상장', sector: '비임상 CRO' },
    { id: 'c4', name: 'HLB글로벌', listing: '상장', sector: '유통/리조트' },
    { id: 'c5', name: 'HLB파나진', listing: '비상장', sector: '분자진단' },
  ],

  businesses: [
    { id: 'b1', companyId: 'c1', name: '간암 신약 글로벌 허가 대응', status: '진행' },
    { id: 'b2', companyId: 'c1', name: '국내 영업망 재정비', status: '구상' },
    { id: 'b3', companyId: 'c2', name: '주사제 신규 라인 증설', status: '진행' },
    { id: 'b4', companyId: 'c3', name: '비임상 수주 캐파 확대', status: '진행' },
    { id: 'b5', companyId: 'c4', name: '리조트 식음 위탁 운영 전환', status: '보류' },
    { id: 'b6', companyId: 'c5', name: '분자진단 키트 해외 인증', status: '구상' },
  ],

  boards: [
    {
      id: 'm1',
      companyId: 'c3',
      date: '2026-05-21',
      title: 'HLB바이오스텝 5월 정기 이사회',
      businessIds: ['b4'],
      note: '예시: 캐파 확대 투자안 논의',
    },
    {
      id: 'm2',
      companyId: 'c5',
      date: '2026-06-04',
      title: 'HLB파나진 6월 임시 이사회',
      businessIds: ['b6'],
      note: '예시: 해외 인증 로드맵 보고',
    },
    {
      id: 'm3',
      companyId: 'c1',
      date: '2026-06-12',
      title: 'HLB생명과학 6월 정기 이사회',
      businessIds: ['b1', 'b2'],
    },
  ],

  members: [
    { id: 'p1', name: '양창훈', title: '부장' },
    { id: 'p2', name: '김지원', title: '차장', note: '예시 인물' },
    { id: 'p3', name: '이서연', title: '과장', note: '예시 인물' },
    { id: 'p4', name: '박준호', title: '대리', note: '예시 인물' },
    { id: 'p5', name: '최민경', title: '사원', note: '예시 인물' },
  ],

  supports: [
    {
      id: 's1',
      memberId: 'p1',
      targetId: 'b1',
      title: '글로벌 허가 대응 TF 현장지원',
      status: '진행',
      updatedAt: '2026-06-20',
    },
    {
      id: 's2',
      memberId: 'p1',
      targetId: 'b4',
      title: '비임상 캐파 투자 실사 동행',
      status: '진행',
      updatedAt: '2026-06-18',
    },
    {
      id: 's3',
      memberId: 'p2',
      targetId: 'b3',
      title: '주사제 라인 증설 인허가 지원',
      status: '진행',
      updatedAt: '2026-06-19',
    },
    {
      id: 's4',
      memberId: 'p3',
      targetId: 'b6',
      title: '해외 인증 자료 번역/취합',
      status: '대기',
      updatedAt: '2026-06-15',
    },
    {
      id: 's5',
      memberId: 'p4',
      targetId: 'c4',
      title: 'HLB글로벌 위탁 전환 시장조사',
      status: '완료',
      updatedAt: '2026-06-10',
    },
    {
      id: 's6',
      memberId: 'p5',
      targetId: 'b2',
      title: '영업망 재정비 데이터 정리',
      status: '진행',
      updatedAt: '2026-06-21',
    },
  ],
}
