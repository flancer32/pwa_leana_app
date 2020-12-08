import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../DevEnv.mjs';


describe('Fl32_Leana_Store_RDb_Schema', () => {

    it('is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_Store_RDb_Schema} */
        const obj = await container.get('Fl32_Leana_Store_RDb_Schema$');
        assert.strictEqual(obj.constructor.name, 'Fl32_Leana_Store_RDb_Schema');
    });

    it('has immutable props', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_Store_RDb_Schema} */
        const obj = await container.get('Fl32_Leana_Store_RDb_Schema$');
        for (const prop of Object.keys(obj)) {
            const desc = Object.getOwnPropertyDescriptor(obj, prop);
            assert.strictEqual(desc.writable, false, `property '${prop}' should be read-only.`);
        }
        assert(true);
    });
});
