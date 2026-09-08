import { install } from './plugin'

export { VueVAD } from './vad'
export { float32ToPCM16 } from './utils'
import type {
    VueVADOptions,
    VADModel,
} from './types'

export type {
    VueVADOptions,
    VADModel,
}

export default {
    install,
}
