import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { Confetti } from "./Confetti";
import { Stars } from "./Stars";
import { TitleText } from "./TitleText";
import { SubTitle } from "./SubTitle";
import { DecoFrame } from "./DecoFrame";

export const RadioOP: React.FC = () => {
  const frame = useCurrentFrame();

  // ============================================
  // グローバル「ドンッ！」バウンス (frame 178)
  // ============================================
  const donFrame = frame - 178;
  let globalScale = 1;
  let globalRotate = 0;
  if (donFrame >= 0 && donFrame < 22) {
    const t = donFrame / 22;
    globalScale = 1 + Math.sin(t * Math.PI) * 0.13;
    globalRotate = Math.sin(t * Math.PI) * 2.5;
  }

  // ドンッ！時のホワイトフラッシュ
  let flashOpacity = 0;
  if (donFrame >= 0 && donFrame < 12) {
    flashOpacity = interpolate(donFrame, [0, 3, 12], [0, 0.3, 0], {
      extrapolateRight: "clamp",
    });
  }

  // ============================================
  // グローバル フェードアウト (frame 415〜475)
  // — opacity + scale down + 上方向に移動で明確な退場演出
  // ============================================
  const globalOpacity = interpolate(frame, [415, 475], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeScale = interpolate(frame, [415, 475], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeTranslateY = interpolate(frame, [415, 475], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${globalScale * fadeScale}) rotate(${globalRotate}deg) translateY(${fadeTranslateY}px)`,
          opacity: globalOpacity,
        }}
      >
        {/* 紙吹雪エフェクト — frame 0 から開始 */}
        <Sequence from={0}>
          <Confetti />
        </Sequence>

        {/* キラキラ星 — frame 5 から開始 */}
        <Sequence from={5}>
          <Stars />
        </Sequence>

        {/* 装飾エフェクト — frame 90 から開始 */}
        <Sequence from={90}>
          <DecoFrame />
        </Sequence>

        {/* サブタイトル「ポンポンとサオリンの」— frame 75 から開始 */}
        <Sequence from={75}>
          <SubTitle />
        </Sequence>

        {/* メインタイトル「気まぐれハッピートーク」— frame 15 から開始 */}
        <Sequence from={15}>
          <TitleText />
        </Sequence>
      </div>

      {/* ホワイトフラッシュオーバーレイ */}
      {flashOpacity > 0 && (
        <AbsoluteFill
          style={{
            backgroundColor: "white",
            opacity: flashOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
