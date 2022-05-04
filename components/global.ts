import { PointerTyp } from "./utils";



declare global {
    interface HTMLElementEventMap {
        "renderchild": CustomEvent<RenderChild>;
        "renderosc": CustomEvent<RenderOsc>;
    }

    interface RenderChild { el: HTMLElement; }
    interface RenderOsc { osc: OscillatorNode, pointerTyp: PointerTyp; }
}

