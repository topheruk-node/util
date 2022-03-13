import { Consumer, ConsumerAsync } from "../mod";

interface EventListenerConfig {
    type: keyof HTMLElementEventMap;
    callback: EventListener;
    options?: EventListenerOptions;
}

export interface UpdatePropertyConfig<K extends keyof HTMLElementTagNameMap> {
    tagName: K;
    ident?: string | undefined,
    field: keyof HTMLElementTagNameMap[K],
    value: HTMLElementTagNameMap[K][keyof HTMLElementTagNameMap[K]];
}

export type UpdatePropertyConfigMap = {
    [K in keyof HTMLElementTagNameMap]: {
        tagName: K,
        ident?: string | undefined,
        field: keyof HTMLElementTagNameMap[K],
        // FIXME: possible to infer the type from the field value?
        fn: (value: string) => HTMLElementTagNameMap[K][keyof HTMLElementTagNameMap[K]];
    }
}[keyof HTMLElementTagNameMap];

export const defineElement = ({ tagName, options }: { tagName: string, options?: ElementDefinitionOptions; }) => (constructor: CustomElementConstructor): void => {
    customElements.define(tagName, constructor, options);
};

/** @deprecated */
export class HTMLElementWrapper<T extends HTMLElement> {
    constructor(
        public el: T
    ) { }

    addEventListeners(...ls: EventListenerConfig[]) {
        ls.forEach(l => this.el.addEventListener(l.type, l.callback, l.options));
    };

    removeEventListenerMany(...ls: EventListenerConfig[]) {
        ls.forEach(l => this.el.removeEventListener(l.type, l.callback, l.options));
    };

    static defineCustomElements(...els: { tagName: string, fn: CustomElementConstructor; }[]) {
        for (const { tagName, fn: constructor } of els) {
            window.customElements.define(tagName, constructor);
        }
    }

    querySelector<K extends keyof HTMLElementTagNameMap>(t: K, v?: string): HTMLElementTagNameMap[K] | null {
        return (this.el.shadowRoot ?? this.el).querySelector(v ?? t);
    }

    updateProperty<K extends keyof HTMLElementTagNameMap>(selectors: K, callback: Consumer<HTMLElementTagNameMap[K]>): this;
    updateProperty<T extends Element = Element>(selectors: string, callback: Consumer<T>): this {
        const qs = (this.el.shadowRoot ?? this.el).querySelector(selectors);
        qs && callback(qs as T);
        return this;
    }
};
