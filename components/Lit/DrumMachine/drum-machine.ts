import { createBufferSource, createEffectNode, isHTMLElement, start, timer } from 'core';
import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { LitEAudioTrackElement } from './audio-track';
import { LitInsertEffectElement } from './insert-effect';

declare global {
    interface HTMLElementTagNameMap {
        "lit-audio-track": LitEAudioTrackElement;
        "lit-insert-effect": LitInsertEffectElement;
    }
}

const isAudioTrack = isHTMLElement("lit-audio-track");
const isInsertEffect = isHTMLElement("lit-insert-effect");

@customElement("lit-drum-machine")
export class LitDrumMachineElement extends LitElement {
    listInsert: Array<LitInsertEffectElement> = [];
    currentAudioTrack = document.createElement("lit-audio-track");

    render() {
        return html`
            <slot 
                name=insert
                @litinsert=${this.cacheInsertValue}
            ></slot>
            <slot 
                name=track
                @littrack=${this.playbackAudio}
            ></slot>
        `;
    }

    connectedCallback(): void {
        super.connectedCallback();

        /** @TODO try using the `queryAssignedElements` API */
        this.addEventListener("litloaded", ({ target }) => {
            if (isAudioTrack(target)) {
                this.currentAudioTrack = target;
                for (const insert of this.listInsert) {
                    insert.for = target.name;
                    target.fxs.set(insert.type, insert.value);
                };
            } else if (isInsertEffect(target)) {
                this.listInsert.push(target);
            }
        });
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
        return this.listInsert.flatMap(insert => {
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