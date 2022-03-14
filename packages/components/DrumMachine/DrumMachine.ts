import { createEffectNode, createBufferSource, start, CustomElement } from "core-x";
import { html, isHTMLElement } from "core-x";
import { HTMLInsertEffectElement } from "./InsertEffect";
import { HTMLAudioTrackElement } from "./AudioTrack";
import { DEFAULT_MIN } from "../utils";

declare global { interface HTMLElementTagNameMap { "drum-machine": HTMLDrumMachineElement; } }

const isInsertEffect = isHTMLElement("insert-effect");
const isAudioTrack = isHTMLElement("audio-track");

/**
 * I have a audio-track that is rendered before the insert-effect
 * this is causing a bug with my renderChild method
 */
export class HTMLDrumMachineElement extends CustomElement {
    static get observedAttributes() {
        return ["mono"] as const;
    }

    fxs = new Array<HTMLInsertEffectElement>();

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
            <!-- FIXME: issue 1: slotted insert value should be overwritten if user explictly adds insert-effect nodes -->
            <!-- FIXME: audio-track should not render before insert-effect even though a drum-machine has one nested -->
            <!-- These issues don't occur when I add nodes directly to html page, only within the js file -->
            <slot name="bus"></slot>
            <!-- <audio-track type="group" name="bus"></audio-track> -->
            <slot name="insert">
                <!-- doesn't work! <insert-effect slot="insert" type="gain" value="0"></insert-effect> -->
            </slot>
            <slot name="track"></slot>
        `;
    }

    // TODO: learn about `MutationObserver1` object 
    connectedCallback() {
        this.addEventListener("renderchild", this.#renderChild);
        this.addEventListener("rendereffect", this.#renderEffect);
        this.addEventListener("rendertrack", this.#renderAudio);
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
        const doNothing = doSomething(this, audioEl);
        const fxs = this.fxs.flatMap(doNothing);

        if (audioEl.type === "group" || audioEl.src === "") return;

        const audio = await createBufferSource(audioEl.src);
        start(audio, ...fxs);
    }
}

const fxElAdded = (dm: HTMLDrumMachineElement, ie: HTMLInsertEffectElement) => {
    dm.fxs.push(ie);
};

const audioElAdded = (dm: HTMLDrumMachineElement, at: HTMLAudioTrackElement) => {
    if (at.type === "group") {
        dm.busTrack = dm.curTrack = at;
    }
    for (const fx of dm.fxs) {
        fx.htmlFor = at.name;
        at.fxs.set(fx.type, fx.valueAsNumber);
    };
};

// TODO: rename
const doSomething = (dm: HTMLDrumMachineElement, audioEl: HTMLAudioTrackElement) => (fxEl: HTMLInsertEffectElement) => {
    if (fxEl.htmlFor === audioEl.name) {
        audioEl.fxs.set(fxEl.type, fxEl.valueAsNumber);
    } else if (fxEl.htmlFor !== audioEl.name) {
        dm.curTrack = audioEl;

        fxEl.htmlFor = audioEl.name;
        fxEl.valueAsNumber = audioEl.fxs.get(fxEl.type) ?? DEFAULT_MIN;
    }

    return [
        dm.curTrack.fxs.get(fxEl.type),
        dm.busTrack.fxs.get(fxEl.type)
    ].map((value) => createEffectNode(fxEl.type, value ?? DEFAULT_MIN));
};


CustomElement.define("drum-machine", HTMLDrumMachineElement);
