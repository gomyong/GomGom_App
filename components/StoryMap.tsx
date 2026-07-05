"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import type { Bear } from "@/lib/types";
import { projector } from "@/lib/geo";
import { POSE_LABEL } from "@/lib/season";

const VIEW = { w: 800, h: 600, pad: 56 };
const NS = "http://www.w3.org/2000/svg";

// 디자인 가이드 팔레트
const INK = "#191c1e";
const OUTLINE = "#c1c6d7";
const GRID = "#f2f4f6";
const GLACIER = "#dae4ee";
const SURFACE_LOW = "#eceef0";
const PRIMARY = "#0070eb";
const PRIMARY_DEEP = "#0058bc";

interface Props {
  bear: Bear;
  index: number; // 현재 타임라인 위치
  onPoiTap?: (poiId: string) => void;
}

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

function monoText(x: number, y: number, s: string, size = 12, fill = INK, anchor = "start") {
  const t = el("text", {
    x,
    y,
    "text-anchor": anchor,
    "font-size": size,
    fill,
    "font-family": "'JetBrains Mono', monospace",
    "letter-spacing": "0.05em",
  });
  t.textContent = s;
  return t;
}

// 블루프린트 지도 — 흰 캔버스 + 32px 그리드 + 차콜 라인아트 + 블루 마커
export default function StoryMap({ bear, index, onPoiTap }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const project = projector(bear, VIEW);
    const g = el("g", {});
    svg.appendChild(g);

    // 캔버스 + 그리드 (블루프린트)
    g.appendChild(el("rect", { x: 0, y: 0, width: VIEW.w, height: VIEW.h, fill: "#ffffff" }));
    for (let x = 32; x < VIEW.w; x += 32) {
      g.appendChild(el("line", { x1: x, y1: 0, x2: x, y2: VIEW.h, stroke: GRID, "stroke-width": 1 }));
    }
    for (let y = 32; y < VIEW.h; y += 32) {
      g.appendChild(el("line", { x1: 0, y1: y, x2: VIEW.w, y2: y, stroke: GRID, "stroke-width": 1 }));
    }

    // 팩아이스(해빙) 영역 — 글레이셔 틴트 + 점선 경계
    const ice = rc.polygon(
      [
        [VIEW.w * 0.16, 24],
        [VIEW.w * 0.9, 40],
        [VIEW.w * 0.82, VIEW.h * 0.46],
        [VIEW.w * 0.4, VIEW.h * 0.4],
        [VIEW.w * 0.12, VIEW.h * 0.3],
      ],
      {
        fill: GLACIER,
        fillStyle: "solid",
        stroke: OUTLINE,
        strokeWidth: 1,
        roughness: 0.9,
        strokeLineDash: [6, 5],
      }
    );
    ice.setAttribute("opacity", "0.65");
    g.appendChild(ice);
    g.appendChild(monoText(VIEW.w * 0.62, VIEW.h * 0.16, "PACK ICE · 해빙", 11, "#717786"));

    // 육지 — 라이트 그레이 필 + 차콜 1px 아웃라인
    g.appendChild(
      rc.polygon(
        [
          [16, VIEW.h - 16],
          [VIEW.w * 0.44, VIEW.h - 16],
          [VIEW.w * 0.34, VIEW.h - VIEW.pad * 1.9],
          [VIEW.w * 0.14, VIEW.h - VIEW.pad * 1.5],
          [16, VIEW.h - VIEW.pad * 1.7],
        ],
        { fill: SURFACE_LOW, fillStyle: "solid", stroke: INK, strokeWidth: 1, roughness: 1 }
      )
    );
    g.appendChild(monoText(48, VIEW.h - 40, "TUNDRA · 육지", 11, "#717786"));

    // 여정 경로 — 가이드: 이동 히스토리는 차콜 점선
    const pts = bear.track.map((p) => project(p.lat, p.lng));
    const drawPath = (from: number, to: number, color: string, opacity: number, width: number) => {
      if (to - from < 1) return;
      const seg = pts.slice(from, to + 1);
      const node = rc.linearPath(seg as [number, number][], {
        stroke: color,
        strokeWidth: width,
        roughness: 0.8,
        strokeLineDash: [1.5, 6],
      });
      node.setAttribute("opacity", String(opacity));
      g.appendChild(node);
    };
    drawPath(index, pts.length - 1, OUTLINE, 0.9, 1.6); // 앞으로 갈 길 — 옅게
    drawPath(0, index, INK, 0.95, 2); // 지나온 길 — 차콜

    // 시작점 표기
    const [sx, sy] = pts[0];
    g.appendChild(el("circle", { cx: sx, cy: sy, r: 3.5, fill: "#ffffff", stroke: INK, "stroke-width": 1.2 }));
    g.appendChild(monoText(sx + 8, sy + 4, "START", 10, "#717786"));

    // POI — 서클 마커 + 모노 라벨 박스
    for (const poi of bear.pois) {
      const [px, py] = project(poi.lat, poi.lng);
      const hit = el("g", {});
      hit.style.cursor = "pointer";
      hit.addEventListener("click", () => onPoiTap?.(poi.id));
      g.appendChild(hit);

      hit.appendChild(el("circle", { cx: px, cy: py, r: 10, fill: PRIMARY, "fill-opacity": 0.12 }));
      hit.appendChild(el("circle", { cx: px, cy: py, r: 4, fill: "#ffffff", stroke: PRIMARY_DEEP, "stroke-width": 1.4 }));

      const label = poi.label;
      const bw = label.length * 11.5 + 16;
      // 라벨 박스가 캔버스 밖으로 나가지 않게 클램프
      const lx = Math.max(8, Math.min(px + 8, VIEW.w - bw - 8));
      const ly = Math.max(8, py - 24);
      hit.appendChild(
        el("rect", {
          x: lx,
          y: ly,
          width: bw,
          height: 20,
          rx: 2,
          fill: "#ffffff",
          stroke: OUTLINE,
          "stroke-width": 1,
        })
      );
      const lt = el("text", {
        x: lx + 8,
        y: ly + 14,
        "font-size": 11.5,
        fill: INK,
        "font-family": "'JetBrains Mono', 'Pretendard', monospace",
      });
      lt.textContent = label;
      hit.appendChild(lt);
    }

    // 곰 마커 (현재 위치) — 블루 도트 + 펄스 링 (가이드 컴포넌트 규칙)
    const [bx, by] = pts[Math.min(index, pts.length - 1)];
    const marker = el("g", {});
    g.appendChild(marker);

    const ring = el("circle", { cx: bx, cy: by, r: 16, fill: PRIMARY, "fill-opacity": 0.18 });
    ring.classList.add("pulse-ring");
    marker.appendChild(ring);
    marker.appendChild(el("circle", { cx: bx, cy: by, r: 9, fill: PRIMARY, "fill-opacity": 0.15 }));
    marker.appendChild(el("circle", { cx: bx, cy: by, r: 6.5, fill: PRIMARY_DEEP, stroke: "#ffffff", "stroke-width": 2 }));

    // 상태 라벨 박스 — "이름 · 포즈"
    const point = bear.track[Math.min(index, bear.track.length - 1)];
    const tag = `${bear.name} · ${POSE_LABEL[point.pose]}`;
    const tw = tag.length * 12 + 20;
    const tagX = Math.min(bx + 12, VIEW.w - tw - 12);
    const tagY = Math.max(by - 46, 12);
    marker.appendChild(
      el("rect", { x: tagX, y: tagY, width: tw, height: 26, rx: 2, fill: "#ffffff", stroke: INK, "stroke-width": 1 })
    );
    const tagText = el("text", {
      x: tagX + 10,
      y: tagY + 17.5,
      "font-size": 12.5,
      "font-weight": 600,
      fill: PRIMARY_DEEP,
      "font-family": "'JetBrains Mono', 'Pretendard', monospace",
    });
    tagText.textContent = tag;
    marker.appendChild(tagText);

    // 나침반 — 미니멀 크로스헤어
    const cx = VIEW.w - 48;
    const cy = 48;
    g.appendChild(el("circle", { cx, cy, r: 22, fill: "#ffffff", stroke: OUTLINE, "stroke-width": 1 }));
    g.appendChild(el("line", { x1: cx, y1: cy - 14, x2: cx, y2: cy + 14, stroke: OUTLINE, "stroke-width": 1 }));
    g.appendChild(el("line", { x1: cx - 14, y1: cy, x2: cx + 14, y2: cy, stroke: OUTLINE, "stroke-width": 1 }));
    g.appendChild(el("path", { d: `M ${cx} ${cy - 14} l 4 8 h-8 Z`, fill: PRIMARY_DEEP }));
    g.appendChild(monoText(cx, cy - 28, "N", 11, INK, "middle"));

    // 현재 좌표 판독 (필드 노트 감성)
    g.appendChild(
      monoText(16, 28, `${point.lat.toFixed(4)}° N, ${Math.abs(point.lng).toFixed(4)}° W`, 12, "#414755")
    );
  }, [bear, index, onPoiTap]);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className="h-auto w-full select-none"
      role="img"
      aria-label={`${bear.name}의 여정 지도`}
    />
  );
}
