import { dispatchCustomEvent } from 'core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

const customEvent = dispatchCustomEvent();

@customElement("lit-audio-track")
export class LitElementAudioTrack extends LitElement {
    @property()
    name = "track";

    @property()
    src = "";

    fxs = new Map<string, number>();

    render() {
        return html`
            <button>${this.name}</button>
        `;
    }

    onpointerdown = () => this.dispatchEvent(
        customEvent<
            Pick<LitElementAudioTrack, "src" | "fxs">
        >("littrack", this)
    );

    connectedCallback(): void {
        super.connectedCallback();

        this.dispatchEvent(
            customEvent("litloaded", null)
        );
    }
}
