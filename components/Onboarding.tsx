"use client";

import { BEARS, totalKm } from "@/lib/bears";

interface Props {
  onPick: (id: string) => void;
}

// PRD 6.1 온보딩 — "당신의 곰을 만나보세요" 카드 3장
export default function Onboarding({ onPick }: Props) {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 pb-24 pt-10">
      <div className="text-center">
        <div className="ribbon text-2xl">곰곰</div>
        <h1 className="mt-6 font-hand text-4xl font-bold text-ink">
          당신의 곰을 만나보세요
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          북극곰 한 마리를 골라, 그 곰이 실제로 걸은 1년의 여정을 손그림 지도
          위에서 함께 따라가요.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {BEARS.map((bear) => (
          <button
            key={bear.id}
            onClick={() => onPick(bear.id)}
            className="group flex flex-col rounded-2xl border-2 border-ink/80 bg-paper p-5 text-left shadow-card ease-slow transition-transform hover:-translate-y-1"
          >
            <div className="mb-3 flex h-24 items-center justify-center rounded-xl bg-paleice/60 text-5xl">
              🐻‍❄️
            </div>
            <h2 className="font-hand text-3xl font-bold text-coral">{bear.name}</h2>
            <p className="mt-1 text-sm font-semibold text-ice">{bear.subpopulation}</p>
            <p className="mt-2 flex-1 text-sm text-ink/70">{bear.personality}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-ink/60">
              <span>총 {totalKm(bear).toLocaleString()}km</span>
              <span className="font-hand text-base text-coral group-hover:underline">
                만나기 →
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="mt-10 text-center text-xs text-ink/50">
        로그인 없이 바로 시작해요. 이동 경로는 USGS·Movebank가 공개한 실제 계절
        이동 패턴을 재구성한 대표 샘플입니다.
      </p>
    </main>
  );
}
