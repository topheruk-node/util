import { dispatchCustomEvent, html, createOscillator } from "core";
import { PointerTyp } from "../utils";

const customEvent = dispatchCustomEvent();

export default class SynthKey extends HTMLElement {
    osc!: OscillatorNode;

    constructor() {
        super();
        this
            .attachShadow({ mode: "open" })
            .append(
                html`
                    <button>key</button>
                `
            );
    }

    connectedCallback() {
        this.dispatchEvent(customEvent<RenderChild>("renderchild", { el: this }));
        this.addEventListener("pointerdown", this.#pointerDown);
        this.addEventListener("pointerup", this.#pointerUp);
    }

    #pointerDown(e: PointerEvent) {
        this.osc = createOscillator();
        this.dispatchEvent(customEvent<RenderOsc>("renderosc", { osc: this.osc, pointerTyp: PointerTyp.Down }));
    }

    #pointerUp(e: PointerEvent) {
        this.dispatchEvent(customEvent<RenderOsc>("renderosc", { osc: this.osc, pointerTyp: PointerTyp.Up }));
    }
}

customElements.define("synth-key", SynthKey);