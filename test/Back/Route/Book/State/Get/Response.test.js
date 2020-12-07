import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../../../TestEnv.mjs';


describe('Fl32_Leana_Back_Route_Book_State_Get_Response:', () => {

    it('object is available in Test environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_Shared_Api_Route_Book_State_Get_Response} */
        const obj = await container.get('Fl32_Leana_Back_Route_Book_State_Get_Response$');
        assert.strictEqual(obj.constructor.name, 'Fl32_Leana_Back_Route_Book_State_Get_Response');
        const item = obj.employees[0];
        const time = item.workTime['asd'];
        time.date;

    });
});
