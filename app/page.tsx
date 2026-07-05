"use client";

import { useEffect, useState } from "react";
import Onboarding from "@/components/Onboarding";
import StoryMode from "@/components/StoryMode";
import BottomNav from "@/components/BottomNav";
import { getBear } from "@/lib/bears";

const KEY = "gomgom.myBear";

export default function Home() {
  const [bearId, setBearId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBearId(localStorage.getItem(KEY));
    setReady(true);
  }, []);

  const pick = (id: string) => {
    localStorage.setItem(KEY, id);
    setBearId(id);
  };
  const change = () => {
    localStorage.removeItem(KEY);
    setBearId(null);
  };

  if (!ready) {
    return <div className="min-h-screen" aria-hidden />;
  }

  const bear = bearId ? getBear(bearId) : undefined;

  return (
    <>
      {bear ? (
        <StoryMode bear={bear} onChangeBear={change} />
      ) : (
        <Onboarding onPick={pick} />
      )}
      <BottomNav />
    </>
  );
}
