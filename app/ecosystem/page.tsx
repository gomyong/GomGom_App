"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import SeaIceChart from "@/components/SeaIceChart";
import SubpopMap, { StatusLegend } from "@/components/SubpopMap";
import { ExternalIcon } from "@/components/icons";
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
      <p className="label-caps text-primary">ECOSYSTEM DASHBOARD</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">한 마리에서 전체로</h1>
      <p className="mt-2 text-muted">
        아눅 같은 곰이 북극 전체에 약 3만 마리. 그중 어떤 무리는 늘고, 어떤 무리는
        줄고, 많은 무리는 아직 알 수 없어요.
      </p>

      {/* 내 곰 브릿지 */}
      {focused && (
        <div className="mt-6 rounded-lg border border-primary bg-primary-tint/40 p-4">
          <p className="label-caps text-primary">MY BEAR · SUBPOPULATION</p>
          <p className="mt-2 leading-relaxed text-ink">
            {focusBear && (
              <>
                <span className="font-bold text-primary">{focusBear.name}</span>
                은(는){" "}
              </>
            )}
            <span className="font-semibold">{focused.name}</span> 무리 소속이에요.{" "}
            <span
              className="inline-block whitespace-nowrap rounded-xl px-2 py-0.5 text-xs font-medium text-white"
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
        <h2 className="text-xl font-bold tracking-tight text-ink">19개 아개체군</h2>
        <div className="mt-3 rounded-lg border border-outline-variant bg-card p-4">
          <SubpopMap focus={focus} onSelect={setFocus} />
          <div className="mt-3 border-t border-hairline pt-3">
            <StatusLegend />
          </div>
        </div>

        {/* 상태 요약 — 단정하지 않음 (PRD 11장) */}
        <div className="mt-3 grid grid-cols-4 divide-x divide-hairline rounded-lg border border-outline-variant bg-card">
          {(["increasing", "stable", "declining", "unknown"] as const).map((k) => (
            <div key={k} className="py-3 text-center">
              <div className="font-mono-data text-2xl font-bold" style={{ color: STATUS_COLOR[k] }}>
                {counts[k]}
              </div>
              <div className="label-caps mt-0.5 text-outline">{STATUS_LABEL[k]}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted">
          19개 중 {counts.unknown}개는 데이터가 부족해 추세를 알 수 없어요. 하나의
          수치로 낙관도 비관도 단정하지 않아요.
        </p>

        {/* 선택된 무리 상세 */}
        {focused && (
          <div className="mt-4 rounded-lg border border-outline-variant bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="label-caps text-outline">SUBPOP · {focused.id}</p>
                <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">{focused.name}</h3>
              </div>
              <span
                className="rounded-xl px-3 py-1 text-xs font-medium text-white"
                style={{ background: STATUS_COLOR[focused.status] }}
              >
                {STATUS_LABEL[focused.status]}
              </span>
            </div>
            <p className="mt-2 text-muted">{focused.note}</p>
            <p className="font-mono-data mt-3 text-sm text-ink">
              <span className="label-caps mr-2 text-steel">EST</span>
              {focused.estimate ? `약 ${focused.estimate.toLocaleString()}마리` : "데이터 부족"}
            </p>
          </div>
        )}
      </section>

      {/* 해빙 시계열 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight text-ink">여름 해빙, 어떻게 변해왔나</h2>
        <p className="mt-1 text-sm text-muted">
          1979년 이후 9월 최소 해빙 면적(백만 km²). 곰의 사냥터는 이 얼음 위에 있어요.
        </p>
        <div className="mt-3 rounded-lg border border-outline-variant bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="label-caps text-steel">SEA ICE MINIMUM · SEP</span>
            <span className="label-caps text-outline">SRC: NSIDC</span>
          </div>
          <SeaIceChart />
        </div>
      </section>

      {/* 전체 목록 */}
      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight text-ink">전체 아개체군</h2>
        <div className="mt-3 overflow-hidden rounded-lg border border-outline-variant bg-card">
          <div className="label-caps flex items-center gap-3 border-b border-hairline bg-surface-low px-4 py-2.5 text-steel">
            <span className="w-3" />
            <span className="flex-1">SUBPOPULATION</span>
            <span>EST</span>
            <span className="w-10 text-right">TREND</span>
          </div>
          {SUBPOPULATIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => setFocus(s.id)}
              className={`flex w-full items-center gap-3 border-b border-hairline px-4 py-2.5 text-left transition-colors ease-slow last:border-b-0 hover:bg-surface-low ${
                focus === s.id ? "bg-primary-tint/30" : ""
              }`}
            >
              <span className="h-2.5 w-3 shrink-0">
                <span
                  className="block h-2.5 w-2.5 rounded-full"
                  style={{ background: STATUS_COLOR[s.status] }}
                />
              </span>
              <span className="flex-1 text-sm text-ink">{s.name}</span>
              <span className="font-mono-data text-xs text-muted">
                {s.estimate ? s.estimate.toLocaleString() : "—"}
              </span>
              <span className="w-10 text-right text-xs text-muted">{STATUS_LABEL[s.status]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 출처 (PRD 11장 원칙 2) */}
      <section className="mt-10">
        <h2 className="text-xl font-bold tracking-tight text-ink">출처</h2>
        <ul className="mt-3 space-y-2">
          {SOURCES.map((src) => (
            <li key={src.url}>
              <a
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary underline-offset-4 hover:underline"
              >
                {src.label}
                <ExternalIcon className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-outline">
          곰곰은 정치화된 논쟁에 편승하지 않아요. &ldquo;이 곰이 실제로 이렇게
          움직였다&rdquo;는 관찰에 집중합니다. 개체수·상태 값은 공개 자료 기반 대표
          근사이며, 실서비스에서는 원본 소스로 정기 갱신됩니다.
        </p>
      </section>
    </main>
  );
}

export default function Ecosystem() {
  return (
    <>
      <TopBar />
      <Suspense fallback={<div className="min-h-screen" />}>
        <EcosystemInner />
      </Suspense>
      <BottomNav />
    </>
  );
}
