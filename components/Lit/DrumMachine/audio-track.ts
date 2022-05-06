import { dispatchCustomEvent } from 'core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { audioTrackStyles, Effect } from './templates-and-styles';

const customEvent = dispatchCustomEvent();

declare global {
    interface HTMLElementTagNameMap {
        "lit-audio-track": LitAudioTrackElement;
    }
}

@customElement("lit-audio-track")
export class LitAudioTrackElement extends LitElement {
    @property() name = "track";//type string

    @property() src?: string;

    fxs = new Map<Effect, number>();

    #onPointerDown() {
        this.dispatchEvent(new CustomEvent("play-back", { detail: this, bubbles: true, composed: true }));
    }

    render() {
        return html`<button @pointerdown=${this.#onPointerDown}>${this.name}</button>`;
    }

    static styles = audioTrackStyles;
}