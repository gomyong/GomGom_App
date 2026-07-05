"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "내 곰", icon: "🐻‍❄️" },
  { href: "/roster", label: "도감", icon: "📖" },
  { href: "/ecosystem", label: "생태계", icon: "🌏" },
];

export default function BottomNav() {
  const path = usePathname();
  const active = (href: string) =>
    href === "/" ? path === "/" || path.startsWith("/bear") : path.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t-2 border-ink/80 bg-paper/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-3xl">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-sm ease-slow ${
              active(t.href) ? "text-coral" : "text-ink/60"
            }`}
          >
            <span className="text-xl leading-none">{t.icon}</span>
            <span className={`font-hand text-base ${active(t.href) ? "font-bold" : ""}`}>
              {t.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
