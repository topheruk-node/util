import { FASTElement, customElement, html, attr, ValueConverter } from '@microsoft/fast-element';
import { EffectTyp, findEventTargets } from "core";

const template = html<FASTInsertEffectElement>`
    <template
        @pointerup=${x => x.$emit("fastinsert", x)}
        @input=${(x, { event }) => x.onInput(event)}
    >
        <label>${x => x.type}</label>
        <input 
            :value="${x => x.value}"
            min="${x => x.min}"
            max="${x => x.max}"
            step="${x => x.step}"
        type="range">
        <output>${x => x.value}</output>
    </template>
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

@customElement({ name: "fast-insert-effect", template })
export class FASTInsertEffectElement extends FASTElement {
    @attr for = "";

    @attr({ converter: effectTypConverter }) type: EffectTyp = "gain";

    @attr({ converter: numberConverter }) value = 1;

    @attr({ converter: numberConverter }) min = 0;

    @attr({ converter: numberConverter }) max = 1;

    @attr({ converter: numberConverter }) step = 0.01;

    onInput(e: Event) {
        let [input] = findEventTargets(e, "input");
        input && (this.value = input.valueAsNumber);
    };
}


declare global {
    interface HTMLElementTagNameMap {
        "fast-insert-effect": FASTInsertEffectElement;
    }

    interface HTMLElementEventMap {
        "fastinsert": FastInsertEvent;
    }

    type FastInsertEvent = CustomEvent<Pick<FASTInsertEffectElement, "type" | "value">>;
}