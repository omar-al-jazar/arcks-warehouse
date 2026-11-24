import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  BrandMark,
  C,
  COPY,
  DISPLAY,
  DURATION,
  LangProvider,
  Rise,
  Shot,
  Stage,
  lerp,
  springIn,
  useLang,
  useTr,
} from "../kit";

const Body: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const { ar } = useLang();
  return (
    <AbsoluteFill style={{ background: "#050506" }}>
      <Sequence from={0} durationInFrames={100}>
        <Stage>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <Rise from={10}>
              <p style={{ letterSpacing: ar ? 0 : 12, fontSize: 20, color: C.muted, margin: 0, fontWeight: 600 }}>
                {tr("RIYADH", "الرياض", "الرياض")}
              </p>
            </Rise>
            <Rise from={24} style={{ marginTop: 20 }}>
              <h1 style={{ fontFamily: DISPLAY, fontSize: 96, fontWeight: 900, margin: 0, color: C.fg }}>ARC</h1>
            </Rise>
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <Sequence from={90} durationInFrames={160}>
        <Stage>
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `scale(${1.08 - springIn(t - 90, 0) * 0.08})`,
              opacity: 0.55,
            }}
          >
            <Shot file="kit-page-lg.jpg" />
          </div>
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(5,5,6,.92) 0%, rgba(5,5,6,.4) 55%, transparent 100%)" }} />
          <Rise from={12} style={{ marginTop: 180, maxWidth: 780 }}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
              {tr(COPY.hook.en, COPY.hook.ar, COPY.hook.sa)}
            </h2>
          </Rise>
        </Stage>
      </Sequence>
      <Sequence from={240} durationInFrames={160}>
        <Stage>
          <Rise from={0}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, margin: 0, lineHeight: 1.25, maxWidth: 1000 }}>
              {tr(COPY.hold.en, COPY.hold.ar, COPY.hold.sa)}
            </h2>
          </Rise>
          <Rise from={28} style={{ marginTop: 32 }}>
            <p style={{ fontSize: 30, color: C.muted, margin: 0, maxWidth: 640 }}>
              {tr("Confirm on WhatsApp. Then you pay.", "نأكد على واتساب. بعدين تدفع.", "نأكد على واتساب. بعدين تدفع.")}
            </p>
          </Rise>
          <div
            style={{
              position: "absolute",
              right: ar ? undefined : 80,
              left: ar ? 80 : undefined,
              bottom: 64,
              width: 420,
              height: 260,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${C.line}`,
              transform: `scale(${springIn(t - 240, 16)})`,
            }}
          >
            <Shot file="hold-card.jpg" />
          </div>
        </Stage>
      </Sequence>
      <Sequence from={390} durationInFrames={DURATION - 390}>
        <Stage>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <Rise from={0}>
              <BrandMark size={64} />
            </Rise>
            <Rise from={14} style={{ marginTop: 32 }}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: 68, fontWeight: 800, margin: 0, maxWidth: 1000, lineHeight: 1.25 }}>
                {tr(COPY.punch.en, COPY.punch.ar, COPY.punch.sa)}
              </h2>
            </Rise>
            <Rise from={32} style={{ marginTop: 28 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.accent }}>/rent</span>
            </Rise>
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(5,5,6,${1 - lerp(t, 0, 18)})` }} />
    </AbsoluteFill>
  );
};

export const Cinematic: React.FC<{ ar?: boolean; sa?: boolean }> = ({ ar, sa }) => (
  <LangProvider ar={ar} sa={sa}>
    <Body />
  </LangProvider>
);
