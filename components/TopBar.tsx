import { BiotechIcon } from "./icons";

// 디자인 가이드 6장 Top Bar — Leading: 리서치 아이콘 · Title: 브랜드 · Trailing: 액션 슬롯
export default function TopBar({ trailing }: { trailing?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5">
        <BiotechIcon className="h-6 w-6 text-primary" />
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold tracking-tight text-primary">곰곰</span>
          <span className="label-caps text-outline">GOMGOM</span>
        </div>
        <div className="flex h-6 w-6 items-center justify-center">{trailing}</div>
      </div>
    </header>
  );
}
