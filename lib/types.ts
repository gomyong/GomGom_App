// 곰곰 데이터 타입 — PRD 10장 스키마 초안 기반 (프론트 표현용 축약)

export type Season = "winter" | "spring" | "summer" | "fall";
export type Pose = "hunting" | "swimming" | "resting" | "fasting" | "cub";
export type SubpopStatus = "increasing" | "stable" | "declining" | "unknown";

export interface TrackPoint {
  ts: string; // ISO 날짜
  lat: number;
  lng: number;
  season: Season;
  pose: Pose;
  stepKm: number; // 이전 포인트 대비 이동거리
  caption: string; // 곰 시점의 담담한 관찰 (PRD 5.7)
}

export interface Poi {
  id: string;
  lat: number;
  lng: number;
  label: string; // 손글씨 지명
  story: string; // 데이터 파생 미니 스토리
  icon: string; // 이모지 소품
}

export interface Bear {
  id: string;
  name: string;
  source: string; // 'USGS' | 'Movebank' | '대표 샘플'
  subpopulation: string;
  subpopId: string;
  sex: string;
  collarType: string;
  personality: string; // 파생 라벨
  intro: string;
  years: string; // 여정 연도
  bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number };
  track: TrackPoint[];
  pois: Poi[];
}

export interface Subpopulation {
  id: string;
  name: string;
  status: SubpopStatus;
  estimate: number | null; // null = 데이터 부족
  note: string;
  // 대시보드 손그림 지도 배치용 상대좌표 (0~100)
  x: number;
  y: number;
}

export interface SeaIcePoint {
  year: number;
  extentMkm2: number; // 9월 최소 해빙 면적 (백만 km²)
}
