import { createBufferSource, createEffectNode, start, timer } from 'core';
import { LitElement, html } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { LitEAudioTrackElement } from './audio-track';
import { LitInsertEffectElement } from './insert-effect';

@customElement("lit-drum-machine")
export class LitDrumMachineElement extends LitElement {
    // listInsert: Array<LitInsertEffectElement> = [];
    currentAudioTrack = document.createElement("lit-audio-track");

    @queryAssignedElements({ slot: "insert" })
    listOfInsert!: LitInsertEffectElement[];

    @queryAssignedElements({ slot: "track" })
    listOfTrack!: LitEAudioTrackElement[];

    render() {
        return html`
            <slot 
                name=insert
                @slotchange=${() => console.log(this.listOfInsert)}
                @litinsert=${this.cacheInsertValue}
            ></slot>
            <slot 
                name=track
                @slotchange=${this.listOfTrackChange}
                @littrack=${this.playbackAudio}
            ></slot>
        `;
    }

    listOfTrackChange() {
        // only do this initially, every other time no need to loop through every track
        for (const track of this.listOfTrack) {
            this.currentAudioTrack = track;
            for (const insert of this.listOfInsert) {
                insert.for = track.name;
                track.fxs.set(insert.type, insert.value);
            };
        }//O(n^2)
    }

    cacheInsertValue(e: Event, { detail: { type, value } } = e as LitInsertEvent) {
        this.currentAudioTrack.fxs.set(type, value);
    };

    async playbackAudio(e: Event, { detail: { src, fxs, name }, target } = e as LitTrackEvent) {
        let nodes = this.#fetchEffectNodeList({ fxs, name, audioTrack: target as LitEAudioTrackElement });
        if (src === "") return;
        const audio = await createBufferSource(src);
        start(audio, ...nodes);
    }

    #fetchEffectNodeList({ fxs, name, audioTrack }:
        Pick<LitEAudioTrackElement, "fxs" | "name"> & { audioTrack: LitEAudioTrackElement; }
    ): AudioNode[] {
        let [start, end] = timer("lit-loop");
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
        "lit-drum-machine": LitDrumMachineElement;
    }
}