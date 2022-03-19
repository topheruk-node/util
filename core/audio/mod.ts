import { BiConsumer, BiTransform, Transform, TransformAsync } from "../functional/mod";


const ctx = new AudioContext();

interface CreateEffectOptions {
    type?: BiquadFilterType;
    value: number;
}

type CreateBuffer = Transform<string, Promise<AudioBufferSourceNode>>;

export const createOscillator = () => {
    const osc = ctx.createOscillator();
    let params = new AudioParam();
    osc.onended = () => {
        console.log("ended");
    };
    return osc;
};

export const createBufferSource: CreateBuffer = async path => {
    const audio = ctx.createBufferSource();
    const data = await fetch(path);
    const arrayBuffer = await data.arrayBuffer();
    audio.buffer = await ctx.decodeAudioData(arrayBuffer);
    return audio;
};

/**
 * If i make this a generic type where:
 * ```ts
 * CreateEffect<T extends AudioNode>
 * ```
 * This does not seem to properly cast.
 * ```ts
 * createEffectNode(...).fx: StereoPannerNode | GainNode;
 * ```
 * which is clearly wrong, but unsure how to get teh compiler to behave
 */
type CreateEffect = BiTransform<AudioContext, CreateEffectOptions, AudioNode>;

const createBiquadFilter: CreateEffect = (ctx, { value, type }) => {
    let fx = ctx.createBiquadFilter();
    fx.type = type ?? "highpass"; // what shall be the default filter type
    fx.frequency.value = value;
    return fx;
};

const createStereoPanner: CreateEffect = (ctx, { value }) => {
    let fx = ctx.createStereoPanner();
    fx.pan.value = value;
    return fx;
};

const createGain: CreateEffect = (ctx, { value }) => {
    let fx = ctx.createGain();
    fx.gain.value = value;
    return fx;
};

// TODO: change signature -> ctx:AudioContext, {value:number, type:BiquadFilterType}
export function createEffectNode(type: "gain" | "pan" | "lowpass" | "highpass", value: number) {
    switch (type) {
        case "lowpass":
        case "highpass": return createBiquadFilter(ctx, { type, value });
        case "pan": return createStereoPanner(ctx, { value });
        default: return createGain(ctx, { value });
    }
}

export const start = (src: AudioScheduledSourceNode, ...fxs: AudioNode[]) => {
    [...fxs, src.context.destination].reduce((a, b) => a.connect(b), src);
    src.start();
};

/**
 * FIXME: stop is already a function
 */
export const stop = (src: AudioScheduledSourceNode, ...fxs: AudioNode[]) => {
    src.stop();
};