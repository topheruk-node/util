import { dispatchCustomEvent, findEventTargets } from 'core';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

type EffectTyp = "gain" | "highpass" | "lowpass" | "pan";

const customEvent = dispatchCustomEvent();

@customElement("lit-insert-effect")
export class LitElementInsertEffect extends LitElement {
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
            type=range>
            <output>${this.value}</output>
        `;
    }

    oninput = (e: Event) => {
        let [input] = findEventTargets(e, "input");
        input && (this.value = input.valueAsNumber);
    };

    // logger decorator would be good to add
    onpointerup = () => this.dispatchEvent(
        customEvent<
            Pick<LitElementInsertEffect, "type" | "value">
        >("litinsert", this)
    );

    connectedCallback(): void {
        super.connectedCallback();

        this.dispatchEvent(
            customEvent("litloaded", null)
        );
    }
}