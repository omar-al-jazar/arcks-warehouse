import { continueRender, delayRender, staticFile } from "remotion";

type Face = { file: string; weight: string };

const FAMILIES: Record<string, Face[]> = {
  "Thmanyah Sans": [
    { file: "thmanyahsans-Light.woff2", weight: "300" },
    { file: "thmanyahsans-Regular.woff2", weight: "400" },
    { file: "thmanyahsans-Medium.woff2", weight: "500" },
    { file: "thmanyahsans-Bold.woff2", weight: "700" },
    { file: "thmanyahsans-Black.woff2", weight: "900" },
  ],
  "Thmanyah Serif Display": [
    { file: "thmanyahserifdisplay-Light.woff2", weight: "300" },
    { file: "thmanyahserifdisplay-Regular.woff2", weight: "400" },
    { file: "thmanyahserifdisplay-Medium.woff2", weight: "500" },
    { file: "thmanyahserifdisplay-Bold.woff2", weight: "700" },
    { file: "thmanyahserifdisplay-Black.woff2", weight: "900" },
  ],
};

const loaded = new Set<string>();

const load = (family: string, faces: Face[]) => {
  if (typeof document === "undefined" || loaded.has(family)) return;
  loaded.add(family);
  const handle = delayRender(`Loading font ${family}`);
  Promise.all(
    faces.map((f) =>
      new FontFace(family, `url(${staticFile(`fonts/thmanyah/${f.file}`)})`, { weight: f.weight })
        .load()
        .then((face) => document.fonts.add(face)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(`Font ${family} failed`, err);
      continueRender(handle);
    });
};

for (const [family, faces] of Object.entries(FAMILIES)) load(family, faces);

export const thmanyahText = (fallback: string) =>
  FAMILIES["Thmanyah Sans"] ? `"Thmanyah Sans", ${fallback}` : fallback;
export const thmanyahDisplay = (fallback: string) =>
  FAMILIES["Thmanyah Serif Display"]
    ? `"Thmanyah Serif Display", "Thmanyah Sans", ${fallback}`
    : fallback;
