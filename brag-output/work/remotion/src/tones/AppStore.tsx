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

const Card: React.FC<{ title: string; body: string; delay: number }> = ({ title, body, delay }) => {
  const t = useCurrentFrame();
  const s = springIn(t, delay);
  return (
    <div
      style={{
        background: C.card,
        border: `1px solid ${C.line}`,
        borderRadius: 24,
        padding: "36px 32px",
        opacity: s,
        transform: `translateY(${(1 - s) * 36}px)`,
      }}
    >
      <h3 style={{ fontFamily: DISPLAY, fontSize: 36, fontWeight: 800, margin: 0 }}>{title}</h3>
      <p style={{ fontSize: 24, color: C.muted, margin: "16px 0 0", lineHeight: 1.4, whiteSpace: "pre-line" }}>{body}</p>
    </div>
  );
};

const Body: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const ard = useArd();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={0} durationInFrames={120}>
        <Stage vertical>
          <Rise from={0}>
            <BrandMark size={72} />
          </Rise>
          <Rise from={14} style={{ marginTop: 28 }}>
            <h1 style={{ fontFamily: DISPLAY, fontSize: 64, fontWeight: 900, margin: 0, lineHeight: 1.2 }}>ARC</h1>
          </Rise>
          <Rise from={28} style={{ marginTop: 18 }}>
            <p style={{ fontSize: 28, color: C.muted, margin: 0 }}>
              {tr(COPY.support.en, COPY.support.ar, COPY.support.sa)}
            </p>
          </Rise>
        </Stage>
      </Sequence>
      <Sequence from={110} durationInFrames={150}>
        <Stage vertical>
          <Rise from={0}>
            <h2 style={{ fontFamily: DISPLAY, fontSize: 44, fontWeight: 800, margin: 0 }}>
              {tr("Browse kits", "تصفح المعدات", "تصفح المعدات")}
            </h2>
          </Rise>
          <div
            style={{
              marginTop: 28,
              borderRadius: 20,
              overflow: "hidden",
              border: `1px solid ${C.line}`,
              height: 720,
              transform: `scale(${springIn(t - 110, 6)})`,
            }}
          >
            <Shot file="kit-page.jpg" />
          </div>
        </Stage>
      </Sequence>
      <Sequence from={250} durationInFrames={160}>
        <Stage vertical>
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 40 }}>
            <Card
              title={tr("Riyadh zones", "مناطق الرياض", "مناطق الرياض")}
              body={COPY.zones.map((z) => `${tr(z.en, z.ar)} · ${ard(z.fee)} ${tr("SAR", "ر.س")}`).join("\n")}
              delay={4}
            />
            <Card
              title={tr(COPY.hold.en, COPY.hold.ar, COPY.hold.sa)}
              body={tr("WhatsApp confirm. Pay after.", "تأكيد واتساب. تدفع بعد.", "تأكيد واتساب. تدفع بعد.")}
              delay={14}
            />
          </div>
        </Stage>
      </Sequence>
      <Sequence from={400} durationInFrames={DURATION - 400}>
        <Stage vertical>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 56 }}>
            <Rise from={0}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: 52, fontWeight: 800, margin: 0, lineHeight: 1.25 }}>
                {tr(COPY.punch.en, COPY.punch.ar, COPY.punch.sa)}
              </h2>
            </Rise>
            <Rise from={18} style={{ marginTop: 32 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "18px 36px",
                  borderRadius: 14,
                  background: C.accent,
                  color: C.bg,
                  fontWeight: 800,
                  fontSize: 28,
                }}
              >
                /rent
              </span>
            </Rise>
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(10,10,11,${1 - lerp(t, 0, 14)})` }} />
    </AbsoluteFill>
  );
};

export const AppStore: React.FC<{ ar?: boolean; sa?: boolean }> = ({ ar, sa }) => (
  <LangProvider ar={ar} sa={sa}>
    <Body />
  </LangProvider>
);
