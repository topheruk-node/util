import { FASTElement, customElement, html, attr } from '@microsoft/fast-element';

// Using `$emit` does not really matter as type saftey would likely only matter in a `declare global` block
const template = html<FASTAudioTrackElement>`
    <template
        @pointerdown=${x => x.$emit("fasttrack", x)}
    >
        <button>${x => x.name}</button>
    </template>
`;


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

    interface HTMLElementEventMap {
        "fasttrack": FastTrackEvent;
    }

    type FastTrackEvent = CustomEvent<Pick<FASTAudioTrackElement, "src" | "fxs" | "name">>;
}