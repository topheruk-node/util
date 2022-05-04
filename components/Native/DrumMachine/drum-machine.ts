import { createEffectNode, createBufferSource, start, HTMLCustomElement, BiConsumer, BiTransform, Transform } from "core";
import { html, isHTMLElement } from "core";
import { HTMLElementInsertEffect } from "./insert-effect";
import { HTMLAudioTrackElement } from "./audio-track";

type GetSliceOf<T> = BiTransform<HTMLDrumMachineElement, HTMLAudioTrackElement, Transform<HTMLElementInsertEffect, T[]>>;
type ChildAdded<T> = BiConsumer<HTMLDrumMachineElement, T>;


const isInsertEffect = isHTMLElement("insert-effect");
const isAudioTrack = isHTMLElement("audio-track");

/**
 * I have a audio-track that is rendered before the insert-effect
 * this is causing a bug with my renderChild method
 */
export class HTMLDrumMachineElement extends HTMLCustomElement {
    static get observedAttributes() {
        return ["mono"] as const;
    }

    fxs = new Array<HTMLElementInsertEffect>();

    busTrack = document.createElement("audio-track");
    curTrack = document.createElement("audio-track");

    render() {
        return html`
            <style>
                :host {
                    border: 1px red solid;
                    width: calc(4*50px);
                    height: calc(6*50px);
                    display: grid;
                }
                slot[name=bus]{
                    display: flex;
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
            </style>
            
            <slot name="bus"></slot>
            <slot name="insert"></slot>
            <slot name="track"></slot>
        `;
    }

    // TODO: learn about `MutationObserver1` object 
    connectedCallback() {
        this.addEventListener("htmlloaded", this.#renderChild);
        this.addEventListener("htmlinsert", this.#renderEffect);
        this.addEventListener("htmltrack", this.#renderAudio);
        // prepend the bus element last?
    }

    #renderChild({ detail: { el } }: CustomEvent<RenderChild>) {
        if (isInsertEffect(el)) return fxElAdded(this, el);
        if (isAudioTrack(el)) return audioElAdded(this, el);
    }

    #renderEffect({ detail: { fxEl } }: CustomEvent<RenderEffect>) {
        this.curTrack.fxs.set(fxEl.type, fxEl.valueAsNumber);
    }

    async #renderAudio({ detail: { audioEl } }: CustomEvent<RenderTrack>) {
        const fxs = this.fxs.flatMap(fetchEffecNode(this, audioEl));

        if (audioEl.type === "group" || audioEl.src === "") return;

        const audio = await createBufferSource(audioEl.src);
        start(audio, ...fxs);
    }
}

const fxElAdded: ChildAdded<HTMLElementInsertEffect> = (dm, ie) => {
    dm.fxs.push(ie);
};

const audioElAdded: ChildAdded<HTMLAudioTrackElement> = (dm, at) => {
    if (at.type === "group") dm.busTrack = dm.curTrack = at;

    for (const fx of dm.fxs) {
        fx.htmlFor = at.name;
        at.fxs.set(fx.type, fx.valueAsNumber);
    };
};

const fetchEffecNode: GetSliceOf<AudioNode> = (dm, audioEl) => fxEl => {
    if (fxEl.htmlFor === audioEl.name) {
        audioEl.fxs.set(fxEl.type, fxEl.valueAsNumber);
    } else if (fxEl.htmlFor !== audioEl.name) {
        dm.curTrack = audioEl;

        fxEl.htmlFor = audioEl.name;
        fxEl.valueAsNumber = audioEl.fxs.get(fxEl.type) ?? 0;
    }

    return [
        dm.curTrack.fxs.get(fxEl.type),
        dm.busTrack.fxs.get(fxEl.type)
    ].map(value => createEffectNode(fxEl.type, value ?? 0));
};

customElements.define("drum-machine", HTMLDrumMachineElement);


declare global { interface HTMLElementTagNameMap { "drum-machine": HTMLDrumMachineElement; } }
