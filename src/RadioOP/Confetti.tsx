import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// ==============================
// 再現可能なシード付きランダム
// ==============================
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const COLORS = [
  "#FF6B9D", "#FFD93D", "#4FC3F7", "#FF9A56",
  "#A8E06C", "#FF85C0", "#B388FF", "#FF5252",
  "#69F0AE",
];

// ==============================
// パーティクル定義
// ==============================
interface Particle {
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotStart: number;
  rotSpeed: number;
  shape: number; // 0=四角, 1=丸, 2=長方形
  burstFrame: number;
  originX: number;
  originY: number;
}

function createParticles(): Particle[] {
  // 第1波: 初期爆発 (frame 0 付近)
  const burst1: Particle[] = Array.from({ length: 60 }, (_, i) => {
    const angle = seededRandom(i * 13 + 1) * Math.PI * 2;
    const speed = 300 + seededRandom(i * 13 + 2) * 700;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 350,
      color: COLORS[Math.floor(seededRandom(i * 13 + 3) * COLORS.length)],
      size: 7 + seededRandom(i * 13 + 4) * 16,
      rotStart: seededRandom(i * 13 + 5) * 360,
      rotSpeed: (seededRandom(i * 13 + 6) - 0.5) * 800,
      shape: Math.floor(seededRandom(i * 13 + 7) * 3),
      burstFrame: Math.floor(seededRandom(i * 13 + 8) * 6),
      originX: 960,
      originY: 420,
    };
  });

  // 第2波: 「ドンッ！」時の追加爆発 (frame 178 付近)
  const burst2: Particle[] = Array.from({ length: 35 }, (_, i) => {
    const idx = i + 60;
    const angle = seededRandom(idx * 13 + 1) * Math.PI * 2;
    const speed = 250 + seededRandom(idx * 13 + 2) * 600;
    return {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 300,
      color: COLORS[Math.floor(seededRandom(idx * 13 + 3) * COLORS.length)],
      size: 8 + seededRandom(idx * 13 + 4) * 14,
      rotStart: seededRandom(idx * 13 + 5) * 360,
      rotSpeed: (seededRandom(idx * 13 + 6) - 0.5) * 700,
      shape: Math.floor(seededRandom(idx * 13 + 7) * 3),
      burstFrame: 178 + Math.floor(seededRandom(idx * 13 + 8) * 5),
      originX: 960,
      originY: 450,
    };
  });

  return [...burst1, ...burst2];
}

const particles = createParticles();

// ==============================
// 紙吹雪コンポーネント
// ==============================
export const Confetti: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        const elapsed = frame - p.burstFrame;
        if (elapsed < 0) return null;

        // 物理シミュレーション
        const t = elapsed / 30; // 秒に変換
        const gravity = 500;
        const x = p.originX + p.vx * t;
        const y = p.originY + p.vy * t + 0.5 * gravity * t * t;
        const rot = p.rotStart + p.rotSpeed * t;

        // 画面外のパーティクルはスキップ
        if (x < -60 || x > 1980 || y > 1140 || y < -100) return null;

        // フェードイン＆アウト
        const opacity = interpolate(
          elapsed,
          [0, 4, 110, 170],
          [0, 1, 0.7, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        if (opacity <= 0) return null;

        // 爆発時のバーストスケール
        const burstScale = interpolate(
          elapsed,
          [0, 5, 16],
          [0, 1.5, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        const w = p.size;
        const h = p.shape === 2 ? p.size * 0.4 : p.size;
        const br = p.shape === 1 ? "50%" : "2px";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - w / 2,
              top: y - h / 2,
              width: w,
              height: h,
              backgroundColor: p.color,
              borderRadius: br,
              transform: `rotate(${rot}deg) scale(${burstScale})`,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
