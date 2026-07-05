# 곰곰 (GomGom) — 북극곰 여정 트래커

> 실제 위성추적 데이터 패턴으로 북극곰 한 마리의 계절 여정을 따라가고,
> 그 과정에서 생태계 전체의 안부를 묻게 되는 손그림 지도 앱.

PRD `v0.1` 의 **Phase 1(MVP) + Phase 2 핵심**을 구현했습니다. 아이패드 ·
아이폰 · 웹 브라우저에서 모두 동작하는 반응형 PWA입니다.

## 스크린 & 기능

| 화면 | 경로 | 내용 (PRD 6장) |
|---|---|---|
| 곰 만나기(온보딩) | `/` | 곰 3마리 선택 카드. 게스트 우선, 로그인 없음 |
| 스토리 모드(메인) | `/` | 손그림 북극 지도 + 점선 경로 + 계절 스크러버 + 상태 포즈 + 담담한 캡션 + POI 미니 스토리 + 시점 상세 데이터 카드 |
| 도감/로스터 | `/roster` | 번호·손글씨 주석 스타일 곰 카드, "가장 인상적인 순간" 배지 |
| 생태계 대시보드 | `/ecosystem` | 19개 아개체군 지도(상태별 색) · 해빙 시계열(1979~) · "내 곰이 속한 무리" 브릿지 · 출처 링크 |
| 여정 카드(공유) | `/bear/[id]/card` | 손그림 엽서 자동 생성 → Web Share / PNG 저장 |

하단 탭 3개: `내 곰(스토리)` · `도감` · `생태계`.

## 디자인 시스템 (PRD 5장)

- **팔레트**: Paper Cream `#F5EFE2` 바탕 + 웜(Bear Coral `#D8592E`) / 쿨(Ice Blue `#3D6FA8`) 2 액센트. → `tailwind.config.ts`
- **손그림 렌더**: [rough.js](https://roughjs.com) 로 지도 경로·아이콘·프레임·차트를 매 렌더마다 미세하게 떨리는 획으로 그림.
- **폰트**: 지명/타이틀 손글씨(Gaegu/Caveat) + 본문 Pretendard. 런타임 로드.
- **종이 그레인** 노이즈 오버레이, 리본 배너 타이틀, 느긋한 이징.

## 데이터 정직성 (PRD 11장)

- 이동 경로는 USGS·Movebank가 공개한 **실제 계절 이동 패턴**(여름 장거리 수영,
  단식기 상륙, 겨울 굴 등)을 재구성한 **대표 샘플**입니다. 성격/이름은 연출,
  이동 문법과 수치는 사실에 근거합니다.
- 아개체군 상태는 증가·안정·감소·**불명**을 그대로 노출하며, 단일 수치로
  낙관/비관을 단정하지 않습니다. 각 수치에 출처를 링크합니다.
- 실서비스에서는 `lib/bears.ts` · `lib/ecosystem.ts` 의 데이터를 8장
  파이프라인(원본 → Supabase/PostGIS → 파생 지표)의 실측 값으로 대체합니다.

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 프로덕션 빌드
npm start
```

## 스택

Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS · rough.js.

MVP는 PRD 14장 권고에 따라 지도 타일/토큰 없이 **일러스트 상대좌표 지도**로
구현했습니다(외부 지도 의존성 0). 실측 지도/Mapbox·deck.gl, Supabase 연동,
로그인·알림은 Phase 3 확장 지점입니다.

## 프로젝트 구조

```
app/
  layout.tsx            루트 레이아웃 · 폰트 · PWA 메타
  page.tsx              온보딩 ↔ 스토리 모드 (localStorage로 내 곰 저장)
  roster/page.tsx       도감
  ecosystem/page.tsx    생태계 대시보드
  bear/[id]/card/page.tsx  여정 카드
components/
  StoryMap.tsx          손그림 지도 (rough.js)
  StoryMode.tsx         메인 스토리 화면
  Onboarding.tsx        곰 만나기
  SubpopMap.tsx         아개체군 지도
  SeaIceChart.tsx       해빙 손그림 라인 차트
  JourneyCard.tsx       공유 엽서 + PNG 내보내기
  BottomNav.tsx         하단 탭
lib/
  bears.ts              곰·트랙 데이터 생성 (결정적)
  ecosystem.ts          아개체군 · 해빙 데이터
  geo.ts season.ts types.ts
```
