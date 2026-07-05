"use client";

import { useEffect, useRef } from "react";
import rough from "roughjs";
import { SEA_ICE } from "@/lib/ecosystem";

const W = 640;
const H = 320;
const PAD = 48;

// PRD 6.4 해빙 시계열 — 손그림 라인 차트 (1979 이후 9월 최소 해빙)
export default function SeaIceChart() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const ns = "http://www.w3.org/2000/svg";
    const ink = "#2B2A26";
    const ice = "#3D6FA8";

    const years = SEA_ICE.map((d) => d.year);
    const vals = SEA_ICE.map((d) => d.extentMkm2);
    const minY = 1979;
    const maxY = 2023;
    const maxV = 8;

    const px = (y: number) => PAD + ((y - minY) / (maxY - minY)) * (W - PAD * 1.5);
    const py = (v: number) => H - PAD - (v / maxV) * (H - PAD * 1.8);

    // 축
    svg.appendChild(rc.line(PAD, H - PAD, W - PAD / 2, H - PAD, { stroke: ink, roughness: 1.5 }));
    svg.appendChild(rc.line(PAD, PAD / 2, PAD, H - PAD, { stroke: ink, roughness: 1.5 }));

    // y축 눈금
    for (const v of [2, 4, 6, 8]) {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", String(PAD - 8));
      t.setAttribute("y", String(py(v) + 4));
      t.setAttribute("text-anchor", "end");
      t.setAttribute("font-size", "12");
      t.setAttribute("fill", ink);
      t.textContent = String(v);
      svg.appendChild(t);
    }
    // x축 눈금
    for (const y of [1979, 1995, 2012, 2023]) {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", String(px(y)));
      t.setAttribute("y", String(H - PAD + 18));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("font-size", "12");
      t.setAttribute("fill", ink);
      t.textContent = String(y);
      svg.appendChild(t);
    }

    // 손그림 라인
    const pts = SEA_ICE.map((d) => [px(d.year), py(d.extentMkm2)]) as [number, number][];
    svg.appendChild(rc.linearPath(pts, { stroke: ice, strokeWidth: 3, roughness: 1.3 }));
    // 점
    for (const [x, y] of pts) {
      svg.appendChild(
        rc.circle(x, y, 7, { fill: ice, fillStyle: "solid", stroke: ink, strokeWidth: 0.8, roughness: 1 })
      );
    }

    // 축 라벨
    const yl = document.createElementNS(ns, "text");
    yl.setAttribute("x", "6");
    yl.setAttribute("y", String(PAD / 2 - 4));
    yl.setAttribute("font-size", "12");
    yl.setAttribute("fill", ink);
    yl.textContent = "백만 km²";
    svg.appendChild(yl);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label="1979년 이후 9월 최소 해빙 면적 추이"
    />
  );
}
