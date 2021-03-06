import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../DevEnv.mjs';


describe('Second Test Unit', () => {

    it('config is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {TeqFw_Core_App_Config} */
        const config = await container.get('TeqFw_Core_App_Config$');
        assert.strictEqual(config.constructor.name, 'TeqFw_Core_App_Config');
        assert(true);
    });
});
