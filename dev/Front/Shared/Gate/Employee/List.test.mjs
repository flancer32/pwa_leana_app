import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../../DevEnv.mjs';


describe('Fl32_Leana_Front_Shared_Gate_Employee_List', () => {

    it('is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        container.set('config', {web: {urlBase: 'leana.home.teqfw.com'}});
        /** @type {Fl32_Leana_Front_Shared_Gate_Employee_List} */
        const obj = await container.get('Fl32_Leana_Front_Shared_Gate_Employee_List$');
        assert.strictEqual(obj.name, 'Fl32_Leana_Front_Shared_Gate_Employee_List');
    });

});
