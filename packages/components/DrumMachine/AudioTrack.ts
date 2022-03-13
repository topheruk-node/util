import { CustomElement, dispatchCustomEvent, html } from "core-x";

declare global { interface HTMLElementTagNameMap { "audio-track": HTMLAudioTrackElement; } }

const customEvent = dispatchCustomEvent();

// TODO: right click on track should return the unprocessed sound.
// bypassing the bus and straight to the ctx.
// this would not effect the insert values 
export class HTMLAudioTrackElement extends CustomElement {
    static get observedAttributes() {
        return ["src", "name", "type"];
    }

    fxs = new Map<string, number>();

    get name(): string { return this.getAttribute("name") ?? ""; }
    set name(value: string) { this.setAttribute("name", value); }

    get type(): "solo" | "group" { return this.getAttribute("type") as "solo" | "group" ?? "solo"; }
    set type(value: "solo" | "group") { this.setAttribute("type", value); }

    get src(): string { return this.getAttribute("src") ?? ""; }
    set src(value: string) { this.setAttribute("src", value); }

    render(): Node {
        return html`
            <style>
                :host {
                    --size: 48px
                }
                button {
                    width: var(--size);
                    height: var(--size);
                    background-color: none;
                }
            </style>
            <button>audio</button> 
        `;
    }

    connectedCallback() {
        if (!this.type) { this.type = "solo"; }

        this.dispatchEvent(customEvent<RenderChild>("renderchild", { el: this }));
        this.addEventListener("pointerdown", this.#pointerDown);
    }

    attributeChangedCallback(name: string, _: string, curr: string) {
        switch (name) {
            case HTMLAudioTrackElement.observedAttributes[1]:
                this.updateProperty("button", el => el.innerText = curr);
                return;
        }
    }

    #pointerDown() {
        this.dispatchEvent(
            customEvent<RenderTrack>("rendertrack", { audioEl: this })
        );
    }
}


CustomElement.define("audio-track", HTMLAudioTrackElement);
