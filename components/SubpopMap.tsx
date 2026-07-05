"use client";

import { SUBPOPULATIONS, STATUS_COLOR, STATUS_LABEL } from "@/lib/ecosystem";

// PRD 6.4 북극 전체 지도 — 19개 아개체군을 상태별 색 점으로 (손그림 도식)
export default function SubpopMap({
  focus,
  onSelect,
}: {
  focus?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto" role="img" aria-label="북극 아개체군 지도">
      {/* 북극해 도식 원 */}
      <circle cx="50" cy="45" r="42" fill="#BFD4E3" opacity="0.35" stroke="#2B2A26" strokeWidth="0.4" strokeDasharray="1.5 1.5" />
      <text x="50" y="10" textAnchor="middle" fontSize="3.4" fill="#2B2A26" style={{ fontFamily: "var(--font-hand), cursive" }}>
        북극해
      </text>

      {SUBPOPULATIONS.map((s) => {
        const isFocus = focus === s.id;
        return (
          <g
            key={s.id}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            onClick={() => onSelect?.(s.id)}
          >
            <circle
              cx={s.x}
              cy={s.y}
              r={isFocus ? 3.6 : 2.4}
              fill={STATUS_COLOR[s.status]}
              stroke="#2B2A26"
              strokeWidth={isFocus ? 0.8 : 0.4}
            />
            {isFocus && (
              <circle cx={s.x} cy={s.y} r="5.2" fill="none" stroke="#D8592E" strokeWidth="0.6" strokeDasharray="1 1" />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
      {(["increasing", "stable", "declining", "unknown"] as const).map((k) => (
        <span key={k} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-full" style={{ background: STATUS_COLOR[k] }} />
          {STATUS_LABEL[k]}
        </span>
      ))}
    </div>
  );
}
