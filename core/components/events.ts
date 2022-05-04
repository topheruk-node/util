import { isHTMLElement } from "./find-target";

// TODO: will ask r/typescript for a better solution
declare global {
    interface HTMLElementCustomEventMap { }
}

// TODO: add type saftey

export const dispatchCustomEvent = (init?: CustomEventInit) => {
    const [cancelable, bubbles, composed] = [init?.cancelable ?? false, init?.bubbles ?? true, init?.composed ?? true];
    return <T extends CustomEvent>(type: string, { detail }: Pick<T, "detail">) =>
        new CustomEvent(type, { detail, cancelable, bubbles, composed });
};


export function customEvent<K extends keyof HTMLElementCustomEventMap>(type: K, detail: Pick<HTMLElementCustomEventMap[K], "detail">) {
    const [cancelable, bubbles, composed] = [false, true, true];
    return new CustomEvent(type, { detail, cancelable, bubbles, composed });
};

type FindTarget = <T extends (keyof HTMLElementTagNameMap)[]>(e: Event, ...ss: T) => {
    [K in keyof T]: T[K] extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T[K]] | undefined : never;
};

export const findEventTargets: FindTarget = (e, ...ss) => Object(ss.map(s => e.composedPath().find(isHTMLElement(s))));

