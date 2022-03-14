import { CustomElement, html } from "core-x";

declare global { interface HTMLElementTagNameMap { "x-counter": XCounter; } }

export class XCounter extends CustomElement {
    value = 0;

    render() { return html`<button>hello</button>`; };

    static get observedAttributes() {
        return ["value", "name"] as const;
    }

    connectedCallback(): void {
        this.addEventListener("click", this.#update);
    }

    #update() {
        console.log(++this.value);
    }
}

CustomElement.define("x-counter", XCounter);

