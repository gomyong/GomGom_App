import type { Config } from "tailwindcss";

// 곰곰 디자인 시스템 — PRD 5.2 컬러 팔레트 기반
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5EFE2", // 배경(종이) — 오래된 지도책 종이
        ink: "#2B2A26", // 잉크(선/텍스트) — 따뜻한 먹선
        ice: "#3D6FA8", // 쿨 액센트 — 바다·해빙·물
        coral: "#D8592E", // 웜 액센트 — 곰의 체온·석양·관심지점
        paleice: "#BFD4E3", // 보조 쿨 — 해빙 면
        sand: "#E9B872", // 보조 웜 — 육지·툰드라·경고
        // 다크모드
        night: "#1B2430", // 짙은 남색 종이
      },
      fontFamily: {
        hand: ["var(--font-hand)", "Gaegu", "Caveat", "cursive"],
        body: ["var(--font-body)", "Pretendard", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "3px 4px 0 rgba(43, 42, 38, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
