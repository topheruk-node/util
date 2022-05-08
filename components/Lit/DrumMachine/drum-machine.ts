import { createBufferSource, createEffectNode, start } from 'core';
import { LitElement, html } from 'lit';
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { ref, Ref, createRef } from 'lit/directives/ref.js';
import { LitAudioTrackElement } from './audio-track';
import { LitEffectInsertElement } from './effect-insert';
import { drumSamplerStyles } from './templates-and-styles';

declare global {
    interface HTMLElementTagNameMap {
        "lit-drum-sampler": LitDrumMachineElement;
    }
}

@customElement("lit-drum-sampler")
export class LitDrumMachineElement extends LitElement {
    @queryAssignedElements({ slot: "insert" }) listOfInserts!: LitEffectInsertElement[];

    @queryAssignedElements({ slot: "track" }) listOfTracks!: LitAudioTrackElement[];

    @property({ type: Boolean }) bus = false;

    private currentTrack!: LitAudioTrackElement;

    busTrackRef: Ref<LitAudioTrackElement> = createRef();

    /** @debug debug purposes */
    @state() dbgAudioNodePath = "desination";

    /** @debug debug purposes */
    @state() dbgCurrentTrackName = "";

    firstUpdated() {
        const bus = this.busTrackRef.value;
        if (!bus) return;

        for (const insert of this.listOfInserts) {
            insert.for = bus.name;
            bus.fxs.set(insert.type, insert.value);
        }//O(n)

        this.dbgCurrentTrackName = bus.name;
    }

    #onTrackSlotChange() {
        for (const track of this.listOfTracks) {
            this.currentTrack = track;

            for (const insert of this.listOfInserts) {
                insert.for = track.name;
                track.fxs.set(insert.type, insert.value);
            };

            this.dbgCurrentTrackName = track.name;
        }//O(n^2) this could be concurrent
    }

    #onCacheValue(e: Event) {
        let target = e.target as LitEffectInsertElement;
        this.currentTrack.fxs.set(target.type, target.value);
    }

    async #onPlayback(e: Event) {
        let target = e.target as LitAudioTrackElement;

        this.dbgCurrentTrackName = target.name;//TODO: render an icon maybe?

        let audioNodes = this.listOfInserts.flatMap(insert => {
            if (insert.for !== target.name) {
                insert.for = target.name;
                this.currentTrack = target;
            }

            // im not too sure if this can be refactored at all
            const fx = createEffectNode(insert.type, insert.value = target.fxs.get(insert.type) ?? 0);
            if (!this.bus || (target.name === "bus")) return fx;

            const busFx = createEffectNode(insert.type, this.busTrackRef.value!.fxs.get(insert.type) ?? 0);
            return [fx, busFx];
        });

        if (target.src) {
            const audio = await createBufferSource(target.src);
            start(audio, ...audioNodes);
        }
    }

    render() {
        let bus = html`<lit-audio-track id="bus" ${ref(this.busTrackRef)} @play-back=${this.#onPlayback} name="bus"/>`;

        return html`
        ${when(this.bus, () => bus)}
        
        <slot
            @cache-value=${this.#onCacheValue}
        name="insert"></slot>

        <slot 
            @play-back=${this.#onPlayback}
            @slotchange=${this.#onTrackSlotChange}
        name="track"></slot>
        
        <br>
        [current selected track] ${this.dbgCurrentTrackName} 
        `;
    }

    static styles = drumSamplerStyles;
}