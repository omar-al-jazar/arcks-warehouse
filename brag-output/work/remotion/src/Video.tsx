import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import {
  BrandMark,
  C,
  COPY,
  DISPLAY,
  DURATION,
  FPS,
  LangProvider,
  Rise,
  Shot,
  Stage,
  lerp,
  springIn,
  useArd,
  useLang,
  useTr,
} from "./kit";

export { DURATION, FPS };

const Hook: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const { ar } = useLang();
  return (
    <Stage>
      <Rise from={0}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <BrandMark />
          <span style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 28, letterSpacing: ar ? 0 : 4 }}>
            {COPY.brand}
          </span>
        </div>
      </Rise>
      <Rise from={10} style={{ marginTop: 48, maxWidth: 1100 }}>
        <h1
          style={{
            fontFamily: DISPLAY,
            fontSize: 84,
            fontWeight: 800,
            lineHeight: ar ? 1.25 : 1.05,
            margin: 0,
            color: C.fg,
          }}
        >
          {tr(COPY.hook.en, COPY.hook.ar, COPY.hook.sa)}
        </h1>
      </Rise>
      <Rise from={28} style={{ marginTop: 28 }}>
        <p style={{ fontSize: 32, color: C.muted, margin: 0, maxWidth: 720 }}>
          {tr(COPY.support.en, COPY.support.ar, COPY.support.sa)}
        </p>
      </Rise>
      <div
        style={{
          position: "absolute",
          right: ar ? undefined : 80,
          left: ar ? 80 : undefined,
          bottom: 64,
          width: 520,
          height: 320,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid ${C.line}`,
          transform: `scale(${springIn(t, 20)})`,
          boxShadow: "0 40px 100px rgba(0,0,0,.45)",
        }}
      >
        <Shot file="kit-page.jpg" />
      </div>
    </Stage>
  );
};

const Zones: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const ard = useArd();
  return (
    <Stage>
      <Rise from={0}>
        <h2 style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 800, margin: 0 }}>
          {tr(COPY.zonesTitle.en, COPY.zonesTitle.ar, COPY.zonesTitle.sa)}
        </h2>
      </Rise>
      <div style={{ display: "flex", gap: 24, marginTop: 56 }}>
        {COPY.zones.map((z, i) => {
          const s = springIn(t, 8 + i * 8);
          return (
            <div
              key={z.en}
              style={{
                flex: 1,
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 18,
                padding: "36px 32px",
                opacity: s,
                transform: `translateY(${(1 - s) * 40}px)`,
              }}
            >
              <div style={{ fontSize: 28, color: C.daylight, fontWeight: 700 }}>{tr(z.en, z.ar)}</div>
              <div style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 800, marginTop: 18, color: C.accent }}>
                {ard(z.fee)} <span style={{ fontSize: 28, color: C.muted }}>{tr("SAR", "ر.س", "ر.س")}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

const Hold: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  return (
    <Stage>
      <div style={{ display: "flex", gap: 48, alignItems: "center", height: "100%" }}>
        <div
          style={{
            flex: 1.1,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${C.line}`,
            height: 520,
            transform: `scale(${springIn(t, 4)})`,
          }}
        >
          <Shot file="hold-card.jpg" />
        </div>
        <div style={{ flex: 1 }}>
          <Rise from={8}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 58, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
              {tr(COPY.hold.en, COPY.hold.ar, COPY.hold.sa)}
            </h2>
          </Rise>
          <Rise from={24} style={{ marginTop: 24 }}>
            <p style={{ fontSize: 28, color: C.muted, margin: 0 }}>
              {tr("Confirm on WhatsApp. Then you pay.", "نأكد على واتساب. بعدين تدفع.", "نأكد على واتساب. بعدين تدفع.")}
            </p>
          </Rise>
        </div>
      </div>
    </Stage>
  );
};

const Outro: React.FC = () => {
  const tr = useTr();
  return (
    <Stage>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Rise from={0}>
          <BrandMark size={72} />
        </Rise>
        <Rise from={10} style={{ marginTop: 36 }}>
          <h2 style={{ fontFamily: DISPLAY, fontSize: 72, fontWeight: 800, margin: 0, maxWidth: 1000, lineHeight: 1.2 }}>
            {tr(COPY.punch.en, COPY.punch.ar, COPY.punch.sa)}
          </h2>
        </Rise>
        <Rise from={26} style={{ marginTop: 28 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "16px 28px",
              borderRadius: 12,
              background: C.accent,
              color: C.bg,
              fontWeight: 800,
              fontSize: 28,
            }}
          >
            {tr(COPY.cta.en, COPY.cta.ar, COPY.cta.sa)}
          </div>
        </Rise>
      </AbsoluteFill>
    </Stage>
  );
};

const FadeIn: React.FC = () => {
  const t = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `rgba(10,10,11,${1 - lerp(t, 0, 12)})`,
      }}
    />
  );
};

const Body: React.FC = () => {
  const cuts = [0, 90, 210, 360, 480];
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={cuts[0]} durationInFrames={cuts[1] - cuts[0] + 12}>
        <Hook />
      </Sequence>
      <Sequence from={cuts[1]} durationInFrames={cuts[2] - cuts[1] + 12}>
        <Zones />
      </Sequence>
      <Sequence from={cuts[2]} durationInFrames={cuts[3] - cuts[2] + 12}>
        <Hold />
      </Sequence>
      <Sequence from={cuts[3]} durationInFrames={DURATION - cuts[3]}>
        <Outro />
      </Sequence>
      <Sequence from={0} durationInFrames={DURATION}>
        <FadeIn />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ ar?: boolean; sa?: boolean }> = ({ ar, sa }) => (
  <LangProvider ar={ar} sa={sa}>
    <Body />
  </LangProvider>
);
