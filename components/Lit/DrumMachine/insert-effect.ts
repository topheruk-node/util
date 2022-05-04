import { EffectTyp, findEventTargets, dispatchCustomEvent } from 'core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';


const customEvent = dispatchCustomEvent();

@customElement("lit-insert-effect")
export class LitInsertEffectElement extends LitElement {
    /** @TODO default value = "gain" else EffectTyp */
    @property() type: EffectTyp = "gain";

    @property() for = "kick";

    @property({ type: Number }) value = 1;

    @property({ type: Number }) min = 0;

    @property({ type: Number }) max = 1;

    @property({ type: Number }) step = 0.01;

    render() {
        return html`
            <label>${this.type}</label>
            <input 
                .value=${this.value}
                .max=${this.max}
                .min=${this.min}
                .step=${this.step}
                @input=${this.valueChange}
                @pointerup=${() => this.dispatchEvent(customEvent<LitInsertEvent>("litinsert", { detail: this }))}
            type=range>
            <output>${this.value}</output>
        `;
    }


    valueChange(e: Event) {
        let [input] = findEventTargets(e, "input");
        input && (this.value = input.valueAsNumber);
    };
}

declare global {
    interface HTMLElementTagNameMap {
        "lit-insert-effect": LitInsertEffectElement;
    }

    interface HTMLElementEventMap {
        "litinsert": LitInsertEvent;
    }

    type LitInsertEvent = CustomEvent<Pick<LitInsertEffectElement, "type" | "value">>;
}
