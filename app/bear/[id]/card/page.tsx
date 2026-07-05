"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";
import JourneyCard from "@/components/JourneyCard";
import { getBear } from "@/lib/bears";
import { ArrowLeftIcon } from "@/components/icons";

export default function CardPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const bear = id ? getBear(id) : undefined;

  if (!bear) {
    return (
      <>
        <TopBar />
        <main className="mx-auto max-w-3xl px-5 pb-28 pt-10 text-center">
          <p className="text-muted">곰을 찾을 수 없어요.</p>
          <Link href="/" className="mt-4 inline-block text-primary underline underline-offset-4">
            내 곰으로 돌아가기
          </Link>
        </main>
        <BottomNav />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-md px-5 pb-28 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="label-caps text-primary">JOURNEY CARD</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink">여정 카드</h1>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded border border-outline-variant bg-card px-3 py-1.5 text-sm text-muted transition-colors ease-slow hover:border-ink hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            여정으로
          </Link>
        </div>
        <p className="mb-4 text-sm text-muted">
          {bear.name}의 1년 경로를 필드 리포트 카드로 만들었어요. 저장하거나 바로
          공유해 보세요.
        </p>
        <JourneyCard bear={bear} />
      </main>
      <BottomNav />
    </>
  );
}
