"use client";

import { useEffect, useRef, useState } from "react";
import type { Bear } from "@/lib/types";
import { projector } from "@/lib/geo";
import { totalKm, longestStep } from "@/lib/bears";
import { SEASON_LABEL } from "@/lib/season";
import { ShareIcon } from "./icons";

const W = 640;
const H = 800;
const NS = "http://www.w3.org/2000/svg";

const INK = "#191c1e";
const OUTLINE = "#c1c6d7";
const GRID = "#f2f4f6";
const MUTED = "#717786";
const PRIMARY = "#0058bc";
const PRIMARY_BRIGHT = "#0070eb";
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Hanken Grotesk', Pretendard, system-ui, sans-serif";

function el<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

// PRD 6.5 여정 카드 — 필드 리포트 스타일 공유 카드
export default function JourneyCard({ bear }: { bear: Bear }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const text = (
      x: number,
      y: number,
      s: string,
      size: number,
      color = INK,
      opts: { mono?: boolean; weight?: number; anchor?: string; spacing?: string } = {}
    ) => {
      const t = el("text", {
        x,
        y,
        "text-anchor": opts.anchor ?? "middle",
        "font-size": size,
        fill: color,
        "font-family": opts.mono ? MONO : SANS,
        "font-weight": opts.weight ?? 400,
      });
      if (opts.spacing) t.setAttribute("letter-spacing", opts.spacing);
      t.textContent = s;
      svg.appendChild(t);
    };

    // 배경 + 프레임 (1px 테크니컬 보더)
    svg.appendChild(el("rect", { width: W, height: H, fill: "#ffffff" }));
    svg.appendChild(el("rect", { x: 16, y: 16, width: W - 32, height: H - 32, fill: "none", stroke: INK, "stroke-width": 1.5 }));
    svg.appendChild(el("rect", { x: 22, y: 22, width: W - 44, height: H - 44, fill: "none", stroke: OUTLINE, "stroke-width": 0.75 }));

    // 헤더
    text(W / 2, 72, "FIELD REPORT · 곰곰", 13, MUTED, { mono: true, spacing: "0.15em" });
    text(W / 2, 116, `${bear.name}의 여정`, 40, INK, { weight: 700 });
    text(W / 2, 146, `${bear.subpopulation} · ${bear.years}`, 15, MUTED, { mono: true });

    // 지도 영역 — 그리드 캔버스
    const map = { x: 56, y: 176, w: W - 112, h: 330 };
    svg.appendChild(el("rect", { x: map.x, y: map.y, width: map.w, height: map.h, fill: "#ffffff", stroke: INK, "stroke-width": 1 }));
    const clipId = "cardMapClip";
    const clip = el("clipPath", { id: clipId });
    clip.appendChild(el("rect", { x: map.x, y: map.y, width: map.w, height: map.h }));
    svg.appendChild(clip);
    const mg = el("g", { "clip-path": `url(#${clipId})` });
    svg.appendChild(mg);
    for (let gx = map.x + 24; gx < map.x + map.w; gx += 24) {
      mg.appendChild(el("line", { x1: gx, y1: map.y, x2: gx, y2: map.y + map.h, stroke: GRID, "stroke-width": 1 }));
    }
    for (let gy = map.y + 24; gy < map.y + map.h; gy += 24) {
      mg.appendChild(el("line", { x1: map.x, y1: gy, x2: map.x + map.w, y2: gy, stroke: GRID, "stroke-width": 1 }));
    }

    // 경로 — 차콜 점선
    const project = projector(bear, { w: map.w, h: map.h, pad: 36 });
    const pts = bear.track.map((p) => {
      const [x, y] = project(p.lat, p.lng);
      return [x + map.x, y + map.y] as [number, number];
    });
    const d = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    mg.appendChild(el("path", { d, fill: "none", stroke: INK, "stroke-width": 1.8, "stroke-dasharray": "2 6", "stroke-linecap": "round" }));

    // 시작/끝 마커
    const [sx, sy] = pts[0];
    const [ex, ey] = pts[pts.length - 1];
    mg.appendChild(el("circle", { cx: sx, cy: sy, r: 4, fill: "#ffffff", stroke: INK, "stroke-width": 1.4 }));
    mg.appendChild(el("circle", { cx: ex, cy: ey, r: 9, fill: PRIMARY_BRIGHT, "fill-opacity": 0.15 }));
    mg.appendChild(el("circle", { cx: ex, cy: ey, r: 5.5, fill: PRIMARY, stroke: "#ffffff", "stroke-width": 2 }));

    // 임팩트 수치 — 2열 데이터 블록
    const statY = 560;
    svg.appendChild(el("line", { x1: W / 2, y1: statY - 28, x2: W / 2, y2: statY + 34, stroke: OUTLINE, "stroke-width": 1 }));
    text(W / 2 - 130, statY - 8, "DISTANCE / YR", 11, MUTED, { mono: true, spacing: "0.1em" });
    text(W / 2 - 130, statY + 28, `${totalKm(bear).toLocaleString()} km`, 34, INK, { mono: true, weight: 700 });
    text(W / 2 + 130, statY - 8, "LONGEST LEG", 11, MUTED, { mono: true, spacing: "0.1em" });
    text(W / 2 + 130, statY + 28, `${Math.round(longestStep(bear).stepKm)} km`, 34, PRIMARY, { mono: true, weight: 700 });
    text(W / 2 + 130, statY + 52, `${SEASON_LABEL[longestStep(bear).season]} 최장 주간 이동`, 12, MUTED);

    // 푸터
    svg.appendChild(el("line", { x1: 56, y1: 660, x2: W - 56, y2: 660, stroke: OUTLINE, "stroke-width": 0.75 }));
    text(W / 2, 692, bear.personality, 17, INK, { weight: 600 });
    text(W / 2, 724, "곰곰에서 당신의 곰을 만나보세요", 14, MUTED);
    text(W / 2, 756, "GOMGOM · POLAR BEAR JOURNEY TRACKER", 10, OUTLINE, { mono: true, spacing: "0.15em" });
  }, [bear]);

  const download = async () => {
    const svg = svgRef.current;
    if (!svg) return;
    setBusy(true);
    setMsg(null);
    try {
      const xml = new XMLSerializer().serializeToString(svg);
      const svg64 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml);
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error("이미지 변환 실패"));
        img.src = svg64;
      });
      const canvas = document.createElement("canvas");
      canvas.width = W * 2;
      canvas.height = H * 2;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);
      const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("PNG 생성 실패");

      const file = new File([blob], `gomgom-${bear.id}.png`, { type: "image/png" });
      // Web Share (모바일/아이패드) 우선, 안되면 다운로드
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `${bear.name}의 여정`, text: "곰곰에서 만난 내 북극곰" });
        setMsg("공유했어요.");
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gomgom-${bear.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg("이미지를 저장했어요.");
      }
    } catch (e) {
      setMsg("저장에 실패했어요. 스크린샷으로 대신 공유해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-outline-variant bg-card">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${bear.name} 여정 카드`} />
      </div>
      <button
        onClick={download}
        disabled={busy}
        className="press-offset mt-4 flex w-full items-center justify-center gap-2 rounded border border-ink bg-primary py-3 font-semibold text-white transition-colors ease-slow hover:bg-primary-bright disabled:opacity-50"
      >
        <ShareIcon className="h-4 w-4" />
        {busy ? "만드는 중…" : "카드 공유·저장하기"}
      </button>
      {msg && <p className="mt-2 text-center text-sm text-muted">{msg}</p>}
    </div>
  );
}
