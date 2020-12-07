/**
 * Configurator to map web paths to filesystem.
 *
 * TODO: this map should be composed dynamically on teq-modules loading.
 */

const PATH_MAP = {
    appSource: {from: '/src/leana/', to: '/src/'},
    appStatic: {from: '/static/mod/leana/', to: '/src/web/'},
    i18next: {from: '/node/i18next/', to: '/node_modules/i18next/dist/umd/'},
    i18nextBld: {from: '/node/i18next-bld/', to: '/node_modules/i18next-browser-languagedetector/dist/umd/'},
    jsDatepicker: {from: '/node/js-datepicker/', to: '/node_modules/js-datepicker/dist/'},
    teqfwDi: {from: '/src/@teqfw/di/', to: '/node_modules/@teqfw/di/src/'},
    vue: {from: '/node/vue/', to: '/node_modules/vue/dist/'},
    vueRouter: {from: '/node/vue-router/', to: '/node_modules/vue-router/dist/'},
    vuex: {from: '/node/vuex/', to: '/node_modules/vuex/dist/'},
};

export default function Fl32_Leana_App_Server_Route_Static_PathMap(url) {
    let result = url;

    for (const key in PATH_MAP) {
        const one = PATH_MAP[key];
        const regex = new RegExp(`(.*)(${one.from})(.*)`);
        const parts = regex.exec(url);
        if (Array.isArray(parts)) {
            const tail = parts[3];
            result = `${one.to}/${tail}`;
            result = result.replace(/\/\//g, '/');
            break;
        }
    }
    return result;
}
