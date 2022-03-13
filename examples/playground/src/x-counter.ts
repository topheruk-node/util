import { customElement, CustomElement, html } from "core-x";

export class XCounter extends CustomElement {
    value = 0;

    render() { return html`<button>hello</button>`; };

    static get observedAttributes() {
        return ["value"];
    }

    connectedCallback(): void {
        this.addEventListener("click", this.#update);
    }

    #update() {
        console.log(++this.value);
    }
}

customElement("x-counter", XCounter);

declare global { interface HTMLElementTagNameMap { "x-counter": XCounter; } }
