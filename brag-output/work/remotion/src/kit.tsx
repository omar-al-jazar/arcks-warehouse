import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { thmanyahDisplay, thmanyahText } from "./thmanyah";

export const FPS = 30;
export const DURATION = 600; // 20s

export const C = {
  bg: "#0a0a0b",
  fg: "#f5f3f0",
  muted: "#9a9792",
  accent: "#ffa534",
  daylight: "#4da3ff",
  card: "#141416",
  line: "#2a2a2e",
};

type Lang = { ar: boolean; sa: boolean };
const LangCtx = createContext<Lang>({ ar: false, sa: false });

export function LangProvider({
  ar,
  sa,
  children,
}: {
  ar?: boolean;
  sa?: boolean;
  children: React.ReactNode;
}) {
  return <LangCtx.Provider value={{ ar: !!ar, sa: !!sa }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);

export function useTr() {
  const { ar, sa } = useLang();
  return <T,>(en: T, arText: T, saText?: T): T => (ar ? (sa && saText !== undefined ? saText : arText) : en);
}

const DIG = "٠١٢٣٤٥٦٧٨٩";
export function useArd() {
  const { ar } = useLang();
  return (s: string) => (ar ? s.replace(/[0-9]/g, (d) => DIG[+d]).replace(/%/g, "٪") : s);
}

export const SANS = thmanyahText("system-ui, sans-serif");
export const DISPLAY = thmanyahDisplay(SANS);

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const lerp = (f: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

export const Rise: React.FC<{
  children: React.ReactNode;
  from: number;
  style?: React.CSSProperties;
}> = ({ children, from, style }) => {
  const t = useCurrentFrame();
  const a = lerp(t, from, from + 18);
  return (
    <div
      style={{
        opacity: a,
        transform: `translateY(${(1 - a) * 22}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Shot: React.FC<{ file: string; style?: React.CSSProperties }> = ({ file, style }) => (
  <Img
    src={staticFile(`shots/${file}`)}
    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", ...style }}
  />
);

export const BrandMark: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 12,
      background: C.accent,
      color: C.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS,
      fontWeight: 800,
      fontSize: size * 0.38,
    }}
  >
    ARC
  </div>
);

export const Stage: React.FC<{
  children: React.ReactNode;
  vertical?: boolean;
}> = ({ children, vertical }) => {
  const { ar } = useLang();
  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        color: C.fg,
        fontFamily: SANS,
        direction: ar ? "rtl" : "ltr",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 70% 55% at 70% 20%, rgba(77,163,255,.22), transparent 70%), radial-gradient(ellipse 55% 45% at 15% 80%, rgba(255,165,52,.16), transparent 65%)",
        }}
      />
      <AbsoluteFill style={{ padding: vertical ? "72px 56px" : "64px 80px" }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const springIn = (frame: number, delay = 0) =>
  spring({ frame: frame - delay, fps: FPS, config: { damping: 16 } });

export const COPY = {
  brand: "ARC",
  hook: {
    en: "Film gear for your Riyadh shoot.",
    ar: "معدات تصوير لتصويرك بالرياض.",
    sa: "معدات تصوير لتصويرك بالرياض.",
  },
  support: {
    en: "Pick a kit. Choose dates. Hold it for 24 hours.",
    ar: "اختر عدة، حدد التواريخ، واحجزها ٢٤ ساعة.",
    sa: "اختر عدة، حدد التواريخ، واحجزها ٢٤ ساعة.",
  },
  zonesTitle: {
    en: "Deliver across Riyadh.",
    ar: "توصيل في كل الرياض.",
    sa: "توصيل بكل الرياض.",
  },
  zones: [
    { en: "Central", ar: "وسط الرياض", fee: "100" },
    { en: "North", ar: "شمال الرياض", fee: "150" },
    { en: "South", ar: "جنوب الرياض", fee: "175" },
  ],
  hold: {
    en: "24-hour hold. No card charged yet.",
    ar: "حجز ٢٤ ساعة. ما في خصم من البطاقة بعد.",
    sa: "حجز ٢٤ ساعة. ما في خصم من البطاقة بعد.",
  },
  punch: {
    en: "From the warehouse to your set.",
    ar: "من المستودع لتصويرك.",
    sa: "من المستودع لتصويرك.",
  },
  cta: {
    en: "/rent",
    ar: "/rent",
    sa: "/rent",
  },
};
