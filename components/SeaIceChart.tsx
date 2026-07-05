"use client";

import { SEA_ICE } from "@/lib/ecosystem";

const W = 640;
const H = 320;
const PAD = 52;

const INK = "#191c1e";
const OUTLINE = "#717786";
const GRID = "#eceef0";
const PRIMARY = "#0058bc";
const MONO = "'JetBrains Mono', monospace";

// PRD 6.4 해빙 시계열 — 데이터 퍼스트 라인 차트 (1979 이후 9월 최소 해빙)
export default function SeaIceChart() {
  const minY = 1979;
  const maxY = 2023;
  const maxV = 8;

  const px = (y: number) => PAD + ((y - minY) / (maxY - minY)) * (W - PAD * 1.5);
  const py = (v: number) => H - PAD - (v / maxV) * (H - PAD * 1.8);

  const pts = SEA_ICE.map((d) => [px(d.year), py(d.extentMkm2)] as const);
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1][0].toFixed(1)} ${H - PAD} L ${pts[0][0].toFixed(1)} ${H - PAD} Z`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label="1979년 이후 9월 최소 해빙 면적 추이"
    >
      {/* 수평 그리드 + y축 눈금 */}
      {[2, 4, 6, 8].map((v) => (
        <g key={v}>
          <line x1={PAD} y1={py(v)} x2={W - PAD / 2} y2={py(v)} stroke={GRID} strokeWidth="1" />
          <text x={PAD - 10} y={py(v) + 4} textAnchor="end" fontSize="11" fill={OUTLINE} fontFamily={MONO}>
            {v}
          </text>
        </g>
      ))}

      {/* 축 */}
      <line x1={PAD} y1={H - PAD} x2={W - PAD / 2} y2={H - PAD} stroke={INK} strokeWidth="1" />
      <line x1={PAD} y1={PAD / 2} x2={PAD} y2={H - PAD} stroke={INK} strokeWidth="1" />

      {/* x축 눈금 */}
      {[1979, 1995, 2012, 2023].map((y) => (
        <text key={y} x={px(y)} y={H - PAD + 20} textAnchor="middle" fontSize="11" fill={OUTLINE} fontFamily={MONO}>
          {y}
        </text>
      ))}

      {/* 면적 틴트 + 데이터 라인 */}
      <path d={areaPath} fill={PRIMARY} opacity="0.08" />
      <path d={linePath} fill="none" stroke={PRIMARY} strokeWidth="2" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#ffffff" stroke={PRIMARY} strokeWidth="1.5" />
      ))}

      {/* 축 라벨 */}
      <text x="8" y={PAD / 2 - 6} fontSize="11" fill={OUTLINE} fontFamily={MONO} letterSpacing="0.05em">
        M KM²
      </text>
    </svg>
  );
}
