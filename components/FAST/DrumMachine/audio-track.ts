import { FASTElement, customElement, html, attr } from '@microsoft/fast-element';
import { dispatchCustomEvent } from "core";

const template = html<FASTAudioTrackElement>`
    <template
        @pointerdown=${x => x.dispatchEvent(customEvent<Pick<FASTAudioTrackElement, "src" | "fxs">>("fasttrack", x))}
    >
        <button>${x => x.name}</button>
    </template>
`;

const customEvent = dispatchCustomEvent();

@customElement({ name: "fast-audio-track", template })
export class FASTAudioTrackElement extends FASTElement {
    @attr name: string = "track";

    @attr src = "";

    fxs = new Map<string, number>();
}

declare global {
    interface HTMLElementTagNameMap {
        "fast-audio-track": FASTAudioTrackElement;
    }
}