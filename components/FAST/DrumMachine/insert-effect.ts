import { FASTElement, customElement, html, attr, ValueConverter } from '@microsoft/fast-element';
import { dispatchCustomEvent, findEventTargets } from "core";

type EffectTyp = "gain" | "highpass" | "lowpass" | "pan";

const template = html<FASTElementInsertEffect>`
    <input 
        :value="${x => x.value}"
        min="${x => x.min}"
        max="${x => x.max}"
        step="${x => x.step}"
        @input="${(x, { event }) => x.onInput(event)}"
        @pointerup="${x => x.onPointerUp()}"
    type="range">
    <label>${x => x.value}</label>
`;

const numberConverter: ValueConverter = {
    toView(value: number): string { return value.toString(); },
    fromView(value: string): number { return Number.parseFloat(value); }
};

const effectTypConverter: ValueConverter = {
    toView(value: EffectTyp): string { return value; },
    fromView(value: string): EffectTyp {
        if (!(value === "gain" || value === "pan" || value === "highpass" || value === "lowpass")) {
            return "gain";
        }

        return value;
    }
};

const customEvent = dispatchCustomEvent();

@customElement({ name: "fast-insert-effect", template })
export class FASTElementInsertEffect extends FASTElement {
    @attr
    for = "";

    @attr({ converter: effectTypConverter })
    type: EffectTyp = "gain";

    @attr({ converter: numberConverter })
    value = 1;

    @attr({ converter: numberConverter })
    min = 0;

    @attr({ converter: numberConverter })
    max = 1;

    @attr({ converter: numberConverter })
    step = 0.01;

    onInput(e: Event) {
        let [input] = findEventTargets(e, "input");
        input && (this.value = input.valueAsNumber);
    }

    onPointerUp() {
        this.dispatchEvent(
            customEvent<RenderEffect>("rendereffect", { fxEl: this })
        );
    };

    // onpointerdown: ((this: GlobalEventHandlers, ev: PointerEvent) => any) | null;


    /** @FIXME UI of range input element needs this to work  */
    set forceUI(value: number) {
        this.value = value;
        /** @FIXME this is ugly & I hate it!! */
        let input = this.shadowRoot?.querySelector("input")!;
        input.value = this.value.toString();
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.dispatchEvent(
            customEvent<RenderChild>("renderchild", { el: this })
        );
    }
}
