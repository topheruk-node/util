import { FASTElement, customElement, html, slotted, observable, elements } from '@microsoft/fast-element';
import { FASTAudioTrackElement } from './audio-track';
import { FASTInsertEffectElement } from './insert-effect';
import { createBufferSource, createEffectNode, start, timer } from "core";

/** @TODO currentButton name needs to be visible for accessibilty reasons */
const template = html<FASTDrumMachineElement>`
    <template 
        @fasttrack=${(x, { event }) => x.playbackAudio(event)}
        @fastinsert=${(x, { event }) => x.cacheInsertValue(event)}
    >
        <slot name="insert" ${slotted({ property: "listOfInsert", filter: elements() })}></slot>
        <slot name="track" ${slotted({ property: "listOfTrack", filter: elements() })}></slot>
    </template>
`;


@customElement({ name: "fast-drum-machine", template })
export class FASTDrumMachineElement extends FASTElement {
    /** @TODO next agenda is to potentially remove this but it seems to work fine anyway */
    currentAudioTrack = document.createElement("fast-audio-track");

    @observable listOfInsert!: FASTInsertEffectElement[];
    listOfInsertChanged(_prev: FASTInsertEffectElement[], _next: FASTInsertEffectElement[]) { }

    @observable listOfTrack!: FASTAudioTrackElement[];
    listOfTrackChanged(_prev: FASTAudioTrackElement[], next: FASTAudioTrackElement[]) {
        // console.log(!prev?.at(-1)) <- prev === undefined or never[];
        for (const track of next) {
            this.currentAudioTrack = track;
            for (const insert of this.listOfInsert) {
                insert.for = track.name;
                track.fxs.set(insert.type, insert.value);
            };
        }//O(n^2)
    }

    cacheInsertValue(e: Event, { detail: { type, value } } = e as CustomEvent<
        Pick<FASTInsertEffectElement, "type" | "value">
    >) {
        this.currentAudioTrack.fxs.set(type, value);
    };

    async playbackAudio(e: Event, { detail: { src, fxs, name }, target } = e as CustomEvent<
        Pick<FASTAudioTrackElement, "src" | "fxs" | "name">
    >) {
        let nodes = this.#fetchEffectNodeList({ fxs, name, audioTrack: target as FASTAudioTrackElement });
        if (src === "") return;
        const audio = await createBufferSource(src);
        start(audio, ...nodes);
    };

    #fetchEffectNodeList({ fxs, name, audioTrack }:
        Pick<FASTAudioTrackElement, "fxs" | "name"> & { audioTrack: FASTAudioTrackElement; }
    ): AudioNode[] {
        let [start, end] = timer("loop");
        return this.listOfInsert.flatMap(insert => {
            start();
            if (insert.for === name) {
                fxs.set(insert.type, insert.value);
            } else if (insert.for !== name) {
                this.currentAudioTrack = audioTrack;
                insert.for = audioTrack.name;
                insert.value = audioTrack.fxs.get(insert.type) ?? 0;
            }
            end();
            return [this.currentAudioTrack.fxs.get(insert.type)].map(v => createEffectNode(insert.type, v ?? 0));
        });
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "fast-drum-machine": FASTDrumMachineElement;
    }
}