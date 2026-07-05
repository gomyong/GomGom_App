import type { Bear } from "./types";

export interface ViewBox {
  w: number;
  h: number;
  pad: number;
}

// 위경도 → SVG 좌표 (일러스트 상대좌표, PRD 14장 권고: 실측 대신 상대 매핑)
// 북쪽이 위로 오도록 lat는 반전. 경도 왜곡 보정을 위해 cos(lat) 적용.
export function projector(bear: Bear, view: ViewBox) {
  const { minLat, maxLat, minLng, maxLng } = bear.bounds;
  const midLat = (minLat + maxLat) / 2;
  const kx = Math.cos((midLat * Math.PI) / 180);
  const spanLng = (maxLng - minLng) * kx;
  const spanLat = maxLat - minLat;
  const innerW = view.w - view.pad * 2;
  const innerH = view.h - view.pad * 2;

  return function project(lat: number, lng: number): [number, number] {
    const nx = ((lng - minLng) * kx) / spanLng;
    const ny = (lat - minLat) / spanLat;
    const x = view.pad + nx * innerW;
    const y = view.pad + (1 - ny) * innerH; // 북쪽이 위
    return [x, y];
  };
}
