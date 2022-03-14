import { HTMLCustomElement, dispatchCustomEvent, findEventTargets, html } from "core-x";
import { DEFAULT_MAX, DEFAULT_MIN } from "../utils";

declare global { interface HTMLElementTagNameMap { "insert-effect": HTMLInsertEffectElement; } }

type EffectTyp = "gain" | "highpass" | "lowpass" | "pan";

const customEvent = dispatchCustomEvent();

export class HTMLInsertEffectElement extends HTMLCustomElement {
    static get observedAttributes() {
        return ["type", "value", "min", "max", "for", "step"] as const;
    }

    get htmlFor(): string { return this.getAttribute("for") ?? "bus"; }
    set htmlFor(value: string) { this.setAttribute("for", value); }

    get type(): EffectTyp { return this.getAttribute("type") as EffectTyp ?? "gain"; }
    set type(value: EffectTyp) { this.setAttribute("type", value); }

    get value(): string { return this.getAttribute("value") ?? DEFAULT_MIN.toString(); }
    set value(value: string) { this.setAttribute("value", value); }
    get valueAsNumber(): number { return +this.value; }
    set valueAsNumber(value: number) { this.value = value.toString(); }

    get min(): string { return this.getAttribute("min") ?? DEFAULT_MIN.toString(); }
    set min(value: string) { this.setAttribute("min", value); }
    get minAsNumber(): number { return +this.min; }
    set minAsNumber(value: number) { this.min = value.toString(); }

    get max(): string { return this.getAttribute("max") ?? DEFAULT_MAX.toString(); }
    set max(value: string) { this.setAttribute("max", value); }
    get maxAsNumber(): number { return +this.max; }
    set maxAsNumber(value: number) { this.max = value.toString(); }

    get step(): string { return this.getAttribute("step") ?? (0.01).toString(); }
    set step(value: string) { this.setAttribute("step", value); }
    get stepAsNumber(): number { return +this.step; }
    set stepAsNumber(value: number) { this.step = value.toString(); }

    render() {
        return html`
            <style>
                :host {
                    display: grid;
                    grid-template-areas: "a b" "c c"
                }
            </style>
            <label for="${this.type}" style="grid-area: a">effect</label>
            <input
                id="${this.type}"
                style="grid-area: c"
                type="range"
                min="${this.min}"
                value="${this.value}"
                max="${this.max}"
                step="${+this.step}"
            >
            <output style="grid-area: b">${this.value}</output>
        `;
    }

    connectedCallback() {
        this.dispatchEvent(customEvent<RenderChild>("renderchild", { el: this }));

        this.addEventListener("input", this.#inputChange);
        this.addEventListener("pointerup", this.#pointerUp);
    }

    attributeChangedCallback(a: string, _: string, q: string) {
        switch (a) {
            case HTMLInsertEffectElement.observedAttributes[0]:
                this.updateChildProperty("label", el => el.innerText = q);
                return;
            case HTMLInsertEffectElement.observedAttributes[1]:
                this
                    .updateChildProperty("input", el => el.value = q)
                    .updateChildProperty("output", el => el.innerText = q);
                return;
            case HTMLInsertEffectElement.observedAttributes[2]:
                this.updateChildProperty("input", el => el.min = q);
                return;
            case HTMLInsertEffectElement.observedAttributes[3]:
                this.updateChildProperty("input", el => el.max = q);
                return;
            case HTMLInsertEffectElement.observedAttributes[5]:
                this.updateChildProperty("input", el => el.step = q);
                return;
        }
    }

    #inputChange(e: Event) {
        let [input] = findEventTargets(e, "input");

        input && (this.valueAsNumber = input.valueAsNumber);
    }

    #pointerUp(_: Event) {
        this.dispatchEvent(
            customEvent<RenderEffect>("rendereffect", { fxEl: this })
        );
    }
}

HTMLCustomElement.define("insert-effect", HTMLInsertEffectElement);
