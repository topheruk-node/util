import { Consumer } from "../functional/mod";
import { html } from "./html";

function logger() { console.log("hi"); }

export class HTMLCustomElement extends HTMLElement {
    static get observedAttributes(): readonly string[] { return [] as const; }

    render(): Node {
        return html`<p>todo</p>`;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
            .append(this.render());
    }

    /**
     * TODO: I do like this function, but hate its name.
     * I will need to see if I can better describe what
     * this does, else this the best name I can think of.
     */
    updateChildProperty<K extends keyof HTMLElementTagNameMap>(selectors: K, callback: Consumer<HTMLElementTagNameMap[K]>): this;
    updateChildProperty<T extends Element = Element>(selectors: string, callback: Consumer<T>): this {
        const qs = (this.shadowRoot ?? this).querySelector(selectors);
        qs && callback(qs as T);
        return this;
    }

    connectedCallback() { this.addEventListener("click", logger); }

    disconnectedCallback() { this.removeEventListener("click", logger); }

    attributeChangedCallback(name: string, prev: string, curr: string) {
        console.log(`${name}: ${prev} -> ${curr}`);
    }

    static define<K extends keyof HTMLElementTagNameMap>(name: K, options?: ElementDefinitionOptions) {
        window.customElements.define(name, this, options);
    }
}