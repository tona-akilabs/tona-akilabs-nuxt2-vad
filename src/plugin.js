import { VueVAD } from './vad';
export function install(VueConstructor, options = {}) {
    VueConstructor.prototype.$vad = new VueVAD(options);
}
//# sourceMappingURL=plugin.js.map