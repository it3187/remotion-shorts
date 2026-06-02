import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, Img, staticFile, interpolate } from "remotion";

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // 実写画像を動画っぽく見せるテクニック（Ken Burns エフェクト）
  // 5秒間（0〜149フレーム）かけてゆっくりズームインする
  const scale = interpolate(
    frame,
    [0, durationInFrames - 1],
    [1, 1.25],
    { extrapolateRight: "clamp" }
  );

  // 同時に少しだけ横にカメラをパン（スライド）させる
  const translateX = interpolate(
    frame,
    [0, durationInFrames - 1],
    [0, -50],
    { extrapolateRight: "clamp" }
  );

  // テキストのフェードインアニメーション（最初の1秒間 = 0〜30フレーム）
  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const textY = interpolate(frame, [0, 30], [50, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* 生成したAI画像を配置して動かす */}
      <Img
        src={staticFile("runner.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      />
      
      {/* 映画のようなテキストオーバーレイ */}
      <div
        style={{
          position: "absolute",
          bottom: 250,
          left: 80,
          color: "white",
          fontFamily: "Inter, sans-serif",
          fontSize: 90,
          fontWeight: 800,
          textShadow: "0px 10px 40px rgba(0,0,0,0.9)",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`
        }}
      >
        KEEP<br/>RUNNING
      </div>
    </AbsoluteFill>
  );
};
