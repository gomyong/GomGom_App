import type { Season } from "./types";

export const SEASON_LABEL: Record<Season, string> = {
  winter: "겨울",
  spring: "봄",
  summer: "여름",
  fall: "가을",
};

export const SEASON_EMOJI: Record<Season, string> = {
  winter: "❄️",
  spring: "🌱",
  summer: "☀️",
  fall: "🍂",
};

export const POSE_LABEL: Record<string, string> = {
  hunting: "사냥 중",
  swimming: "헤엄치는 중",
  resting: "쉬는 중",
  fasting: "단식기",
  cub: "새끼와 함께",
};

// 날짜 → 보기 좋은 한글 표기
export function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일`;
}
