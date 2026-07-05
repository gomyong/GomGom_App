import type { SeaIcePoint, Subpopulation } from "./types";

// -----------------------------------------------------------------------------
// PRD 11장 정직성 원칙:
// - 19개 아개체군 중 다수는 데이터가 부족해 추세를 알 수 없음(unknown).
// - 단일 수치로 낙관/비관을 단정하지 않음. 증가·안정·감소·불명이 공존.
// - 출처: IUCN Polar Bear Specialist Group(상태), NSIDC(해빙). 값은 대표 근사.
// -----------------------------------------------------------------------------

// 19개 아개체군 — 손그림 지도 배치용 상대좌표(x,y: 0~100, 북극 도식)
export const SUBPOPULATIONS: Subpopulation[] = [
  { id: "SB", name: "남부 보퍼트해", status: "declining", estimate: 900, note: "해빙 감소로 최근 줄어든 것으로 평가돼요.", x: 30, y: 30 },
  { id: "NB", name: "북부 보퍼트해", status: "stable", estimate: 1200, note: "비교적 안정적으로 유지되고 있어요.", x: 38, y: 22 },
  { id: "CS", name: "척치해", status: "stable", estimate: 3000, note: "먹이가 풍부해 최근까지 안정적이에요.", x: 22, y: 40 },
  { id: "WH", name: "서허드슨만", status: "declining", estimate: 618, note: "결빙 시점 변화에 민감, 감소 추세예요.", x: 55, y: 70 },
  { id: "SH", name: "남부 허드슨만", status: "declining", estimate: 780, note: "긴 무빙기로 감소하고 있어요.", x: 60, y: 78 },
  { id: "FB", name: "폭스만", status: "stable", estimate: 2280, note: "최근 조사에서 안정적으로 나타났어요.", x: 52, y: 62 },
  { id: "DS", name: "데이비스 해협", status: "increasing", estimate: 2020, note: "일부 조사에서 증가로 평가됐어요.", x: 68, y: 60 },
  { id: "BB", name: "배핀만", status: "declining", estimate: 2800, note: "무빙기 연장으로 감소 신호가 있어요.", x: 66, y: 48 },
  { id: "KB", name: "칸 분지", status: "unknown", estimate: null, note: "데이터가 부족해 추세를 알 수 없어요.", x: 62, y: 34 },
  { id: "LS", name: "래브라도해", status: "unknown", estimate: null, note: "데이터가 부족해요.", x: 74, y: 66 },
  { id: "GB", name: "걸프 오브 부시아", status: "stable", estimate: 1500, note: "안정적으로 평가돼요.", x: 50, y: 50 },
  { id: "MC", name: "매클린톡 해협", status: "increasing", estimate: 300, note: "소규모지만 증가로 평가됐어요.", x: 44, y: 44 },
  { id: "LP", name: "랭커스터 해협", status: "stable", estimate: 2540, note: "안정적으로 나타났어요.", x: 56, y: 42 },
  { id: "NW", name: "노르웨이만", status: "unknown", estimate: 200, note: "데이터가 제한적이에요.", x: 48, y: 36 },
  { id: "VM", name: "빅토리아 섬", status: "unknown", estimate: null, note: "추세 불명.", x: 40, y: 38 },
  { id: "BS", name: "바렌츠해", status: "unknown", estimate: 2650, note: "빠른 해빙 변화, 추세 평가 어려움.", x: 90, y: 30 },
  { id: "KS", name: "카라해", status: "unknown", estimate: null, note: "데이터 부족.", x: 82, y: 24 },
  { id: "LV", name: "랍테프해", status: "unknown", estimate: 800, note: "추세 불명.", x: 70, y: 16 },
  { id: "AB", name: "아크틱 분지", status: "unknown", estimate: null, note: "가장 데이터가 부족한 해역.", x: 50, y: 20 },
];

// 9월 최소 해빙 면적 (백만 km²) — NSIDC 위성 관측 근사, 1979~2023
export const SEA_ICE: SeaIcePoint[] = [
  { year: 1979, extentMkm2: 7.2 }, { year: 1983, extentMkm2: 7.5 },
  { year: 1987, extentMkm2: 7.5 }, { year: 1991, extentMkm2: 6.6 },
  { year: 1995, extentMkm2: 6.2 }, { year: 1999, extentMkm2: 6.2 },
  { year: 2003, extentMkm2: 6.2 }, { year: 2007, extentMkm2: 4.3 },
  { year: 2011, extentMkm2: 4.6 }, { year: 2012, extentMkm2: 3.6 },
  { year: 2015, extentMkm2: 4.6 }, { year: 2016, extentMkm2: 4.5 },
  { year: 2019, extentMkm2: 4.2 }, { year: 2020, extentMkm2: 4.0 },
  { year: 2021, extentMkm2: 4.9 }, { year: 2023, extentMkm2: 4.2 },
];

export const STATUS_LABEL: Record<Subpopulation["status"], string> = {
  increasing: "증가",
  stable: "안정",
  declining: "감소",
  unknown: "불명",
};

// 상태별 색 — 디자인 가이드 팔레트: 증가=아크틱 블루, 안정=스틸,
// 감소=절제된 경고 레드(가이드: warning은 desaturated red만), 불명=그레이
export const STATUS_COLOR: Record<Subpopulation["status"], string> = {
  increasing: "#0058bc",
  stable: "#566068",
  declining: "#ba1a1a",
  unknown: "#a9afbe",
};

export function subpopById(id: string): Subpopulation | undefined {
  return SUBPOPULATIONS.find((s) => s.id === id);
}

export function statusCounts() {
  const c = { increasing: 0, stable: 0, declining: 0, unknown: 0 };
  for (const s of SUBPOPULATIONS) c[s.status]++;
  return c;
}

export const SOURCES = [
  { label: "IUCN Polar Bear Specialist Group — 아개체군 상태", url: "https://www.iucn-pbsg.org/" },
  { label: "NSIDC — 해빙 면적 시계열", url: "https://nsidc.org/arcticseaicenews/" },
  { label: "USGS Alaska Science Center — 개체 추적", url: "https://www.usgs.gov/centers/alaska-science-center/science/tracking-data-polar-bear-ursus-maritimus" },
];
