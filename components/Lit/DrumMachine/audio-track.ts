import { dispatchCustomEvent } from 'core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const customEvent = dispatchCustomEvent();

@customElement("lit-audio-track")
export class LitEAudioTrackElement extends LitElement {
    @property() name = "track";

    @property() src = "";

    fxs = new Map<string, number>();

    render() {
        return html`
            <button 
                @pointerdown=${() => this.dispatchEvent(customEvent<LitTrackEvent>("littrack", { detail: this }))}
            >
                ${this.name}
            </button>
        `;
    }
}


declare global {
    interface HTMLElementTagNameMap {
        "lit-audio-track": LitEAudioTrackElement;
    }

    interface HTMLElementEventMap {
        "littrack": LitTrackEvent;
    }

    type LitTrackEvent = CustomEvent<Pick<LitEAudioTrackElement, "src" | "fxs" | "name">>;
}