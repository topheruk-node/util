import { AudioTrack } from "./audio-track";
import { InsertEffect } from "./insert-effect";

declare global {
    interface HTMLElementEventMap {
        "slotadded": CustomEvent<{ el: InsertEffect | AudioTrack; }>;
        "selectaudio": CustomEvent<{ audioEl: AudioTrack; }>;
        "selecteffect": CustomEvent<{ fxEl: InsertEffect; }>;
    }

    interface SelectEffect { fxEl: InsertEffect; }
    interface SelectAudio { audioEl: AudioTrack; }
    interface SlotAdded { el: InsertEffect | AudioTrack; }
}