"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapIcon, RosterIcon, GlobeIcon } from "./icons";

const TABS = [
  { href: "/", label: "내 곰", caps: "MAP", Icon: MapIcon },
  { href: "/roster", label: "도감", caps: "BEARS", Icon: RosterIcon },
  { href: "/ecosystem", label: "생태계", caps: "ECO", Icon: GlobeIcon },
];

// 디자인 가이드 6장 Bottom Bar — 라인 아이콘 + 활성 탭 글레이셔 필 하이라이트
export default function BottomNav() {
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === "/" || path.startsWith("/bear") : path.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-hairline bg-surface/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-3xl px-2 py-1.5">
        {TABS.map(({ href, label, Icon }) => {
          const on = active(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-1 flex-col items-center gap-1 py-1.5"
            >
              <span
                className={`flex h-8 w-16 items-center justify-center rounded-xl transition-colors ease-slow ${
                  on ? "bg-glacier text-ink" : "text-muted"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={on ? 2 : 1.5} />
              </span>
              <span
                className={`label-caps ${on ? "text-ink" : "text-outline"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
