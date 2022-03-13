import { html, css, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { dispatchCustomEvent } from "src-x";

const customEvent = dispatchCustomEvent();

@customElement('insert-effect')
export class InsertEffect extends LitElement {
    static styles = css`
        :host {
            display: grid;
            grid-template-areas: "a b" "c c";
        }
    `;

    @property({ type: Number, reflect: true })
    value = 1;

    @property({ type: Number, reflect: true })
    min = 0;

    // must : value <= max
    // if value > max then max = value
    @property({ type: Number, reflect: true })
    max = 1;

    @property({ type: Number, reflect: true })
    step = 0.01;

    // if value not match, default to "gain"
    @property({ reflect: true })
    type: "gain" | "pan" = "gain";

    @property({ reflect: true })
    for = "bus";

    render() {
        return html`
            <label style="grid-area: a">${this.type}</label>
            <input style="grid-area: c" @input=${this.#onInput} type="range" value="${this.value}" min="${this.min}"
                max="${this.max}" step="${this.step}">
            <output style="grid-area: b">${this.value}</output>
        `;
    }

    #onInput(e: InputEvent) {
        this.value = +(e.target as HTMLInputElement).value;
    }

    #onPointerUp() {
        this.dispatchEvent(
            customEvent<SelectEffect>("selecteffect", { fxEl: this })
        );
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.dispatchEvent(customEvent<SlotAdded>("slotadded", { el: this }));
        this.addEventListener("pointerup", this.#onPointerUp);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'insert-effect': InsertEffect;
    }
}
