import { isHTMLElement } from "./find-target";

// TODO: will ask r/typescript for a better solution
declare global {
    interface HTMLElementCustomEventMap { }
}

// TODO: add type saftey
type Dispatch = (init?: CustomEventInit) => <T>(type: string, detail: T) => CustomEvent<T>;

export const dispatchCustomEvent: Dispatch = init => {
    const [cancelable, bubbles, composed] = [init?.cancelable ?? false, init?.bubbles ?? true, init?.composed ?? true];
    return (type, detail) => new CustomEvent(type, { detail, cancelable, bubbles, composed });
};


export function customEvent<K extends keyof HTMLElementCustomEventMap>(type: K, detail: Pick<HTMLElementCustomEventMap[K], "detail">) {
    const [cancelable, bubbles, composed] = [false, true, true];
    return new CustomEvent(type, { detail, cancelable, bubbles, composed });
};

type FindTarget = <T extends (keyof HTMLElementTagNameMap)[]>(e: Event, ...ss: T) => {
    [K in keyof T]: T[K] extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T[K]] | undefined : never;
};

export const findEventTargets: FindTarget = (e, ...ss) => Object(ss.map(s => e.composedPath().find(isHTMLElement(s))));

