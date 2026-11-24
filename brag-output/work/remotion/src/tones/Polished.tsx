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
  useArd,
  useTr,
} from "../kit";

const Body: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const ard = useArd();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={0} durationInFrames={150}>
        <Stage>
          <Rise from={0}>
            <BrandMark size={48} />
          </Rise>
          <Rise from={20} style={{ marginTop: 64, maxWidth: 1000 }}>
            <h1 style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 700, margin: 0, lineHeight: 1.25, color: C.fg }}>
              {tr(COPY.hook.en, COPY.hook.ar)}
            </h1>
          </Rise>
          <Rise from={48} style={{ marginTop: 28 }}>
            <p style={{ fontSize: 28, color: C.muted, margin: 0 }}>{tr(COPY.support.en, COPY.support.ar)}</p>
          </Rise>
        </Stage>
      </Sequence>
      <Sequence from={140} durationInFrames={180}>
        <Stage>
          <div style={{ display: "flex", gap: 40, height: "100%", alignItems: "center" }}>
            <div
              style={{
                flex: 1.2,
                borderRadius: 16,
                overflow: "hidden",
                height: 560,
                border: `1px solid ${C.line}`,
                transform: `scale(${springIn(t - 140, 4)})`,
              }}
            >
              <Shot file="kit-page-lg.jpg" />
            </div>
            <div style={{ flex: 1 }}>
              <Rise from={12}>
                <h2 style={{ fontFamily: DISPLAY, fontSize: 48, fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                  {tr("Live kit pages.", "صفحات عدة مباشرة.")}
                </h2>
              </Rise>
              <Rise from={28} style={{ marginTop: 20 }}>
                <p style={{ fontSize: 26, color: C.muted, margin: 0 }}>
                  {tr("Dates, zones, price — from the warehouse.", "تواريخ ومناطق وسعر — من المستودع.")}
                </p>
              </Rise>
            </div>
          </div>
        </Stage>
      </Sequence>
      <Sequence from={310} durationInFrames={160}>
        <Stage>
          <Rise from={0}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 700, margin: 0 }}>
              {tr(COPY.hold.en, COPY.hold.ar)}
            </h2>
          </Rise>
          <div style={{ marginTop: 48, display: "flex", gap: 20 }}>
            {COPY.zones.map((z, i) => {
              const s = springIn(t - 310, 6 + i * 10);
              return (
                <div
                  key={z.en}
                  style={{
                    flex: 1,
                    padding: "28px 24px",
                    borderRadius: 14,
                    border: `1px solid ${C.line}`,
                    background: C.card,
                    opacity: s,
                    transform: `translateY(${(1 - s) * 24}px)`,
                  }}
                >
                  <div style={{ color: C.daylight, fontWeight: 600 }}>{tr(z.en, z.ar)}</div>
                  <div style={{ fontFamily: DISPLAY, fontSize: 42, fontWeight: 700, marginTop: 12, color: C.accent }}>
                    {ard(z.fee)} {tr("SAR", "ر.س")}
                  </div>
                </div>
              );
            })}
          </div>
        </Stage>
      </Sequence>
      <Sequence from={460} durationInFrames={DURATION - 460}>
        <Stage>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <Rise from={0}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 700, margin: 0, maxWidth: 900, lineHeight: 1.25 }}>
                {tr(COPY.punch.en, COPY.punch.ar)}
              </h2>
            </Rise>
            <Rise from={20} style={{ marginTop: 28 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "14px 26px",
                  borderRadius: 10,
                  background: C.accent,
                  color: C.bg,
                  fontWeight: 700,
                  fontSize: 24,
                }}
              >
                {tr(COPY.cta.en, COPY.cta.ar)}
              </span>
            </Rise>
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(10,10,11,${1 - lerp(t, 0, 16)})` }} />
    </AbsoluteFill>
  );
};

export const Polished: React.FC<{ ar?: boolean }> = ({ ar }) => (
  <LangProvider ar={ar}>
    <Body />
  </LangProvider>
);
