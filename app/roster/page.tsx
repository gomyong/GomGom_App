"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import { BEARS, longestStep, totalKm } from "@/lib/bears";
import { SEASON_LABEL } from "@/lib/season";
import { BearFaceIcon, ArrowRightIcon, PinIcon } from "@/components/icons";

const KEY = "gomgom.myBear";

// PRD 6.3 곰 로스터/도감 — 텔레메트리 관측 대상 리스트 스타일
export default function Roster() {
  const [myBear, setMyBear] = useState<string | null>(null);
  useEffect(() => setMyBear(localStorage.getItem(KEY)), []);

  const choose = (id: string) => {
    localStorage.setItem(KEY, id);
    setMyBear(id);
  };

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-3xl px-5 pb-28 pt-8">
        <p className="label-caps text-primary">SUBJECT ROSTER</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">지금까지 만난 곰들</h1>
        <p className="mt-2 text-muted">
          시즌마다 새로운 실제 개체가 추가돼요. 카드를 눌러 그 곰의 여정으로 떠나요.
        </p>

        <div className="mt-8 space-y-4">
          {BEARS.map((bear, i) => {
            const best = longestStep(bear);
            const mine = myBear === bear.id;
            const cur = bear.track[bear.track.length - 1];
            return (
              <div
                key={bear.id}
                className={`rounded-lg border bg-card p-5 ${
                  mine ? "border-primary" : "border-outline-variant"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="label-caps text-outline">
                    SUBJ {String(i + 1).padStart(2, "0")} · {bear.subpopId}
                  </span>
                  {mine && (
                    <span className="label-caps rounded-xl bg-primary-tint px-2.5 py-1 text-primary">
                      MY BEAR
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-hairline bg-surface-low">
                    <BearFaceIcon className="h-9 w-9 text-ink" strokeWidth={1.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold tracking-tight text-ink">{bear.name}</h2>
                    <p className="font-mono-data text-xs text-primary">
                      {bear.subpopulation} · {bear.sex}
                    </p>
                    <p className="mt-1 text-sm text-muted">{bear.personality}</p>
                  </div>
                </div>

                <div className="font-mono-data mt-3 flex items-center gap-1.5 text-xs text-muted">
                  <PinIcon className="h-3.5 w-3.5 shrink-0 text-outline" />
                  {cur.lat.toFixed(4)}° N, {Math.abs(cur.lng).toFixed(4)}° W
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-hairline rounded border border-hairline">
                  <Stat label="DIST / YR" value={`${totalKm(bear).toLocaleString()}km`} />
                  <Stat label="LONGEST LEG" value={`${Math.round(best.stepKm)}km`} />
                  <Stat label="COLLAR" value={bear.collarType.split(" ")[0]} />
                </div>

                <div className="mt-3 rounded bg-glacier/60 px-3 py-2.5 text-sm text-ink">
                  <span className="label-caps mr-2 text-steel">HIGHLIGHT</span>
                  {SEASON_LABEL[best.season]}에 {Math.round(best.stepKm)}km를 이동한 날
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => choose(bear.id)}
                    disabled={mine}
                    className={`press-offset flex-1 rounded border py-2 text-sm font-semibold transition-colors ease-slow ${
                      mine
                        ? "border-outline-variant bg-surface-low text-outline"
                        : "border-ink bg-primary text-white hover:bg-primary-bright"
                    }`}
                  >
                    {mine ? "내 곰으로 선택됨" : "이 곰 따라가기"}
                  </button>
                  <Link
                    href="/"
                    onClick={() => choose(bear.id)}
                    className="flex items-center gap-1 rounded border border-outline-variant px-4 py-2 text-sm text-muted transition-colors ease-slow hover:border-ink hover:text-ink"
                  >
                    여정 <ArrowRightIcon className="h-4 w-4" />
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
    <div className="py-2.5 text-center">
      <div className="font-mono-data text-sm font-semibold text-ink">{value}</div>
      <div className="label-caps mt-0.5 text-outline">{label}</div>
    </div>
  );
}
