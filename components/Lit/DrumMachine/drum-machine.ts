import { createBufferSource, createEffectNode, isHTMLElement, start } from 'core';
import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';
import { LitElementAudioTrack } from './audio-track';
import { LitElementInsertEffect } from './insert-effect';

declare global {
    interface HTMLElementTagNameMap {
        "lit-audio-track": LitElementAudioTrack;
        "lit-insert-effect": LitElementInsertEffect;
    }
}

const isAudioTrack = isHTMLElement("lit-audio-track");
const isInsertEffect = isHTMLElement("lit-insert-effect");

@customElement("lit-drum-machine")
export class LitElementDrumMachine extends LitElement {
    listInsert: Array<LitElementInsertEffect> = [];
    currentAudioTrack = document.createElement("lit-audio-track");

    render() {
        return html`
            <slot name=insert></slot>
            <slot name=track></slot>
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

        this.addEventListener("litinsert", (e, { detail: { type, value } } = e as CustomEvent<
            Pick<LitElementInsertEffect, "type" | "value">
        >) => {
            this.currentAudioTrack.fxs.set(type, value);
        });

        this.addEventListener("littrack", async (e, { detail: { src, fxs, name }, target } = e as CustomEvent<
            Pick<LitElementAudioTrack, "src" | "fxs" | "name">
        >) => {
            let nodes = this.#fetchEffectNodeList({ fxs, name, audioTrack: target as LitElementAudioTrack });
            if (src === "") return;
            const audio = await createBufferSource(src);
            start(audio, ...nodes);
        });
    }

    #fetchEffectNodeList({ fxs, name, audioTrack }:
        Pick<LitElementAudioTrack, "fxs" | "name"> & { audioTrack: LitElementAudioTrack; }
    ): AudioNode[] {
        let [start, end] = timer("loop");
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

const timer = (label: string) => {
    return [
        () => console.time(label),
        () => console.timeEnd(label)
    ];
};
