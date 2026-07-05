// 라인아트 아이콘 세트 — 디자인 가이드: 일관된 1.5px 스트로크, 미니멀 라인워크
// 이모지 대신 사용해 "과학 장비" 같은 정밀한 인상을 유지한다.

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

function base(props: IconProps) {
  return {
    className: props.className ?? "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: props.strokeWidth ?? 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };
}

export function MapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function RosterIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5.5A1.5 1.5 0 0 1 4 18.5v-13Z" />
      <path d="M8 4v16" />
      <path d="M12 9h5M12 13h5" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.5 2.4 3.8 5.3 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.3-3.8-8.5S9.5 5.9 12 3.5Z" />
    </svg>
  );
}

// 북극곰 얼굴 — 프로필/리스트 식별용 (가이드 5장 Portrait View)
export function BearFaceIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="7.5" cy="7" r="2.2" />
      <circle cx="16.5" cy="7" r="2.2" />
      <path d="M5.8 9.5a7 7 0 1 0 12.4 0" />
      <path d="M5.8 9.5A7 7 0 0 1 12 6a7 7 0 0 1 6.2 3.5" />
      <circle cx="9.5" cy="12" r="0.4" fill="currentColor" />
      <circle cx="14.5" cy="12" r="0.4" fill="currentColor" />
      <path d="M11 15h2l-1 1.2-1-1.2Z" fill="currentColor" />
    </svg>
  );
}

export function PawIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <ellipse cx="12" cy="15.5" rx="4" ry="3.2" />
      <circle cx="6.5" cy="11" r="1.6" />
      <circle cx="10" cy="8.5" r="1.6" />
      <circle cx="14" cy="8.5" r="1.6" />
      <circle cx="17.5" cy="11" r="1.6" />
    </svg>
  );
}

export function ShareIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="17.5" cy="5.5" r="2.5" />
      <circle cx="17.5" cy="18.5" r="2.5" />
      <path d="m8.3 10.8 6.9-4M8.3 13.2l6.9 4" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 5.5v13l10-6.5-10-6.5Z" />
    </svg>
  );
}

export function PauseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8.5 5.5v13M15.5 5.5v13" strokeWidth={2} />
    </svg>
  );
}

export function ResetIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 8A8.5 8.5 0 1 1 4 13" />
      <path d="M4.5 3.5V8H9" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function BiotechIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 20h11" />
      <path d="M9.5 20a6.5 6.5 0 0 0 3.9-11.7" />
      <path d="M9 3.5h4M11 3.5V8" />
      <circle cx="11" cy="10.5" r="2.5" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s6.5-5.7 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.3 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

export function SwapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M7 4 3.5 7.5 7 11M3.5 7.5h13" />
      <path d="m17 13 3.5 3.5L17 20M20.5 16.5h-13" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 4h6v6M20 4l-9 9" />
      <path d="M19 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5.5" />
    </svg>
  );
}
