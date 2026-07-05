import type { Config } from "tailwindcss";

// 곰곰 디자인 시스템 — Design Guide_GomGom "Arctic Observation System" 기반
// 과학적 정밀함 + 탐사 미학: 설백 배경, 아크틱 블루, 차콜 라인아트, 1px 보더
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f7f9fb", // 배경 — Ice White
        "surface-low": "#f2f4f6",
        "surface-container": "#eceef0",
        card: "#ffffff",
        ink: "#191c1e", // 차콜 — 라인아트/본문
        muted: "#414755", // on-surface-variant
        outline: "#717786",
        "outline-variant": "#c1c6d7",
        hairline: "#e0e3e5",
        primary: "#0058bc", // Arctic Blue
        "primary-bright": "#0070eb",
        "primary-tint": "#d8e2ff",
        glacier: "#dae4ee", // Glacier Tint — secondary container
        steel: "#566068", // secondary
        alert: "#ba1a1a", // 경고 — 절제된 레드
        "alert-tint": "#ffdad6",
      },
      fontFamily: {
        display: ['"Hanken Grotesk"', "Pretendard", "system-ui", "sans-serif"],
        body: ['"Hanken Grotesk"', "Pretendard", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      letterSpacing: {
        caps: "0.05em",
      },
    },
  },
  plugins: [],
};

export default config;
