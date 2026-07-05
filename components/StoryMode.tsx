"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StoryMap from "./StoryMap";
import type { Bear } from "@/lib/types";
import { longestStep, totalKm } from "@/lib/bears";
import { SEASON_EMOJI, SEASON_LABEL, POSE_LABEL, fmtDate } from "@/lib/season";

interface Props {
  bear: Bear;
  onChangeBear: () => void;
}

const SEASONS = ["winter", "spring", "summer", "fall"] as const;

export default function StoryMode({ bear, onChangeBear }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [poiId, setPoiId] = useState<string | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const point = bear.track[index];
  const last = bear.track.length - 1;

  // 자동 재생 — 느긋한 속도 (PRD 5.6)
  useEffect(() => {
    if (!playing) return;
    timer.current = setInterval(() => {
      setIndex((i) => {
        if (i >= last) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 550);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, last]);

  const poi = bear.pois.find((p) => p.id === poiId);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-28 pt-5">
      {/* 리본 타이틀 */}
      <div className="flex items-center justify-between">
        <div className="ribbon text-lg">{bear.name}의 {bear.years.replace("년 여정", "년")}</div>
        <button
          onClick={onChangeBear}
          className="rounded-full border-2 border-ink/70 px-3 py-1 text-sm text-ink/80 ease-slow hover:bg-ink hover:text-paper"
        >
          곰 바꾸기
        </button>
      </div>

      {/* 지도 */}
      <div className="relative mt-4 overflow-hidden rounded-2xl border-2 border-ink/80 bg-paleice/30 shadow-card">
        <StoryMap bear={bear} index={index} onPoiTap={setPoiId} />
      </div>

      {/* 현재 상태 말풍선 (PRD 5.7 담담한 관찰) */}
      <div className="relative mt-4 rounded-2xl border-2 border-ink/80 bg-paper p-4 shadow-card">
        <div className="flex items-center gap-2">
          <span className="text-xl">{SEASON_EMOJI[point.season]}</span>
          <span className="font-hand text-xl font-bold text-coral">
            {SEASON_LABEL[point.season]} · {POSE_LABEL[point.pose]}
          </span>
          <span className="ml-auto text-sm text-ink/50">{fmtDate(point.ts)}</span>
        </div>
        <p className="mt-2 leading-relaxed text-ink/90">{point.caption}</p>
        <button
          onClick={() => setShowDetail(true)}
          className="mt-2 text-sm text-ice underline underline-offset-2"
        >
          이날의 데이터 자세히 보기
        </button>
      </div>

      {/* 계절 스크러버 */}
      <div className="mt-5 rounded-2xl border-2 border-ink/80 bg-paper p-4 shadow-card">
        <div className="mb-2 flex justify-between font-hand text-lg text-ink/70">
          {SEASONS.map((s) => (
            <span key={s}>
              {SEASON_EMOJI[s]} {SEASON_LABEL[s]}
            </span>
          ))}
        </div>
        <input
          type="range"
          className="season w-full"
          min={0}
          max={last}
          value={index}
          onChange={(e) => {
            setPlaying(false);
            setIndex(Number(e.target.value));
          }}
          aria-label="계절 타임라인"
        />
        <div className="mt-4 flex items-center justify-center gap-4">
          <button
            onClick={() => {
              if (index >= last) setIndex(0);
              setPlaying((p) => !p);
            }}
            className="flex items-center gap-2 rounded-full border-2 border-ink/80 bg-coral px-6 py-2.5 font-hand text-xl text-paper shadow-card ease-slow hover:opacity-90"
          >
            {playing ? "⏸ 멈춤" : "▶ 여정 재생"}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setIndex(0);
            }}
            className="rounded-full border-2 border-ink/70 px-4 py-2.5 text-ink/80 ease-slow hover:bg-ink hover:text-paper"
          >
            처음으로
          </button>
        </div>
      </div>

      {/* 요약 + 브릿지 */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-ink/80 bg-paper p-4 text-center shadow-card">
          <div className="text-3xl font-bold text-coral tabular-nums">
            {totalKm(bear).toLocaleString()}
          </div>
          <div className="text-sm text-ink/60">1년 총 이동거리(km)</div>
        </div>
        <div className="rounded-2xl border-2 border-ink/80 bg-paper p-4 text-center shadow-card">
          <div className="text-3xl font-bold text-ice tabular-nums">
            {Math.round(longestStep(bear).stepKm)}
          </div>
          <div className="text-sm text-ink/60">가장 긴 주간 이동(km)</div>
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/bear/${bear.id}/card`}
          className="flex-1 rounded-2xl border-2 border-ink/80 bg-paper p-4 text-center font-hand text-xl text-ink shadow-card ease-slow hover:bg-sand/40"
        >
          🖼️ 여정 카드 만들기
        </Link>
        <Link
          href={`/ecosystem?focus=${bear.subpopId}`}
          className="flex-1 rounded-2xl border-2 border-ink/80 bg-paper p-4 text-center font-hand text-xl text-ink shadow-card ease-slow hover:bg-paleice/50"
        >
          🌏 {bear.name}이 속한 무리 보기
        </Link>
      </div>

      {/* POI 모달 */}
      {poi && (
        <Modal onClose={() => setPoiId(null)}>
          <div className="text-center">
            <div className="text-5xl">{poi.icon}</div>
            <h3 className="mt-2 font-hand text-3xl font-bold text-coral">{poi.label}</h3>
            <p className="mt-3 leading-relaxed text-ink/90">{poi.story}</p>
          </div>
        </Modal>
      )}

      {/* 시점 상세 카드 */}
      {showDetail && (
        <Modal onClose={() => setShowDetail(false)}>
          <h3 className="font-hand text-2xl font-bold text-ink">{fmtDate(point.ts)}의 기록</h3>
          <dl className="mt-4 space-y-2 text-ink/90">
            <Row k="계절" v={`${SEASON_EMOJI[point.season]} ${SEASON_LABEL[point.season]}`} />
            <Row k="상태" v={POSE_LABEL[point.pose]} />
            <Row k="이동거리(주간)" v={`${point.stepKm} km`} />
            <Row k="위도" v={`${point.lat.toFixed(3)}°`} />
            <Row k="경도" v={`${point.lng.toFixed(3)}°`} />
          </dl>
          <p className="mt-4 text-xs text-ink/50">
            좌표·거리는 실제 계절 이동 패턴에서 파생한 값이에요. 성격 서사는 연출,
            데이터는 사실에 근거합니다. (PRD 11장)
          </p>
        </Modal>
      )}
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-ink/10 pb-1">
      <dt className="text-ink/60">{k}</dt>
      <dd className="font-semibold tabular-nums">{v}</dd>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-ink/40 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border-2 border-ink/80 bg-paper p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-full border-2 border-ink/70 py-2 text-ink/80 ease-slow hover:bg-ink hover:text-paper"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
