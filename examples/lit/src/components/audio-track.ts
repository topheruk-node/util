import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { dispatchCustomEvent } from "src-x";

const customEvent = dispatchCustomEvent();

@customElement('audio-track')
export class AudioTrack extends LitElement {
    static styles = css`
        :host {
            --size: 48px
        }
        button {
            width: var(--size);
            height: var(--size);
            background-color: none;
        }
    `;

    @property({ reflect: true })
    type: "group" | "solo" = "solo";

    @property({ reflect: true })
    src = "";

    @property({ reflect: true })
    name = "audio";

    fxs = new Map<string, number>();

    render() {
        return html`
            <button @pointerdown=${this.#onPointerDown}>${this.name}</button>
        `;
    }

    async #onPointerDown(e: PointerEvent) {
        this.dispatchEvent(
            customEvent<SelectAudio>("selectaudio", { audioEl: this })
        );
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.dispatchEvent(customEvent<SlotAdded>("slotadded", { el: this }));
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'audio-track': AudioTrack;
    }
}
