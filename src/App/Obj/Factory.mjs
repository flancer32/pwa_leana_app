export default class Fl32_Leana_App_Obj_Factory {

    /**
     * Copy methods from source.__proto__ to target __proto_ (excluding constructor).
     *
     * @param {Object} target
     * @param {Object} source
     */
    assignPrototypeMethods(target, source) {
        const proto = source.__proto__;
        const methods = Object.getOwnPropertyNames(proto)
            .filter(
                p => (typeof proto[p] === 'function' && p !== 'constructor')
            );
        const methodsToAssign = {};
        for (const one of methods) {
            methodsToAssign[one] = proto[one];
        }
        Object.assign(target.__proto__, methodsToAssign);
    }
}
