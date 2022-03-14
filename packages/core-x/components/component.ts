import { Consumer } from "../functional/mod";
import { html } from "./html";

function logger() { console.log("hi"); }

export class HTMLCustomElement extends HTMLElement {
    /**
     * TODO: a more type-safe version of this 
     * is have a signature that dynamically updates
     * depending on the contents of the array
     * 
     * ```{ts}
     * observedAttributes(): readonly ["value", "min", "max"] { return ["value", "min", "max"]; }
     * ``` 
     */
    static get observedAttributes(): readonly string[] { return [] as const; }

    render(): Node {
        return html`<p>todo</p>`;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
            .append(this.render());
    }

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

    static define<K extends keyof HTMLElementTagNameMap>(name: K, constructor: CustomElementConstructor, options?: ElementDefinitionOptions) {
        window.customElements.define(name, constructor, options);
    }
}