import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

// ==============================
// 再現可能なシード付きランダム
// ==============================
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ==============================
// 星データ
// ==============================
interface StarData {
  x: number;
  y: number;
  size: number;
  delay: number;
  period: number;
  color: string;
}

const NUM_STARS = 32;
const STAR_COLORS = ["#FFD700", "#FFFFFF", "#FF85C0", "#4FC3F7", "#A8E06C"];

const starList: StarData[] = Array.from({ length: NUM_STARS }, (_, i) => ({
  x: seededRandom(i * 17 + 200) * 1920,
  y: seededRandom(i * 17 + 201) * 1080,
  size: 14 + seededRandom(i * 17 + 202) * 28,
  delay: Math.floor(seededRandom(i * 17 + 203) * 80),
  period: 16 + seededRandom(i * 17 + 204) * 24,
  color:
    STAR_COLORS[Math.floor(seededRandom(i * 17 + 205) * STAR_COLORS.length)],
}));

// ==============================
// 4方向キラキラ SVG
// ==============================
const Sparkle: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20">
    <path
      d="M10 0 L12.5 7.5 L20 10 L12.5 12.5 L10 20 L7.5 12.5 L0 10 L7.5 7.5 Z"
      fill={color}
    />
  </svg>
);

// ==============================
// キラキラ星コンポーネント
// ==============================
export const Stars: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {starList.map((star, i) => {
        const adjustedFrame = frame - star.delay;
        if (adjustedFrame < 0) return null;

        // 正弦波で脈動（サイズ＆透明度）
        const phase = (adjustedFrame % star.period) / star.period;
        const pulse = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;

        const scale = 0.2 + pulse * 0.8;
        const opacity = 0.15 + pulse * 0.85;
        const rotation = adjustedFrame * 1.5;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: star.x - star.size / 2,
              top: star.y - star.size / 2,
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              opacity,
            }}
          >
            <Sparkle size={star.size} color={star.color} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
