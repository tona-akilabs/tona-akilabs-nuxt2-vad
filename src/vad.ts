import { MicVAD } from '@ricky0123/vad-web'
import type { VueVADOptions } from './types'

export class VueVAD {
    private instance: any = null

    private options: VueVADOptions

    constructor(options: VueVADOptions = {}) {
        this.options = options
    }

    async init(options: VueVADOptions = {}) {
        if (typeof window === 'undefined') {
            return
        }

        this.options = {
            ...this.options,
            ...options,
        }

        if (this.instance) {
            return this.instance
        }

        this.instance = await MicVAD.new({
            model: this.options.model ?? 'v5',

            baseAssetPath:
                this.options.baseAssetPath ??
                'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.30/dist/',

            onnxWASMBasePath:
                this.options.onnxWASMBasePath ??
                'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.22.0/dist/',

            startOnLoad: false,

            positiveSpeechThreshold:
                this.options.positiveSpeechThreshold ?? 0.8,

            negativeSpeechThreshold:
                this.options.negativeSpeechThreshold ?? 0.5,

            redemptionMs: this.options.redemptionMs ?? 800,

            preSpeechPadMs: this.options.preSpeechPadMs ?? 300,

            minSpeechMs: this.options.minSpeechMs ?? 250,

            onSpeechStart: () => {
                this.options.onSpeechStart?.()
            },

            onSpeechRealStart: () => {
                this.options.onSpeechRealStart?.()
            },

            onSpeechEnd: (audio: Float32Array) => {
                this.options.onSpeechEnd?.(audio)
            },

            onVADMisfire: () => {
                this.options.onVADMisfire?.()
            },

            onFrameProcessed: (
                probabilities: {
                    isSpeech: number
                    notSpeech: number
                },
                frame: Float32Array
            ) => {
                this.options.onFrameProcessed?.(probabilities, frame)
            },
        })

        return this.instance
    }

    async start() {
        if (!this.instance) {
            await this.init()
        }

        this.instance?.start()
    }

    pause() {
        this.instance?.pause()
    }

    destroy() {
        this.instance?.destroy()
        this.instance = null
    }

    get raw() {
        return this.instance
    }
}