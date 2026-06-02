import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// ==============================
// タイトル設定
// ==============================
const TITLE = "気まぐれハッピートーク";
const CHAR_DELAY = 4; // 各文字の登場間隔（フレーム数）

// 虹色カラーパレット（1文字ずつ異なる色 — 笑っていいとも風）
const CHAR_COLORS = [
  "#FF4081", // 気 — ピンク
  "#FF6D00", // ま — ディープオレンジ
  "#FFAB00", // ぐ — アンバー
  "#00C853", // れ — グリーン
  "#00B0FF", // ハ — ライトブルー
  "#AA00FF", // ッ — パープル
  "#FF4081", // ピ — ピンク
  "#FF6D00", // ー — ディープオレンジ
  "#FFAB00", // ト — アンバー
  "#00C853", // ー — グリーン
  "#00B0FF", // ク — ライトブルー
];

// ==============================
// メインタイトルコンポーネント
// ==============================
export const TitleText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: "36%",
        pointerEvents: "none",
      }}
    >
      {TITLE.split("").map((char, i) => {
        const delay = i * CHAR_DELAY;

        // スプリングアニメーションでバウンス登場
        const s = spring({
          frame: frame - delay,
          fps,
          config: {
            damping: 7,
            stiffness: 180,
            mass: 0.5,
          },
        });

        const translateY = interpolate(s, [0, 1], [120, 0]);
        const scale = interpolate(s, [0, 0.5, 1], [0, 1.4, 1]);
        const rotate = interpolate(s, [0, 1], [-25, 0]);

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: 110,
              fontFamily:
                '"Zen Maru Gothic", "Yu Gothic", "Meiryo", sans-serif',
              fontWeight: 900,
              color: CHAR_COLORS[i % CHAR_COLORS.length],
              WebkitTextStroke: "5px white",
              paintOrder: "stroke fill",
              transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
              filter: "drop-shadow(3px 4px 0px rgba(0,0,0,0.25))",
              lineHeight: 1.2,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};
