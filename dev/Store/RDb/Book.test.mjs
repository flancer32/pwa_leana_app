import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../DevEnv.mjs';


describe('Fl32_Leana_Store_RDb_Book', () => {

    it('is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_Store_RDb_Book} */
        const obj = await container.get('Fl32_Leana_Store_RDb_Book$');
        assert.strictEqual(obj.constructor.name, 'Fl32_Leana_Store_RDb_Book');
    });

});
