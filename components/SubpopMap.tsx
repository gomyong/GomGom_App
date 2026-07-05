"use client";

import { SUBPOPULATIONS, STATUS_COLOR, STATUS_LABEL } from "@/lib/ecosystem";

// PRD 6.4 북극 전체 지도 — 19개 아개체군 상태 도트 (블루프린트 도식)
export default function SubpopMap({
  focus,
  onSelect,
}: {
  focus?: string | null;
  onSelect?: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 100 100" className="h-auto w-full" role="img" aria-label="북극 아개체군 지도">
      {/* 그리드 배경 */}
      {Array.from({ length: 11 }, (_, i) => i * 10).map((v) => (
        <g key={v}>
          <line x1={v} y1="0" x2={v} y2="100" stroke="#f2f4f6" strokeWidth="0.3" />
          <line x1="0" y1={v} x2="100" y2={v} stroke="#f2f4f6" strokeWidth="0.3" />
        </g>
      ))}

      {/* 북극해 도식 원 — 점선 아웃라인 */}
      <circle cx="50" cy="45" r="42" fill="#dae4ee" opacity="0.4" stroke="#717786" strokeWidth="0.35" strokeDasharray="1.6 1.4" />
      <text
        x="50"
        y="9"
        textAnchor="middle"
        fontSize="3.2"
        fill="#717786"
        letterSpacing="0.4"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        ARCTIC OCEAN
      </text>

      {SUBPOPULATIONS.map((s) => {
        const isFocus = focus === s.id;
        return (
          <g
            key={s.id}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            onClick={() => onSelect?.(s.id)}
          >
            {isFocus && (
              <circle cx={s.x} cy={s.y} r="5" fill={STATUS_COLOR[s.status]} opacity="0.15" />
            )}
            <circle
              cx={s.x}
              cy={s.y}
              r={isFocus ? 2.6 : 1.9}
              fill={STATUS_COLOR[s.status]}
              stroke="#ffffff"
              strokeWidth={isFocus ? 0.7 : 0.5}
            />
            {isFocus && (
              <text
                x={s.x}
                y={s.y - 4.5}
                textAnchor="middle"
                fontSize="3"
                fill="#191c1e"
                fontWeight="600"
                style={{ fontFamily: "'JetBrains Mono', 'Pretendard', monospace" }}
              >
                {s.id}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function StatusLegend() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {(["increasing", "stable", "declining", "unknown"] as const).map((k) => (
        <span key={k} className="flex items-center gap-1.5 text-xs text-muted">
          <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[k] }} />
          {STATUS_LABEL[k]}
        </span>
      ))}
    </div>
  );
}
