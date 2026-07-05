"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import SeaIceChart from "@/components/SeaIceChart";
import SubpopMap, { StatusLegend } from "@/components/SubpopMap";
import {
  SUBPOPULATIONS,
  STATUS_LABEL,
  STATUS_COLOR,
  SOURCES,
  statusCounts,
  subpopById,
} from "@/lib/ecosystem";
import { BEARS } from "@/lib/bears";

function EcosystemInner() {
  const params = useSearchParams();
  const initialFocus = params.get("focus");
  const [focus, setFocus] = useState<string | null>(initialFocus);
  const counts = statusCounts();
  const focused = focus ? subpopById(focus) : undefined;
  const focusBear = BEARS.find((b) => b.subpopId === focus);

  return (
    <main className="mx-auto max-w-3xl px-5 pb-28 pt-8">
      <div className="ribbon text-lg">생태계 대시보드</div>
      <h1 className="mt-4 font-hand text-4xl font-bold text-ink">한 마리에서 전체로</h1>
      <p className="mt-2 text-ink/70">
        아눅 같은 곰이 북극 전체에 약 3만 마리. 그중 어떤 무리는 늘고, 어떤 무리는
        줄고, 많은 무리는 아직 알 수 없어요.
      </p>

      {/* 내 곰 브릿지 */}
      {focused && (
        <div className="mt-6 rounded-2xl border-2 border-coral bg-coral/10 p-4">
          <p className="text-ink/90">
            {focusBear && (
              <>
                <span className="font-hand text-xl font-bold text-coral">
                  {focusBear.name}
                </span>
                은(는){" "}
              </>
            )}
            <span className="font-semibold">{focused.name}</span> 무리 소속이에요.{" "}
            <span
              className="rounded px-1.5 py-0.5 text-sm text-paper"
              style={{ background: STATUS_COLOR[focused.status] }}
            >
              {STATUS_LABEL[focused.status]}
            </span>{" "}
            — {focused.note}
          </p>
        </div>
      )}

      {/* 아개체군 지도 */}
      <section className="mt-8">
        <h2 className="font-hand text-2xl font-bold text-ink">19개 아개체군</h2>
        <div className="mt-3 rounded-2xl border-2 border-ink/80 bg-paper p-4 shadow-card">
          <SubpopMap focus={focus} onSelect={setFocus} />
          <div className="mt-3">
            <StatusLegend />
          </div>
        </div>

        {/* 상태 요약 — 단정하지 않음 (PRD 11장) */}
        <div className="mt-3 grid grid-cols-4 gap-2 text-center">
          {(["increasing", "stable", "declining", "unknown"] as const).map((k) => (
            <div key={k} className="rounded-xl border-2 border-ink/70 bg-paper py-3">
              <div className="text-2xl font-bold tabular-nums" style={{ color: STATUS_COLOR[k] }}>
                {counts[k]}
              </div>
              <div className="text-xs text-ink/60">{STATUS_LABEL[k]}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-ink/60">
          19개 중 {counts.unknown}개는 데이터가 부족해 추세를 알 수 없어요. 하나의
          수치로 낙관도 비관도 단정하지 않아요.
        </p>

        {/* 선택된 무리 상세 */}
        {focused && (
          <div className="mt-4 rounded-2xl border-2 border-ink/80 bg-paper p-4 shadow-card">
            <div className="flex items-center justify-between">
              <h3 className="font-hand text-2xl font-bold text-ink">{focused.name}</h3>
              <span
                className="rounded-full px-3 py-1 text-sm text-paper"
                style={{ background: STATUS_COLOR[focused.status] }}
              >
                {STATUS_LABEL[focused.status]}
              </span>
            </div>
            <p className="mt-2 text-ink/80">{focused.note}</p>
            <p className="mt-2 text-sm text-ink/60">
              추정 개체수:{" "}
              {focused.estimate ? `약 ${focused.estimate.toLocaleString()}마리` : "데이터 부족"}
            </p>
          </div>
        )}
      </section>

      {/* 해빙 시계열 */}
      <section className="mt-10">
        <h2 className="font-hand text-2xl font-bold text-ink">여름 해빙, 어떻게 변해왔나</h2>
        <p className="mt-1 text-sm text-ink/70">
          1979년 이후 9월 최소 해빙 면적(백만 km²). 곰의 사냥터는 이 얼음 위에 있어요.
        </p>
        <div className="mt-3 rounded-2xl border-2 border-ink/80 bg-paper p-4 shadow-card">
          <SeaIceChart />
        </div>
      </section>

      {/* 전체 목록 */}
      <section className="mt-10">
        <h2 className="font-hand text-2xl font-bold text-ink">전체 아개체군</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border-2 border-ink/80">
          {SUBPOPULATIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setFocus(s.id)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left ease-slow ${
                i % 2 ? "bg-paper" : "bg-paleice/20"
              } ${focus === s.id ? "ring-2 ring-inset ring-coral" : ""}`}
            >
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: STATUS_COLOR[s.status] }} />
              <span className="flex-1 text-ink/90">{s.name}</span>
              <span className="text-sm text-ink/50">
                {s.estimate ? `${s.estimate.toLocaleString()}마리` : "—"}
              </span>
              <span className="w-10 text-right text-sm text-ink/60">{STATUS_LABEL[s.status]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 출처 (PRD 11장 원칙 2) */}
      <section className="mt-10">
        <h2 className="font-hand text-2xl font-bold text-ink">출처</h2>
        <ul className="mt-3 space-y-2">
          {SOURCES.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="text-ice underline underline-offset-2"
              >
                {src.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-ink/50">
          곰곰은 정치화된 논쟁에 편승하지 않아요. "이 곰이 실제로 이렇게
          움직였다"는 관찰에 집중합니다. 개체수·상태 값은 공개 자료 기반 대표
          근사이며, 실서비스에서는 원본 소스로 정기 갱신됩니다.
        </p>
      </section>
    </main>
  );
}

export default function Ecosystem() {
  return (
    <>
      <Suspense fallback={<div className="min-h-screen" />}>
        <EcosystemInner />
      </Suspense>
      <BottomNav />
    </>
  );
}
