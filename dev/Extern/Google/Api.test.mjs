import assert from 'assert';
import {describe, it} from 'mocha';
import devEnv from '../../DevEnv.mjs';


describe('Fl32_Leana_Extern_Google_Api', () => {

    it('is available in Dev environment', async () => {
        /** @type {TeqFw_Di_Container} */
        const container = await devEnv();
        /** @type {Fl32_Leana_Extern_Google_Api} */
        const obj = await container.get('Fl32_Leana_Extern_Google_Api$');
        assert.strictEqual(obj.constructor.name, 'Fl32_Leana_Extern_Google_Api');

        describe('API performs', () => {

            it('event addition', async () => {
                const start = new Date();
                const end = new Date(start.getTime() + 3600 * 1000);
                const spec = {
                    summary: 'Test Event',
                    description: 'This event is added from test script.',
                    start,
                    end
                };
                await obj.addEvent(spec);
                assert(true);
            });
        });

    });
});
