import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../../DevEnv.mjs';


describe('Fl32_Leana_App_Server_Route_Static_PathMap:', () => {

    it('is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_App_Server_Route_Static_PathMap} */
        const obj = await container.get('Fl32_Leana_App_Server_Route_Static_PathMap#');
        assert.strictEqual(obj.name, 'Fl32_Leana_App_Server_Route_Static_PathMap');

        describe('maps URLs to file paths:', () => {

            it('for the root', async () => {
                assert.strictEqual(obj('/src/mod/leana/Some/Module.mjs'), '/src/Some/Module.mjs');
                assert.strictEqual(obj('/node/vue/vue.global.js'), '/node_modules/vue/dist/vue.global.js');
            });

            it('for /pub/ realm', async () => {
                assert.strictEqual(obj('/pub/src/mod/leana/Some/Module.mjs'), '/src/Some/Module.mjs');
                assert.strictEqual(obj('/pub/node/vue/vue.global.js'), '/node_modules/vue/dist/vue.global.js');
            });

            it('for /dashboard/ realm', async () => {
                assert.strictEqual(obj('/dashboard/src/mod/leana/Some/Module.mjs'), '/src/Some/Module.mjs');
                assert.strictEqual(obj('/dashboard/node/vue/vue.global.js'), '/node_modules/vue/dist/vue.global.js');
            });

        });

    });
});
