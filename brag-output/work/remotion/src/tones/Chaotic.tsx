import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { C, DISPLAY, LangProvider, SANS, Stage, lerp, springIn, useLang, useTr } from "../kit";

const Flash: React.FC<{ text: string; accent?: boolean; from: number }> = ({ text, accent, from }) => {
  const t = useCurrentFrame();
  const { ar } = useLang();
  const s = springIn(t, from);
  const shake = Math.sin((t - from) * 1.7) * (1 - s) * 12;
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: accent ? C.accent : C.bg,
        color: accent ? C.bg : C.fg,
        transform: `translate(${shake}px, ${-shake * 0.4}px) scale(${0.85 + s * 0.2})`,
      }}
    >
      <h1
        style={{
          fontFamily: DISPLAY,
          fontSize: 96,
          fontWeight: 900,
          margin: 0,
          textAlign: "center",
          padding: 48,
          lineHeight: 1.1,
          textTransform: ar ? "none" : "uppercase",
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};

const Body: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const beats: { text: string; accent?: boolean; len: number }[] = [
    { text: tr("GEAR.", "معدات."), accent: true, len: 45 },
    { text: tr("RIYADH.", "الرياض."), len: 45 },
    { text: tr("PICK DATES.", "حدد التواريخ."), accent: true, len: 50 },
    { text: tr("HOLD 24H.", "احجز ٢٤ س."), len: 55 },
    { text: tr("NO CARD YET.", "بدون بطاقة."), accent: true, len: 55 },
    { text: tr("WHATSAPP.", "واتساب."), len: 50 },
    { text: tr("SHOOT.", "صور."), accent: true, len: 60 },
    { text: "/rent", len: 80 },
  ];

  let cursor = 0;
  return (
    <AbsoluteFill style={{ background: C.bg, fontFamily: SANS }}>
      {beats.map((b, i) => {
        const from = cursor;
        cursor += b.len;
        return (
          <Sequence key={i} from={from} durationInFrames={b.len + 4}>
            <Stage>
              <Flash text={b.text} accent={b.accent} from={0} />
            </Stage>
          </Sequence>
        );
      })}
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(10,10,11,${1 - lerp(t, 0, 6)})` }} />
    </AbsoluteFill>
  );
};

export const Chaotic: React.FC<{ ar?: boolean }> = ({ ar }) => (
  <LangProvider ar={ar}>
    <Body />
  </LangProvider>
);
