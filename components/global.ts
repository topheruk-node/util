import { FASTElementAudioTrack } from "./FAST/DrumMachine/audio-track";
import { FASTElementDrumMachine } from "./FAST/DrumMachine/drum-machine";
import { FASTElementInsertEffect } from "./FAST/DrumMachine/insert-effect";
import { PointerTyp } from "./utils";

declare global {
    interface HTMLElementTagNameMap {
        "fast-audio-track": FASTElementAudioTrack;
        "fast-insert-effect": FASTElementInsertEffect;
        "fast-drum-machine": FASTElementDrumMachine;
    }
}

declare global {


    interface HTMLElementEventMap {
        "renderchild": CustomEvent<RenderChild>;
        "rendertrack": CustomEvent<RenderTrack>;
        "rendereffect": CustomEvent<RenderEffect>;
        "renderosc": CustomEvent<RenderOsc>;
    }

    interface RenderEffect { fxEl: FASTElementInsertEffect; }
    interface RenderTrack { audioEl: FASTElementAudioTrack; }
    interface RenderChild { el: HTMLElement; }
    interface RenderOsc { osc: OscillatorNode, pointerTyp: PointerTyp; }
}

