import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../../DevEnv.mjs';

/**
 * This is environment for code development, not for testing.
 */
describe('Fl32_Leana_Back_Process_WorkTime_Generate', () => {

    it('performs the duties', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_Back_Process_WorkTime_Generate} */
        const proc = await container.get('Fl32_Leana_Back_Process_WorkTime_Generate$');
        assert.strictEqual(proc.constructor.name, 'Fl32_Leana_Back_Process_WorkTime_Generate');

        // get database connector then execute the process
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = await container.get('TeqFw_Core_App_Db_Connector$');  // singleton instance
        const trx = await rdb.startTransaction();
        const res = await proc.exec({trx});
        assert(res);

        // finalize data handling
        await trx.commit();
        await rdb.disconnect();

    });
});
