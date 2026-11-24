import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./kit";
import { Video } from "./Video";
import { Polished } from "./tones/Polished";
import { YcParody } from "./tones/YcParody";
import { Chaotic } from "./tones/Chaotic";
import { Deadpan } from "./tones/Deadpan";
import { Cinematic } from "./tones/Cinematic";
import { AppStore } from "./tones/AppStore";

const W = 1920;
const H = 1080;
const VW = 1080;
const VH = 1920;

export const Root: React.FC = () => (
  <>
    <Composition id="Arc-Default" component={Video} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: false, sa: false }} />
    <Composition id="Arc-Default-AR" component={Video} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: true, sa: false }} />
    <Composition id="Arc-Default-SA" component={Video} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: true, sa: true }} />
    <Composition id="Arc-Polished" component={Polished} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: true }} />
    <Composition id="Arc-YcParody" component={YcParody} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: true }} />
    <Composition id="Arc-Chaotic" component={Chaotic} durationInFrames={540} fps={FPS} width={W} height={H} defaultProps={{ ar: true }} />
    <Composition id="Arc-Deadpan" component={Deadpan} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: true }} />
    <Composition id="Arc-Cinematic" component={Cinematic} durationInFrames={DURATION} fps={FPS} width={W} height={H} defaultProps={{ ar: true, sa: true }} />
    <Composition id="Arc-AppStore" component={AppStore} durationInFrames={DURATION} fps={FPS} width={VW} height={VH} defaultProps={{ ar: true, sa: true }} />
  </>
);
