import type Vue from 'vue'
import { VueVAD } from './vad'
import type { VueVADOptions } from './types'

export function install(
    VueConstructor: typeof Vue,
    options: VueVADOptions = {}
) {
    VueConstructor.prototype.$vad = new VueVAD(options)
}