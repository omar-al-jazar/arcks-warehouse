import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { BrandMark, C, COPY, DISPLAY, DURATION, LangProvider, Rise, Stage, lerp, useTr } from "../kit";

const Claim: React.FC<{ line: string; sub?: string }> = ({ line, sub }) => (
  <Stage>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: 80 }}>
      <Rise from={0}>
        <p style={{ fontSize: 22, color: C.muted, letterSpacing: 4, margin: 0, fontWeight: 600 }}>ARC</p>
      </Rise>
      <Rise from={8} style={{ marginTop: 28 }}>
        <h1 style={{ fontFamily: DISPLAY, fontSize: 68, fontWeight: 800, margin: 0, lineHeight: 1.2, maxWidth: 1100 }}>
          {line}
        </h1>
      </Rise>
      {sub ? (
        <Rise from={24} style={{ marginTop: 24 }}>
          <p style={{ fontSize: 28, color: C.muted, margin: 0 }}>{sub}</p>
        </Rise>
      ) : null}
    </AbsoluteFill>
  </Stage>
);

const Body: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  const cuts = [0, 120, 240, 360, 480];
  const claims: { en: string; ar: string; subEn?: string; subAr?: string }[] = [
    {
      en: "It's Airbnb for film gear.",
      ar: "إير بي إن بي للمعدات السينمائية.",
      subEn: "Except you don't stay overnight.",
      subAr: "بس ما تنام عندنا.",
    },
    {
      en: "We digitize the warehouse clipboard.",
      ar: "رقمنا سبورة المستودع.",
      subEn: "With taxes.",
      subAr: "مع الضريبة.",
    },
    {
      en: "24-hour hold. No Series A required.",
      ar: "حجز ٢٤ ساعة. ما تحتاج جولة تمويل.",
    },
    {
      en: COPY.punch.en,
      ar: COPY.punch.ar,
      subEn: "/rent",
      subAr: "/rent",
    },
  ];

  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {claims.map((c, i) => (
        <Sequence key={i} from={cuts[i]} durationInFrames={(cuts[i + 1] ?? DURATION) - cuts[i]}>
          <Claim line={tr(c.en, c.ar)} sub={c.subEn ? tr(c.subEn, c.subAr ?? c.subEn) : undefined} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={40}>
        <AbsoluteFill style={{ alignItems: "flex-start", justifyContent: "flex-start", padding: 48 }}>
          <BrandMark size={40} />
        </AbsoluteFill>
      </Sequence>
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(10,10,11,${1 - lerp(t, 0, 10)})` }} />
    </AbsoluteFill>
  );
};

export const YcParody: React.FC<{ ar?: boolean }> = ({ ar }) => (
  <LangProvider ar={ar}>
    <Body />
  </LangProvider>
);
