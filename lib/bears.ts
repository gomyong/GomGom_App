import type { Bear, Pose, Season, TrackPoint } from "./types";

// -----------------------------------------------------------------------------
// 데이터 정직성 (PRD 11장)
// 아래 이동 경로는 USGS/Movebank가 공개한 남부 보퍼트해·척치해·서허드슨만
// 개체의 실제 계절 이동 "패턴"을 바탕으로 재구성한 *대표 샘플*입니다.
// 실서비스에서는 8장 파이프라인(원본 → Supabase/PostGIS)으로 실측 좌표를 대체합니다.
// 캐릭터의 성격/이름은 연출이지만, 계절별 이동 문법(단식기 상륙, 여름 장거리
// 수영, 겨울 굴 등)은 실제 생태에 근거합니다.
// -----------------------------------------------------------------------------

// 결정적(seeded) 난수 — 매번 같은 여정을 재현하기 위함
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Haversine 거리 (km)
function distKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function seasonOf(week: number): Season {
  // 0주 = 1월 초 기준
  if (week < 9 || week >= 48) return "winter"; // 12~2월
  if (week < 22) return "spring"; // 3~5월
  if (week < 35) return "summer"; // 6~8월
  return "fall"; // 9~11월
}

interface Waypoint {
  week: number;
  lat: number;
  lng: number;
}

interface BearSeed {
  id: string;
  name: string;
  source: string;
  subpopulation: string;
  subpopId: string;
  sex: string;
  collarType: string;
  personality: string;
  intro: string;
  years: string;
  seed: number;
  hasCub: boolean;
  waypoints: Waypoint[];
  pois: Bear["pois"];
}

// 캡션 — 곰 시점의 담담한 관찰 (PRD 5.7: 경고가 아니라 관찰)
function captionFor(pose: Pose, season: Season, name: string, stepKm: number): string {
  const km = Math.round(stepKm);
  switch (pose) {
    case "hunting":
      return `얼음 위 개빙구역 곁에서 물범을 기다려요. 이번 주 ${km}km를 걸었어요.`;
    case "swimming":
      return `얼음이 멀어져서 ${name}이(가) 헤엄쳐 이동했어요. 바다가 늦게 얼거든요.`;
    case "fasting":
      return `육지로 올라와 다시 얼음이 얼기를 기다려요. 여름 동안엔 거의 먹지 못해요.`;
    case "resting":
      return season === "winter" ? `굴 근처에서 웅크려 쉬어요.` : `잠시 멈춰 쉬는 중이에요.`;
    case "cub":
      return `새끼와 함께 천천히 움직여요. 봄의 얼음 위는 사냥터예요.`;
  }
}

// 포즈 파생 — PRD 6.2 데이터 매핑 (이동거리·계절·위치로 상태 결정)
function poseFor(
  season: Season,
  stepKm: number,
  onLand: boolean,
  hasCub: boolean
): Pose {
  if (season === "summer" && onLand) return "fasting";
  if (stepKm > 45) return "swimming"; // 급증한 이동거리 = 장거리 수영
  if (season === "spring" && hasCub) return "cub";
  if (stepKm < 8) return "resting";
  return "hunting";
}

function buildTrack(seed: BearSeed): TrackPoint[] {
  const rnd = mulberry32(seed.seed);
  const wps = seed.waypoints;
  const points: TrackPoint[] = [];
  let prev: { lat: number; lng: number } | null = null;

  for (let week = 0; week < 52; week++) {
    // 두 웨이포인트 사이 선형 보간 + 미세 지터
    let a = wps[0];
    let b = wps[wps.length - 1];
    for (let i = 0; i < wps.length - 1; i++) {
      if (week >= wps[i].week && week <= wps[i + 1].week) {
        a = wps[i];
        b = wps[i + 1];
        break;
      }
    }
    const span = Math.max(1, b.week - a.week);
    const t = (week - a.week) / span;
    const jitter = 0.18;
    const lat = a.lat + (b.lat - a.lat) * t + (rnd() - 0.5) * jitter;
    const lng = a.lng + (b.lng - a.lng) * t + (rnd() - 0.5) * jitter * 2;

    const season = seasonOf(week);
    const step = prev ? distKm(prev.lat, prev.lng, lat, lng) : 0;
    // 상륙 판정: 서허드슨만은 위도 59 아래, 보퍼트/척치는 육지 근접 웨이포인트 여부로 근사
    const onLand = seed.subpopId === "WH" ? lat < 59.2 : season === "summer" && rnd() > 0.45;
    const pose = poseFor(season, step, onLand, seed.hasCub);

    const d = new Date(Date.UTC(2023, 0, 1));
    d.setUTCDate(d.getUTCDate() + week * 7);

    points.push({
      ts: d.toISOString().slice(0, 10),
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      season,
      pose,
      stepKm: Number(step.toFixed(1)),
      caption: captionFor(pose, season, seed.name, step),
    });
    prev = { lat, lng };
  }
  return points;
}

function boundsOf(track: TrackPoint[]) {
  const lats = track.map((p) => p.lat);
  const lngs = track.map((p) => p.lng);
  const pad = 0.6;
  return {
    minLat: Math.min(...lats) - pad,
    maxLat: Math.max(...lats) + pad,
    minLng: Math.min(...lngs) - pad * 2,
    maxLng: Math.max(...lngs) + pad * 2,
  };
}

const SEEDS: BearSeed[] = [
  {
    id: "anook",
    name: "아눅",
    source: "USGS · 대표 샘플",
    subpopulation: "남부 보퍼트해",
    subpopId: "SB",
    sex: "암컷",
    collarType: "Argos 위성 목걸이",
    personality: "장거리 수영을 마다않는 모험가형",
    intro:
      "아눅은 얼음이 물러나는 여름이면 새 얼음을 찾아 먼 바다를 헤엄쳐요. 남부 보퍼트해에서 태어나 해마다 같은 사냥터로 돌아옵니다.",
    years: "2023년 여정",
    seed: 7,
    hasCub: false,
    waypoints: [
      { week: 0, lat: 71.2, lng: -150.5 },
      { week: 8, lat: 72.4, lng: -148.0 }, // 겨울 사냥터
      { week: 18, lat: 73.1, lng: -146.5 }, // 봄, 얼음 따라 북상
      { week: 26, lat: 71.0, lng: -152.0 }, // 여름, 얼음 후퇴 → 남하 수영
      { week: 30, lat: 70.3, lng: -149.5 }, // 상륙 근처
      { week: 40, lat: 71.6, lng: -147.0 }, // 가을, 다시 결빙 시작
      { week: 51, lat: 71.2, lng: -150.5 },
    ],
    pois: [
      { id: "den", lat: 72.4, lng: -148.0, label: "아눅의 굴", story: "겨울, 이 근처 눈 속에서 몸을 웅크려요.", icon: "🕳️" },
      { id: "hunt", lat: 73.1, lng: -146.5, label: "물범 사냥터", story: "봄철 개빙구역이 열리면 물범을 노려요.", icon: "🦭" },
      { id: "swim", lat: 71.0, lng: -152.0, label: "긴 수영 지점", story: "여름, 멀어진 얼음을 향해 헤엄친 구간.", icon: "🌊" },
      { id: "lastice", lat: 73.4, lng: -145.0, label: "마지막 얼음 지대", story: "가장 늦게까지 얼음이 남는 곳.", icon: "🧊" },
    ],
  },
  {
    id: "nova",
    name: "노바",
    source: "USGS · 대표 샘플",
    subpopulation: "척치해",
    subpopId: "CS",
    sex: "암컷",
    collarType: "GPS 목걸이",
    personality: "얼음 가장자리를 꼼꼼히 훑는 신중형",
    intro:
      "노바는 러시아와 알래스카 사이 척치해를 오가요. 이 무리는 비교적 먹이가 풍부한 해역에 기대어 삽니다.",
    years: "2023년 여정",
    seed: 21,
    hasCub: true,
    waypoints: [
      { week: 0, lat: 70.5, lng: -166.0 },
      { week: 9, lat: 71.4, lng: -168.5 },
      { week: 20, lat: 72.2, lng: -170.0 }, // 봄, 새끼와 함께 얼음 위
      { week: 27, lat: 70.0, lng: -164.5 }, // 여름 후퇴
      { week: 32, lat: 69.4, lng: -166.0 },
      { week: 42, lat: 71.0, lng: -169.0 },
      { week: 51, lat: 70.5, lng: -166.0 },
    ],
    pois: [
      { id: "den", lat: 71.4, lng: -168.5, label: "노바의 굴", story: "새끼가 태어난 겨울 굴.", icon: "🐾" },
      { id: "cub", lat: 72.2, lng: -170.0, label: "새끼와 첫 사냥터", story: "봄, 새끼에게 사냥을 가르쳐요.", icon: "🐻‍❄️" },
      { id: "lead", lat: 69.4, lng: -166.0, label: "열린 바다(개빙구역)", story: "얼음이 갈라진 틈. 물범이 숨 쉬러 올라와요.", icon: "🌊" },
    ],
  },
  {
    id: "winnie",
    name: "위니",
    source: "USGS · 대표 샘플",
    subpopulation: "서허드슨만",
    subpopId: "WH",
    sex: "수컷",
    collarType: "Argos 위성 목걸이",
    personality: "긴 단식기를 견디는 인내형",
    intro:
      "위니는 여름이면 허드슨만의 얼음이 완전히 녹아 육지에서 몇 달을 굶으며 기다려요. 이 무리는 결빙 시점 변화에 특히 민감합니다.",
    years: "2023년 여정",
    seed: 42,
    hasCub: false,
    waypoints: [
      { week: 0, lat: 59.5, lng: -91.0 }, // 겨울, 만 위 얼음
      { week: 10, lat: 60.8, lng: -88.5 },
      { week: 22, lat: 61.2, lng: -86.0 }, // 봄 사냥
      { week: 28, lat: 58.6, lng: -93.5 }, // 여름, 육지 상륙 (처칠 근처)
      { week: 36, lat: 58.4, lng: -94.0 }, // 단식기
      { week: 46, lat: 59.2, lng: -92.0 }, // 가을, 결빙 대기
      { week: 51, lat: 59.5, lng: -91.0 },
    ],
    pois: [
      { id: "hunt", lat: 61.2, lng: -86.0, label: "봄 사냥터", story: "얼음이 두꺼운 봄, 가장 잘 먹는 시기.", icon: "🦭" },
      { id: "land", lat: 58.6, lng: -93.5, label: "여름 상륙지", story: "얼음이 다 녹으면 이곳 육지로 올라와요.", icon: "🏝️" },
      { id: "fast", lat: 58.4, lng: -94.0, label: "단식의 해안", story: "여름 내내 거의 먹지 못하고 기다려요.", icon: "⏳" },
    ],
  },
];

export const BEARS: Bear[] = SEEDS.map((s) => {
  const track = buildTrack(s);
  return {
    id: s.id,
    name: s.name,
    source: s.source,
    subpopulation: s.subpopulation,
    subpopId: s.subpopId,
    sex: s.sex,
    collarType: s.collarType,
    personality: s.personality,
    intro: s.intro,
    years: s.years,
    bounds: boundsOf(track),
    track,
    pois: s.pois,
  };
});

export function getBear(id: string): Bear | undefined {
  return BEARS.find((b) => b.id === id);
}

export function totalKm(bear: Bear): number {
  return Math.round(bear.track.reduce((sum, p) => sum + p.stepKm, 0));
}

export function longestStep(bear: Bear): TrackPoint {
  return bear.track.reduce((a, b) => (b.stepKm > a.stepKm ? b : a));
}
