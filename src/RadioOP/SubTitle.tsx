import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

// ==============================
// サブタイトルコンポーネント
// ==============================
export const SubTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 左からスライドイン（スプリングアニメーション）
  const slideIn = spring({
    frame,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  });

  const x = interpolate(slideIn, [0, 1], [-800, 0]);
  const opacity = interpolate(slideIn, [0, 0.3, 1], [0, 0.5, 1]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        top: "25%",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontSize: 44,
          fontFamily: '"Zen Maru Gothic", "Yu Gothic", "Meiryo", sans-serif',
          fontWeight: 700,
          color: "#FF4081",
          WebkitTextStroke: "3px white",
          paintOrder: "stroke fill",
          transform: `translateX(${x}px)`,
          opacity,
          filter: "drop-shadow(2px 2px 0px rgba(0,0,0,0.25))",
          letterSpacing: "6px",
        }}
      >
        ポンポンとサオリンの
      </div>
    </div>
  );
};
