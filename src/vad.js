import { MicVAD } from '@ricky0123/vad-web';
export class VueVAD {
    constructor(options = {}) {
        this.instance = null;
        this.options = options;
    }
    async init(options = {}) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (typeof window === 'undefined') {
            return;
        }
        this.options = {
            ...this.options,
            ...options,
        };
        if (this.instance) {
            return this.instance;
        }
        this.instance = await MicVAD.new({
            model: (_a = this.options.model) !== null && _a !== void 0 ? _a : 'v5',
            baseAssetPath: (_b = this.options.baseAssetPath) !== null && _b !== void 0 ? _b : 'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/',
            onnxWASMBasePath: (_c = this.options.onnxWASMBasePath) !== null && _c !== void 0 ? _c : 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/',
            startOnLoad: false,
            positiveSpeechThreshold: (_d = this.options.positiveSpeechThreshold) !== null && _d !== void 0 ? _d : 0.8,
            negativeSpeechThreshold: (_e = this.options.negativeSpeechThreshold) !== null && _e !== void 0 ? _e : 0.5,
            redemptionMs: (_f = this.options.redemptionMs) !== null && _f !== void 0 ? _f : 800,
            preSpeechPadMs: (_g = this.options.preSpeechPadMs) !== null && _g !== void 0 ? _g : 300,
            minSpeechMs: (_h = this.options.minSpeechMs) !== null && _h !== void 0 ? _h : 250,
            onSpeechStart: () => {
                var _a, _b;
                (_b = (_a = this.options).onSpeechStart) === null || _b === void 0 ? void 0 : _b.call(_a);
            },
            onSpeechRealStart: () => {
                var _a, _b;
                (_b = (_a = this.options).onSpeechRealStart) === null || _b === void 0 ? void 0 : _b.call(_a);
            },
            onSpeechEnd: (audio) => {
                var _a, _b;
                (_b = (_a = this.options).onSpeechEnd) === null || _b === void 0 ? void 0 : _b.call(_a, audio);
            },
            onVADMisfire: () => {
                var _a, _b;
                (_b = (_a = this.options).onVADMisfire) === null || _b === void 0 ? void 0 : _b.call(_a);
            },
            onFrameProcessed: (probabilities, frame) => {
                var _a, _b;
                (_b = (_a = this.options).onFrameProcessed) === null || _b === void 0 ? void 0 : _b.call(_a, probabilities, frame);
            },
        });
        return this.instance;
    }
    async start() {
        var _a;
        if (!this.instance) {
            await this.init();
        }
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.start();
    }
    pause() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.pause();
    }
    destroy() {
        var _a;
        (_a = this.instance) === null || _a === void 0 ? void 0 : _a.destroy();
        this.instance = null;
    }
    get raw() {
        return this.instance;
    }
}
//# sourceMappingURL=vad.js.map