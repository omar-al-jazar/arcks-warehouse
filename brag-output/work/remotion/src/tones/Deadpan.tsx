import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { BrandMark, C, COPY, DISPLAY, DURATION, LangProvider, Rise, Stage, lerp, useTr } from "../kit";

const Line: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Stage>
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <Rise from={8}>
        <h1 style={{ fontFamily: DISPLAY, fontSize: 56, fontWeight: 600, margin: 0, maxWidth: 900, lineHeight: 1.35, color: C.fg }}>
          {children}
        </h1>
      </Rise>
    </AbsoluteFill>
  </Stage>
);

const Body: React.FC = () => {
  const t = useCurrentFrame();
  const tr = useTr();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <Sequence from={0} durationInFrames={140}>
        <Stage>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
            <Rise from={0}>
              <BrandMark size={64} />
            </Rise>
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <Sequence from={130} durationInFrames={150}>
        <Line>{tr("This is a rental website.", "هذا موقع تأجير.")}</Line>
      </Sequence>
      <Sequence from={270} durationInFrames={150}>
        <Line>{tr(COPY.hold.en, COPY.hold.ar)}</Line>
      </Sequence>
      <Sequence from={410} durationInFrames={DURATION - 410}>
        <Stage>
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
            <Rise from={0}>
              <p style={{ fontSize: 28, color: C.muted, margin: 0 }}>{tr(COPY.punch.en, COPY.punch.ar)}</p>
            </Rise>
            <Rise from={24} style={{ marginTop: 36 }}>
              <span style={{ fontFamily: DISPLAY, fontSize: 48, fontWeight: 700 }}>/rent</span>
            </Rise>
          </AbsoluteFill>
        </Stage>
      </Sequence>
      <AbsoluteFill style={{ pointerEvents: "none", background: `rgba(10,10,11,${1 - lerp(t, 0, 20)})` }} />
    </AbsoluteFill>
  );
};

export const Deadpan: React.FC<{ ar?: boolean }> = ({ ar }) => (
  <LangProvider ar={ar}>
    <Body />
  </LangProvider>
);
