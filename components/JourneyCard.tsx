"use client";

import { useEffect, useRef, useState } from "react";
import rough from "roughjs";
import type { Bear } from "@/lib/types";
import { projector } from "@/lib/geo";
import { totalKm, longestStep } from "@/lib/bears";
import { SEASON_LABEL } from "@/lib/season";

const W = 640;
const H = 800;

// PRD 6.5 여정 카드 — 손그림 엽서 이미지, 공유 자산
export default function JourneyCard({ bear }: { bear: Bear }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const rc = rough.svg(svg);
    const ns = "http://www.w3.org/2000/svg";
    const ink = "#2B2A26";
    const coral = "#D8592E";
    const paper = "#F5EFE2";
    const paleice = "#BFD4E3";

    // 배경
    const bg = document.createElementNS(ns, "rect");
    bg.setAttribute("width", String(W));
    bg.setAttribute("height", String(H));
    bg.setAttribute("fill", paper);
    svg.appendChild(bg);

    // 프레임
    svg.appendChild(
      rc.rectangle(20, 20, W - 40, H - 40, { stroke: ink, strokeWidth: 2, roughness: 1.6 })
    );

    // 지도 영역
    const mapView = { w: W, h: 420, pad: 90 };
    const project = projector(bear, mapView);
    svg.appendChild(
      rc.rectangle(60, 150, W - 120, 340, { fill: paleice, fillStyle: "solid", stroke: ink, strokeWidth: 1.4, roughness: 1.4 })
    );
    // 경로
    const pts = bear.track.map((p) => {
      const [x, y] = project(p.lat, p.lng);
      return [x, y + 60] as [number, number];
    });
    svg.appendChild(rc.linearPath(pts, { stroke: coral, strokeWidth: 3, roughness: 1.4, strokeLineDash: [2, 8] }));
    // 시작/끝 표시
    const start = pts[0];
    const end = pts[pts.length - 1];
    svg.appendChild(rc.circle(start[0], start[1], 12, { fill: ink, fillStyle: "solid", stroke: ink, roughness: 1 }));
    svg.appendChild(rc.circle(end[0], end[1], 16, { fill: coral, fillStyle: "solid", stroke: ink, strokeWidth: 1.4, roughness: 1 }));

    const text = (x: number, y: number, s: string, size: number, color: string, hand = false, anchor = "middle") => {
      const t = document.createElementNS(ns, "text");
      t.setAttribute("x", String(x));
      t.setAttribute("y", String(y));
      t.setAttribute("text-anchor", anchor);
      t.setAttribute("font-size", String(size));
      t.setAttribute("fill", color);
      if (hand) t.setAttribute("font-family", "Gaegu, var(--font-hand), cursive");
      else t.setAttribute("font-family", "Pretendard, system-ui, sans-serif");
      t.textContent = s;
      svg.appendChild(t);
    };

    text(W / 2, 80, `${bear.name}의 여정`, 44, coral, true);
    text(W / 2, 118, `${bear.subpopulation} · ${bear.years}`, 20, ink);

    // 하단 임팩트 수치
    text(W / 2 - 130, 570, `${totalKm(bear).toLocaleString()}`, 48, coral, false);
    text(W / 2 - 130, 600, "km 이동", 18, ink);
    text(W / 2 + 130, 570, `${Math.round(longestStep(bear).stepKm)}`, 48, "#3D6FA8", false);
    text(W / 2 + 130, 600, `${SEASON_LABEL[longestStep(bear).season]} 최장 이동(km)`, 15, ink);

    text(W / 2, 690, bear.personality, 20, ink, true);
    text(W / 2, 740, "곰곰에서 당신의 곰을 만나보세요 🐾", 20, ink, true);
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
        setMsg("공유했어요 🐾");
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gomgom-${bear.id}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setMsg("이미지를 저장했어요 🐾");
      }
    } catch (e) {
      setMsg("저장에 실패했어요. 스크린샷으로 대신 공유해 주세요.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border-2 border-ink/80 shadow-card">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`${bear.name} 여정 카드`} />
      </div>
      <button
        onClick={download}
        disabled={busy}
        className="mt-4 w-full rounded-full border-2 border-ink/80 bg-coral py-3 font-hand text-xl text-paper shadow-card ease-slow hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "만드는 중…" : "📤 카드 공유·저장하기"}
      </button>
      {msg && <p className="mt-2 text-center text-sm text-ink/70">{msg}</p>}
    </div>
  );
}
