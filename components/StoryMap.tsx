"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Bear } from "@/lib/types";
import { projector } from "@/lib/geo";

const VIEW = { w: 800, h: 600, pad: 48 };

const POSE_EMOJI: Record<string, string> = {
  hunting: "🐻‍❄️",
  swimming: "🏊",
  resting: "😴",
  fasting: "🐻‍❄️",
  cub: "🐾",
};

interface Props {
  bear: Bear;
  index: number; // 현재 타임라인 위치
  onPoiTap?: (poiId: string) => void;
  dark?: boolean;
}

export default function StoryMap({ bear, index, onPoiTap, dark }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    // 초기화
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const project = projector(bear, VIEW);
    const ink = dark ? "#F5EFE2" : "#2B2A26";
    const paper = dark ? "#1B2430" : "#F5EFE2";
    const paleice = dark ? "#2E4257" : "#BFD4E3";
    const sand = "#E9B872";
    const coral = "#D8592E";
    const ns = "http://www.w3.org/2000/svg";

    const g = document.createElementNS(ns, "g");
    svg.appendChild(g);

    // 바다/해빙 배경 면 (옅은 블루 fill)
    g.appendChild(
      rc.rectangle(VIEW.pad / 2, VIEW.pad / 2, VIEW.w - VIEW.pad, VIEW.h - VIEW.pad, {
        fill: paleice,
        fillStyle: "solid",
        stroke: ink,
        strokeWidth: 1.5,
        roughness: 1.6,
      })
    );

    // 해빙 해칭 (얼음 면 — hatching, PRD 5.5)
    g.appendChild(
      rc.rectangle(VIEW.pad / 2 + 12, VIEW.pad / 2 + 12, (VIEW.w - VIEW.pad) * 0.5, (VIEW.h - VIEW.pad) * 0.45, {
        fill: paper,
        fillStyle: "hachure",
        hachureAngle: 35,
        hachureGap: 10,
        stroke: paleice,
        strokeWidth: 0.8,
        roughness: 1.4,
      })
    );

    // 육지/툰드라 (샌드 앰버 점묘) — 지도 하단 모서리에 배치
    g.appendChild(
      rc.polygon(
        [
          [VIEW.pad / 2, VIEW.h - VIEW.pad / 2],
          [VIEW.w * 0.42, VIEW.h - VIEW.pad / 2],
          [VIEW.w * 0.3, VIEW.h - VIEW.pad * 1.8],
          [VIEW.pad / 2, VIEW.h - VIEW.pad * 1.4],
        ],
        { fill: sand, fillStyle: "dots", fillWeight: 1.2, stroke: ink, strokeWidth: 1.2, roughness: 1.8 }
      )
    );

    // 여정 경로 — 지나온 길(진하게) / 앞으로 갈 길(흐리게), 점선 트레일
    const pts = bear.track.map((p) => project(p.lat, p.lng));

    const drawPath = (from: number, to: number, color: string, opacity: number, width: number) => {
      if (to - from < 1) return;
      const seg = pts.slice(from, to + 1);
      const node = rc.linearPath(seg as [number, number][], {
        stroke: color,
        strokeWidth: width,
        roughness: 1.5,
        strokeLineDash: [2, 9],
      });
      node.setAttribute("opacity", String(opacity));
      g.appendChild(node);
    };
    // 앞으로 갈 길 (흐리게)
    drawPath(index, pts.length - 1, ink, 0.28, 2);
    // 지나온 길 (진하게, 코랄)
    drawPath(0, index, coral, 0.9, 3);

    // POI — 손글씨 라벨 + 아이콘
    for (const poi of bear.pois) {
      const [px, py] = project(poi.lat, poi.lng);
      const dot = rc.circle(px, py, 16, {
        fill: coral,
        fillStyle: "solid",
        stroke: ink,
        strokeWidth: 1.2,
        roughness: 1.5,
      });
      dot.style.cursor = "pointer";
      dot.addEventListener("click", () => onPoiTap?.(poi.id));
      g.appendChild(dot);

      const icon = document.createElementNS(ns, "text");
      icon.setAttribute("x", String(px));
      icon.setAttribute("y", String(py - 14));
      icon.setAttribute("text-anchor", "middle");
      icon.setAttribute("font-size", "18");
      icon.textContent = poi.icon;
      icon.style.cursor = "pointer";
      icon.addEventListener("click", () => onPoiTap?.(poi.id));
      g.appendChild(icon);

      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", String(px + 12));
      label.setAttribute("y", String(py + 4));
      label.setAttribute("font-size", "15");
      label.setAttribute("fill", ink);
      label.setAttribute("font-family", "var(--font-hand), cursive");
      label.textContent = poi.label;
      g.appendChild(label);
    }

    // 곰 마커 (현재 위치) — 손그림 실루엣
    const [bx, by] = pts[Math.min(index, pts.length - 1)];
    const bear_g = document.createElementNS(ns, "g");
    g.appendChild(bear_g);
    // 몸통 (크림 타원)
    bear_g.appendChild(
      rc.ellipse(bx, by, 34, 24, {
        fill: dark ? "#E8E2D4" : "#FFFFFF",
        fillStyle: "solid",
        stroke: ink,
        strokeWidth: 1.6,
        roughness: 1.3,
      })
    );
    // 코랄 코 포인트
    bear_g.appendChild(
      rc.circle(bx + 14, by - 2, 6, { fill: coral, fillStyle: "solid", stroke: ink, strokeWidth: 1, roughness: 1 })
    );
    // 포즈 이모지 (상태 표시)
    const emoji = document.createElementNS(ns, "text");
    emoji.setAttribute("x", String(bx));
    emoji.setAttribute("y", String(by - 22));
    emoji.setAttribute("text-anchor", "middle");
    emoji.setAttribute("font-size", "22");
    emoji.textContent = POSE_EMOJI[bear.track[Math.min(index, bear.track.length - 1)].pose] ?? "🐻‍❄️";
    bear_g.appendChild(emoji);

    // 나침반 (위트 있는 방위, PRD 5.5)
    const compass = document.createElementNS(ns, "g");
    g.appendChild(compass);
    compass.appendChild(
      rc.circle(VIEW.w - 60, 64, 44, { stroke: ink, strokeWidth: 1.4, roughness: 1.8, fill: paper, fillStyle: "solid" })
    );
    const nLabel = document.createElementNS(ns, "text");
    nLabel.setAttribute("x", String(VIEW.w - 60));
    nLabel.setAttribute("y", "52");
    nLabel.setAttribute("text-anchor", "middle");
    nLabel.setAttribute("font-size", "16");
    nLabel.setAttribute("fill", coral);
    nLabel.setAttribute("font-family", "var(--font-hand), cursive");
    nLabel.textContent = "북";
    compass.appendChild(nLabel);
  }, [bear, index, onPoiTap, dark]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="w-full h-auto select-none"
      role="img"
      aria-label={`${bear.name}의 여정 지도`}
    />
  );
}
