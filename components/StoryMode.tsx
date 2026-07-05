"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import StoryMap from "./StoryMap";
import type { Bear } from "@/lib/types";
import { longestStep, totalKm } from "@/lib/bears";
import { SEASON_LABEL, SEASON_CAPS, POSE_LABEL, fmtDate } from "@/lib/season";
import { SwapIcon, PlayIcon, PauseIcon, ResetIcon, ShareIcon, GlobeIcon, PinIcon } from "./icons";

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
      {/* 헤더 — 곰 이름 + 상태 칩 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="label-caps text-outline">ACTIVE TRACK · {bear.years}</p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold tracking-tight text-ink">
            {bear.name}
            <span className="flex items-center gap-1.5 rounded-xl bg-glacier px-2.5 py-0.5 text-xs font-medium text-ink">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-bright" />
              {POSE_LABEL[point.pose]}
            </span>
          </h1>
        </div>
        <button
          onClick={onChangeBear}
          className="flex items-center gap-1.5 rounded border border-outline-variant bg-card px-3 py-1.5 text-sm text-muted transition-colors ease-slow hover:border-ink hover:text-ink"
        >
          <SwapIcon className="h-4 w-4" />
          곰 바꾸기
        </button>
      </div>

      {/* 지도 — 블루프린트 캔버스 */}
      <div className="relative mt-4 overflow-hidden rounded-lg border border-outline-variant bg-card">
        <StoryMap bear={bear} index={index} onPoiTap={setPoiId} />
      </div>

      {/* 관찰 노트 — 담담한 캡션 (PRD 5.7) */}
      <div className="mt-4 rounded-lg border border-outline-variant bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="label-caps rounded-sm bg-surface-low px-2 py-1 text-steel">
            {SEASON_CAPS[point.season]} · {SEASON_LABEL[point.season]}
          </span>
          <span className="font-mono-data text-xs text-outline">{fmtDate(point.ts)}</span>
        </div>
        <p className="mt-3 leading-relaxed text-ink">{point.caption}</p>
        <button
          onClick={() => setShowDetail(true)}
          className="font-mono-data mt-3 text-sm text-primary underline-offset-4 hover:underline"
        >
          이날의 데이터 자세히 보기
        </button>
      </div>

      {/* 타임라인 스크러버 */}
      <div className="mt-4 rounded-lg border border-outline-variant bg-card p-5">
        <div className="flex items-center justify-between">
          <span className="label-caps text-steel">SEASON TIMELINE</span>
          <span className="font-mono-data text-xs text-outline">
            WK {String(index + 1).padStart(2, "0")}/52
          </span>
        </div>
        <div className="label-caps mt-3 flex justify-between text-outline">
          {SEASONS.map((s) => (
            <span key={s} className={point.season === s ? "text-primary" : ""}>
              {SEASON_LABEL[s]}
            </span>
          ))}
        </div>
        <input
          type="range"
          className="season mt-2 w-full"
          min={0}
          max={last}
          value={index}
          onChange={(e) => {
            setPlaying(false);
            setIndex(Number(e.target.value));
          }}
          aria-label="계절 타임라인"
        />
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              if (index >= last) setIndex(0);
              setPlaying((p) => !p);
            }}
            className="press-offset flex flex-1 items-center justify-center gap-2 rounded border border-ink bg-primary py-2.5 font-semibold text-white transition-colors ease-slow hover:bg-primary-bright"
          >
            {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
            {playing ? "멈춤" : "여정 재생"}
          </button>
          <button
            onClick={() => {
              setPlaying(false);
              setIndex(0);
            }}
            className="flex items-center gap-1.5 rounded border border-outline-variant bg-card px-4 py-2.5 text-sm text-muted transition-colors ease-slow hover:border-ink hover:text-ink"
            aria-label="처음으로"
          >
            <ResetIcon className="h-4 w-4" />
            처음으로
          </button>
        </div>
      </div>

      {/* 데이터 카드 — label-caps 태그 + 모노 수치 (가이드 Data Cards) */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-outline-variant bg-card p-4">
          <p className="label-caps text-steel">DISTANCE / YR</p>
          <p className="font-mono-data mt-2 text-2xl font-bold text-ink">
            {totalKm(bear).toLocaleString()}
            <span className="ml-1 text-sm font-normal text-outline">km</span>
          </p>
        </div>
        <div className="rounded-lg border border-outline-variant bg-card p-4">
          <p className="label-caps text-steel">LONGEST LEG / WK</p>
          <p className="font-mono-data mt-2 text-2xl font-bold text-primary">
            {Math.round(longestStep(bear).stepKm)}
            <span className="ml-1 text-sm font-normal text-outline">km</span>
          </p>
        </div>
      </div>

      {/* 액션 — 여정 카드 · 생태계 브릿지 */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/bear/${bear.id}/card`}
          className="press-offset flex flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-card p-3.5 font-semibold text-ink transition-colors ease-slow hover:border-primary hover:text-primary"
        >
          <ShareIcon className="h-4 w-4" />
          여정 카드 만들기
        </Link>
        <Link
          href={`/ecosystem?focus=${bear.subpopId}`}
          className="press-offset flex flex-1 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-card p-3.5 font-semibold text-ink transition-colors ease-slow hover:border-primary hover:text-primary"
        >
          <GlobeIcon className="h-4 w-4" />
          {bear.name}이 속한 무리 보기
        </Link>
      </div>

      {/* POI 모달 */}
      {poi && (
        <Modal onClose={() => setPoiId(null)}>
          <div className="text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-glacier text-primary">
              <PinIcon className="h-6 w-6" />
            </span>
            <p className="label-caps mt-3 text-outline">POINT OF INTEREST</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">{poi.label}</h3>
            <p className="mt-3 leading-relaxed text-muted">{poi.story}</p>
          </div>
        </Modal>
      )}

      {/* 시점 상세 카드 */}
      {showDetail && (
        <Modal onClose={() => setShowDetail(false)}>
          <p className="label-caps text-outline">FIELD LOG</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight text-ink">
            {fmtDate(point.ts)}의 기록
          </h3>
          <dl className="mt-4 space-y-2.5">
            <Row k="SEASON" v={SEASON_LABEL[point.season]} />
            <Row k="STATUS" v={POSE_LABEL[point.pose]} />
            <Row k="DIST / WK" v={`${point.stepKm} km`} />
            <Row k="LAT" v={`${point.lat.toFixed(4)}°`} />
            <Row k="LNG" v={`${point.lng.toFixed(4)}°`} />
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-outline">
            좌표·거리는 실제 계절 이동 패턴에서 파생한 값이에요. 성격 서사는 연출,
            데이터는 사실에 근거합니다.
          </p>
        </Modal>
      )}
    </main>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between border-b border-hairline pb-2">
      <dt className="label-caps text-steel">{k}</dt>
      <dd className="font-mono-data text-sm font-medium text-ink">{v}</dd>
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
        className="w-full max-w-sm rounded-xl border border-outline-variant bg-card p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="mt-5 w-full rounded border border-outline-variant py-2 text-sm text-muted transition-colors ease-slow hover:border-ink hover:text-ink"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
