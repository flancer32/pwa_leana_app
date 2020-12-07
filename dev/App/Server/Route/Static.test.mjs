import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../DevEnv.mjs';


describe('Fl32_Leana_App_Server_Route_Static:', () => {

    it('is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_App_Server_Route_Static} */
        const obj = await container.get('Fl32_Leana_App_Server_Route_Static$');
        assert.strictEqual(obj.constructor.name, 'Fl32_Leana_App_Server_Route_Static');

        describe('handle HTTP requests:', () => {

            it('for /pub/ realm', async () => {
                const req = {};
                const res = {};
                const next = function () {
                };
                req.url = '/pub/node/vue/vue.global.js';
                await obj.handle(req, res, next);
                assert(true);
            });
        });

    });
});
