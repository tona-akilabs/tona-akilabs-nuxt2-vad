export function float32ToPCM16(audio) {
    const pcm16 = new Int16Array(audio.length);
    for (let i = 0; i < audio.length; i++) {
        const sample = Math.max(-1, Math.min(1, audio[i]));
        pcm16[i] =
            sample < 0
                ? sample * 32768
                : sample * 32767;
    }
    return pcm16.buffer;
}
//# sourceMappingURL=utils.js.map