type IsHTMLElement<T> = (obj: any) => obj is T;
type IsHTMLElementMap<T> = { [K in keyof T]: T[K] extends keyof HTMLElementTagNameMap ? (o: any) => o is HTMLElementTagNameMap[T[K]] : K };

export type FindTargetObjectMap<T> = { [K in keyof T]: T[K] extends IsHTMLElement<infer E> ? (E | undefined) : never };

export const isHTMLElement = <K extends keyof HTMLElementTagNameMap, T extends HTMLElementTagNameMap[K]>(s: K) => (o: any): o is T => o.localName == s;

/** @deprecated until I find a use for this fucntion. */
const isHTMLElementMany = <T extends (keyof HTMLElementTagNameMap)[]>(...ns: T): IsHTMLElementMap<T> => {
    return Object(ns.map(n => isHTMLElement(n)));
};

/** @deprecated until I find a use for this fucntion. */
export const [isTextArea, isButton, isAnchor] = isHTMLElementMany("textarea", "button", "a");
