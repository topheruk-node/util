import { FASTElement, customElement, html } from '@microsoft/fast-element';
import { FASTElementAudioTrack } from './audio-track';
import { FASTElementInsertEffect } from './insert-effect';
import { isHTMLElement, createBufferSource, createEffectNode, start } from "core";

/** @TODO currentButton name needs to be visible for accessibilty reasons */
const template = html<FASTElementDrumMachine>`
    <slot name="insert"></slot>
    <slot name="track"></slot>
`;

const isAudioTrack = isHTMLElement("fast-audio-track");
const isInsertEffect = isHTMLElement("fast-insert-effect");

@customElement({ name: "fast-drum-machine", template })
export class FASTElementDrumMachine extends FASTElement {

    fxs = new Array<FASTElementInsertEffect>();

    currentAudioTrack = document.createElement("fast-audio-track");

    connectedCallback(): void {
        super.connectedCallback();

        this.addEventListener("renderchild", this.#onRenderChild);
        this.addEventListener("rendereffect", this.#onRenderInsert);
        this.addEventListener("rendertrack", this.#onRenderTrack);
    }

    #onRenderChild({ target }: CustomEvent<RenderChild>) {
        if (isAudioTrack(target)) {
            this.currentAudioTrack = target;
            for (const fx of this.fxs) {
                fx.for = target.name;
                target.fxs.set(fx.type, fx.value);
            };
        } else if (isInsertEffect(target)) {
            this.fxs.push(target);
        }
    }

    #onRenderInsert({ detail: { fxEl } }: CustomEvent<RenderEffect>) {
        this.currentAudioTrack.fxs.set(fxEl.type, fxEl.value);
    }

    async #onRenderTrack({ detail: { audioEl } }: CustomEvent<RenderTrack>) {
        let fxs = this.#fetchEffectNodes(audioEl);
        if (audioEl.src === "") return;
        const audio = await createBufferSource(audioEl.src);
        start(audio, ...fxs);
    }

    #fetchEffectNodes(audioTrack: FASTElementAudioTrack): AudioNode[] {
        let [start, end] = timer("loop");
        return this.fxs.flatMap((fx) => {
            start();
            if (fx.for === audioTrack.name) {
                audioTrack.fxs.set(fx.type, fx.value);
            } else if (fx.for !== audioTrack.name) {
                this.currentAudioTrack = audioTrack;
                fx.for = audioTrack.name;
                fx.value = audioTrack.fxs.get(fx.type) ?? 0;
            }
            end();
            return [this.currentAudioTrack.fxs.get(fx.type)].map(v => createEffectNode(fx.type, v ?? 0));
        });
    };
}

const timer = (label: string) => {
    return [
        () => console.time(label),
        () => console.timeEnd(label)
    ];
};





// srcElement -- @depreciated
// target
// currentTarget