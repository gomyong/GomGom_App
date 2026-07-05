"use client";

import { BEARS, totalKm } from "@/lib/bears";
import { BearFaceIcon, ArrowRightIcon } from "./icons";

interface Props {
  onPick: (id: string) => void;
}

// PRD 6.1 온보딩 — "당신의 곰을 만나보세요" 카드 3장 (필드 리서치 카드 스타일)
export default function Onboarding({ onPick }: Props) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-28 pt-10">
      <div className="text-center">
        <p className="label-caps text-primary">FIELD OBSERVATION · 곰곰</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          당신의 곰을 만나보세요
        </h1>
        <p className="mx-auto mt-3 max-w-md text-muted">
          북극곰 한 마리를 골라, 그 곰이 실제로 걸은 1년의 여정을 지도 위에서
          함께 따라가요.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {BEARS.map((bear) => (
          <button
            key={bear.id}
            onClick={() => onPick(bear.id)}
            className="press-offset group flex flex-col rounded-lg border border-outline-variant bg-card p-5 text-left transition-colors ease-slow hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <span className="label-caps rounded-sm bg-glacier px-2 py-1 text-steel">
                {bear.subpopId} · {bear.sex}
              </span>
              <span className="label-caps text-outline">{bear.collarType.split(" ")[0]}</span>
            </div>
            <div className="mt-4 flex h-20 items-center justify-center rounded border border-hairline bg-surface-low">
              <BearFaceIcon className="h-12 w-12 text-ink" strokeWidth={1.2} />
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-tight text-ink">{bear.name}</h2>
            <p className="font-mono-data mt-0.5 text-xs text-primary">{bear.subpopulation}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{bear.personality}</p>
            <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">
              <span className="font-mono-data text-xs text-muted">
                {totalKm(bear).toLocaleString()} km / yr
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                만나기 <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-lg text-center text-xs leading-relaxed text-outline">
        로그인 없이 바로 시작해요. 이동 경로는 USGS·Movebank가 공개한 실제 계절
        이동 패턴을 재구성한 대표 샘플입니다.
      </p>
    </main>
  );
}
