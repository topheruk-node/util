<script lang="ts">
    let insertEffects = [
        { type: "gain", min: 0, max: 1, step: 0.01, value: 0.75 },
        { type: "pan", min: -1, max: 1, step: 0.01, value: 0 },
        { type: "lowpass", min: 0, max: 24000, step: 100, value: 24000 },
        { type: "highpass", min: 0, max: 24000, step: 100, value: 0 },
    ];

    let audioTracks = [
        { type: "group", src: "", name: "bus" },
        { type: "solo", src: "/audio/kick01.wav", name: "kick-1" },
        { type: "solo", src: "/audio/kick02.wav", name: "kick-2" },
        { type: "solo", src: "/audio/clap01.wav", name: "clap-1" },
        { type: "solo", src: "/audio/snare01.wav", name: "snare-1" },
    ];
</script>

<main>
    <drum-machine mode="stereo">
        {#each insertEffects as { type, min, max, value, step }}
            <insert-effect slot="insert" {type} {min} {max} {value} {step} />
        {/each}
        {#each audioTracks as { type, src, name }}
            {#if type === "group"}
                <audio-track slot="bus" {name} {src} {type} />
            {:else}
                <audio-track slot="track" {name} {src} {type} />
            {/if}
        {/each}
    </drum-machine>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }
</style>
