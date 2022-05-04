import { FASTElement, customElement, html, attr } from '@microsoft/fast-element';
import { dispatchCustomEvent } from "core";

const template = html<FASTElementAudioTrack>`
    <button @pointerdown="${x => x.onClick()}">${x => x.name}</button>
`;

const customEvent = dispatchCustomEvent();

@customElement({ name: "fast-audio-track", template })
export class FASTElementAudioTrack extends FASTElement {
    @attr name: string = "button";

    @attr src = "";

    fxs = new Map<string, number>();

    onClick() {
        this.dispatchEvent(
            customEvent<RenderTrack>("rendertrack", { audioEl: this })
        );
    }

    connectedCallback(): void {
        super.connectedCallback();

        this.dispatchEvent(
            customEvent<RenderChild>("renderchild", { el: this })
        );
    }
}