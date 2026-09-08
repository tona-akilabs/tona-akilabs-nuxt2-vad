export type VADModel = 'v5' | 'legacy'

export interface VueVADOptions {
    model?: VADModel

    baseAssetPath?: string
    onnxWASMBasePath?: string

    positiveSpeechThreshold?: number
    negativeSpeechThreshold?: number
    redemptionMs?: number
    preSpeechPadMs?: number
    minSpeechMs?: number

    onSpeechStart?: () => void
    onSpeechRealStart?: () => void
    onSpeechEnd?: (audio: Float32Array) => void
    onVADMisfire?: () => void

    onFrameProcessed?: (
        probabilities: {
            isSpeech: number
            notSpeech: number
        },
        frame: Float32Array
    ) => void
}