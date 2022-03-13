import "components";
import "./x-counter";

let insertEffects = [
    { type: "gain", min: 0, max: 1, step: 0.01, value: 0.75 },
    { type: "pan", min: -1, max: 1, step: 0.01, value: 0 },
    { type: "lowpass", min: 0, max: 24000, step: 100, value: 24000 },
    { type: "highpass", min: 0, max: 24000, step: 100, value: 0 },
].map(init => {
    let insertEffect = document.createElement("insert-effect");

    insertEffect.type = init.type as "gain" | "pan" | "lowpass" | "highpass";
    insertEffect.minAsNumber = init.min;
    insertEffect.maxAsNumber = init.max;
    insertEffect.valueAsNumber = init.value;
    insertEffect.stepAsNumber = init.step;

    insertEffect.slot = "insert";
    return insertEffect;
});

let audioTracks = [
    { type: "group", src: "", name: "bus" },
    { type: "solo", src: "/assets/audio/kick01.wav", name: "kick-1" },
    { type: "solo", src: "/assets/audio/kick02.wav", name: "kick-2" },
    { type: "solo", src: "/assets/audio/clap01.wav", name: "clap-1" },
    { type: "solo", src: "/assets/audio/snare01.wav", name: "snare-1" },
].map(init => {
    let audioTrack = document.createElement("audio-track");

    audioTrack.type = init.type as "group" | "solo";
    audioTrack.src = init.src;
    audioTrack.name = init.name;

    audioTrack.slot = ["track", "bus"][Number(init.type === "group")];
    return audioTrack;
});

let drumMachine = document.createElement("drum-machine");

document.body.appendChild(drumMachine);
drumMachine.append(...insertEffects, ...audioTracks);

const counter = document.createElement("x-counter");
// counter
counter.setAttribute("value", "0");
counter.setAttribute("min", "0");
document.body.append(counter);