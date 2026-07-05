"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import { BEARS, longestStep, totalKm } from "@/lib/bears";
import { SEASON_LABEL } from "@/lib/season";

const KEY = "gomgom.myBear";

// PRD 6.3 곰 로스터/도감 — 번호·손글씨 주석 스타일 카드
export default function Roster() {
  const [myBear, setMyBear] = useState<string | null>(null);
  useEffect(() => setMyBear(localStorage.getItem(KEY)), []);

  const choose = (id: string) => {
    localStorage.setItem(KEY, id);
    setMyBear(id);
  };

  return (
    <>
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-8">
        <div className="ribbon text-lg">곰 도감</div>
        <h1 className="mt-4 font-hand text-4xl font-bold text-ink">지금까지 만난 곰들</h1>
        <p className="mt-2 text-ink/70">
          시즌마다 새로운 실제 개체가 추가돼요. 카드를 눌러 그 곰의 여정으로 떠나요.
        </p>

        <div className="mt-8 space-y-5">
          {BEARS.map((bear, i) => {
            const best = longestStep(bear);
            const mine = myBear === bear.id;
            return (
              <div
                key={bear.id}
                className="relative rounded-2xl border-2 border-ink/80 bg-paper p-5 shadow-card"
              >
                <div className="absolute -left-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink/80 bg-sand font-hand text-lg font-bold text-ink">
                  {String(i + 1).padStart(2, "0")}
                </div>
                {mine && (
                  <span className="absolute right-4 top-4 rounded-full bg-coral px-2 py-0.5 text-xs text-paper">
                    내 곰
                  </span>
                )}
                <div className="flex gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-paleice/60 text-4xl">
                    🐻‍❄️
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-hand text-3xl font-bold text-coral">{bear.name}</h2>
                    <p className="text-sm font-semibold text-ice">
                      {bear.subpopulation} · {bear.sex}
                    </p>
                    <p className="mt-1 text-sm text-ink/70">{bear.personality}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Stat label="총 이동거리" value={`${totalKm(bear).toLocaleString()}km`} />
                  <Stat label="가장 긴 이동" value={`${Math.round(best.stepKm)}km`} />
                  <Stat label="목걸이" value={bear.collarType.split(" ")[0]} />
                </div>

                <div className="mt-3 rounded-xl bg-sand/25 px-3 py-2 text-sm text-ink/80">
                  🏅 가장 인상적인 순간 —{" "}
                  <span className="font-hand text-base">
                    {SEASON_LABEL[best.season]}에 {Math.round(best.stepKm)}km를 이동한 날
                  </span>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => choose(bear.id)}
                    className="flex-1 rounded-full border-2 border-ink/80 bg-coral py-2 font-hand text-lg text-paper ease-slow hover:opacity-90"
                  >
                    {mine ? "내 곰으로 선택됨" : "이 곰 따라가기"}
                  </button>
                  <Link
                    href="/"
                    onClick={() => choose(bear.id)}
                    className="rounded-full border-2 border-ink/70 px-4 py-2 text-ink/80 ease-slow hover:bg-ink hover:text-paper"
                  >
                    여정 →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-paleice/30 py-2">
      <div className="text-lg font-bold text-ink tabular-nums">{value}</div>
      <div className="text-xs text-ink/60">{label}</div>
    </div>
  );
}
