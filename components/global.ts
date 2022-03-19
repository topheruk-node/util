import { HTMLAudioTrackElement } from "./DrumMachine/AudioTrack";
import { HTMLInsertEffectElement } from "./DrumMachine/InsertEffect";
import { PointerTyp } from "./utils";

declare global {


    interface HTMLElementEventMap {
        "renderchild": CustomEvent<RenderChild>;
        "rendertrack": CustomEvent<RenderTrack>;
        "rendereffect": CustomEvent<RenderEffect>;
        "renderosc": CustomEvent<RenderOsc>;
    }

    interface RenderEffect { fxEl: HTMLInsertEffectElement; }
    interface RenderTrack { audioEl: HTMLAudioTrackElement; }
    interface RenderChild { el: HTMLElement; }
    interface RenderOsc { osc: OscillatorNode, pointerTyp: PointerTyp; }
}

