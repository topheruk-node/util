import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { isHTMLElement, createEffectNode, createBufferSource, start } from "src-x";
import { AudioTrack } from "./audio-track";
import { InsertEffect } from "./insert-effect";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 1;

@customElement('drum-machine')
export class DrumMachine extends LitElement {
    static styles = css`
        :host {
            border: 1px red solid;
            width: calc(4*50px);
            height: calc(6*50px);
            display: grid;
        }

        slot[name=track]{
            display: grid;
            grid-template-columns: repeat(4, 50px);
            grid-template-rows: repeat(2,1fr);
            gap: 1fr;
        }

        slot[name=insert]{
            display: flex;
            flex-direction: column;
            width: 75px;
        }
    `;

    fxs: InsertEffect[] = [];

    busTrack!: AudioTrack; // FIXME: handle undefined behaviour
    curTrack!: AudioTrack; // FIXME: handle undefined behaviour

    render() {
        return html`
            <audio-track type="group" name="bus"></audio-track>
            <slot name="insert"></slot>
            <slot name="track"></slot>
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("slotadded", this.#slotAdded);
        this.addEventListener("selecteffect", this.#selectEffect);
        this.addEventListener("selectaudio", this.#selectAudio);
    }

    #slotAdded({ detail: { el } }: CustomEvent<SlotAdded>) {
        if (isHTMLElement("insert-effect")(el)) {
            this.fxs.push(el);
            return;
        };

        if (el.type === "group") {
            this.busTrack = this.curTrack = el;
        }

        for (const fx of this.fxs) {
            fx.for = "bus";
            el.fxs.set(fx.type, fx.value);
        };
    }

    #selectEffect({ detail: { fxEl } }: CustomEvent<SelectEffect>) {
        this.curTrack.fxs.set(fxEl.type, fxEl.value);
    }

    async #selectAudio({ detail: { audioEl } }: CustomEvent<SelectAudio>) {
        const fxs = this.fxs.flatMap(fxEl => {
            if (fxEl.for === audioEl.name) {
                audioEl.fxs.set(fxEl.type, fxEl.value);
            } else if (fxEl.for !== audioEl.name) {
                this.curTrack = audioEl;

                fxEl.for = audioEl.name;
                fxEl.value = audioEl.fxs.get(fxEl.type) ?? DEFAULT_MIN;
            }

            return [
                this.curTrack.fxs.get(fxEl.type),
                this.busTrack.fxs.get(fxEl.type)
            ].map((value) => createEffectNode(fxEl.type, value ?? DEFAULT_MIN).fx);
        });

        if (audioEl.type === "group" || audioEl.src === "") return;

        const { ctx, audio } = await createBufferSource(audioEl.src);
        start(audio, ctx.destination, ...fxs);
    };
}



declare global {
    interface HTMLElementTagNameMap {
        'drum-machine': DrumMachine;
    }
}
