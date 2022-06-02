const defaultContext = new AudioContext();

interface CreateEffectOptions {
    type?: BiquadFilterType;
    value: number;
}

export const createOscillator = (ctx = defaultContext) => {
    const osc = ctx.createOscillator();
    // let params = new AudioParam();
    osc.onended = () => {
        console.log("ended");
    };
    return osc;
};


/** @FIXME seems to behave really slow */
export const createBufferSource = async (path: string, ctx = defaultContext) => {
    const data = await fetch(path);
    const arrayBuffer = await data.arrayBuffer();
    const audio = ctx.createBufferSource();
    audio.buffer = await ctx.decodeAudioData(arrayBuffer);
    return audio;
};

export const createBufferSourceUpdated = async (arrayBuffer: ArrayBuffer, ctx = defaultContext) => {
    const audio = ctx.createBufferSource();
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
type CreateEffect = (ctx: AudioContext, opt: CreateEffectOptions) => AudioNode;

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
export function createEffectNode(type: "gain" | "pan" | "lowpass" | "highpass", value: number, ctx = defaultContext) {
    switch (type) {
        case "lowpass":
        case "highpass": return createBiquadFilter(ctx, { type, value });
        case "pan": return createStereoPanner(ctx, { value });
        default: return createGain(ctx, { value });
    }
}

export function start(src: AudioScheduledSourceNode, ...fxs: AudioNode[]): void {
    [...fxs, src.context.destination].reduce((a, b) => a.connect(b), src);
    src.start();
};

/**
 * FIXME: stop is already a function
 */
export const stop = (src: AudioScheduledSourceNode) => {
    src.stop();
};

export const effectTyp = ["gain", "pan", "highpass", "lowpass"] as const;
export type EffectTyp = typeof effectTyp[number];