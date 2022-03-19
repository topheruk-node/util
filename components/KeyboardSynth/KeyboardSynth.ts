import { html, start, stop } from "core-x";
import { PointerTyp } from "../utils";

export default class KeyboardSynth extends HTMLElement {
    constructor() {
        super();
        this
            .attachShadow({ mode: "open" })
            .append(
                html`
                    <slot name="key"></slot>
                `
            );
    }

    connectedCallback() {
        this.addEventListener("renderosc", ({ detail: { osc, pointerTyp } }) => {
            switch (pointerTyp) {
                case PointerTyp.Down: return start(osc, osc.context.destination);
                case PointerTyp.Up: return stop(osc);
            }
        });
    }
}

customElements.define("keyboard-synth", KeyboardSynth);