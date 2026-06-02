import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";

// ==============================
// 再現可能なシード付きランダム
// ==============================
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

// ==============================
// 装飾アイテム定義
// ==============================
const EMOJIS = ["♪", "♫", "♥", "★", "✿", "◆", "♪", "★"];
const DECO_COLORS = [
  "#FF6B9D", "#FFD93D", "#4FC3F7", "#FF9A56",
  "#A8E06C", "#FF85C0", "#B388FF", "#FF5252",
];

interface DecoItem {
  x: number;
  y: number;
  size: number;
  delay: number;
  emoji: string;
  color: string;
  floatSpeed: number;
  floatAmp: number;
}

const NUM_ITEMS = 22;

const decoItems: DecoItem[] = Array.from({ length: NUM_ITEMS }, (_, i) => ({
  x: 80 + seededRandom(i * 19 + 300) * 1760,
  y: 60 + seededRandom(i * 19 + 301) * 960,
  size: 26 + seededRandom(i * 19 + 302) * 34,
  delay: Math.floor(seededRandom(i * 19 + 303) * 25),
  emoji: EMOJIS[Math.floor(seededRandom(i * 19 + 304) * EMOJIS.length)],
  color: DECO_COLORS[Math.floor(seededRandom(i * 19 + 305) * DECO_COLORS.length)],
  floatSpeed: 0.8 + seededRandom(i * 19 + 306) * 2.5,
  floatAmp: 8 + seededRandom(i * 19 + 307) * 18,
}));

// ==============================
// 装飾フレームコンポーネント
// ==============================
export const DecoFrame: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* テキスト背景のほんのり光るグロー */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: 1400,
          height: 500,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 65%)",
          borderRadius: "50%",
        }}
      />

      {/* 浮遊する装飾アイテム */}
      {decoItems.map((item, i) => {
        const s = spring({
          frame: frame - item.delay,
          fps,
          config: { damping: 10, stiffness: 150, mass: 0.5 },
        });

        // 正弦波で上下にふわふわ浮遊
        const floatY =
          Math.sin((frame - item.delay) * item.floatSpeed * 0.04) *
          item.floatAmp;
        // ゆっくり揺れる回転
        const rotation = Math.sin((frame - item.delay) * 0.025) * 20;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y + floatY,
              fontSize: item.size,
              transform: `scale(${s}) rotate(${rotation}deg)`,
              color: item.color,
              filter: "drop-shadow(1px 1px 3px rgba(0,0,0,0.15))",
              textShadow: `0 0 12px ${item.color}50`,
            }}
          >
            {item.emoji}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
