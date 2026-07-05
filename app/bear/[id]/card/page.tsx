"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import JourneyCard from "@/components/JourneyCard";
import { getBear } from "@/lib/bears";

export default function CardPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const bear = id ? getBear(id) : undefined;

  if (!bear) {
    return (
      <>
        <main className="mx-auto max-w-3xl px-5 pb-28 pt-10 text-center">
          <p className="text-ink/70">곰을 찾을 수 없어요.</p>
          <Link href="/" className="mt-4 inline-block text-ice underline">
            내 곰으로 돌아가기
          </Link>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-md px-5 pb-28 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="ribbon text-lg">여정 카드</div>
          <Link
            href="/"
            className="rounded-full border-2 border-ink/70 px-3 py-1 text-sm text-ink/80 ease-slow hover:bg-ink hover:text-paper"
          >
            ← 여정으로
          </Link>
        </div>
        <p className="mb-4 text-sm text-ink/70">
          {bear.name}의 1년 경로를 손그림 엽서로 만들었어요. 저장하거나 바로
          공유해 보세요.
        </p>
        <JourneyCard bear={bear} />
      </main>
      <BottomNav />
    </>
  );
}
