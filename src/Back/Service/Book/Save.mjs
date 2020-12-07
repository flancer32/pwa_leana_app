export default class Fl32_Leana_Back_Service_Book_Save {
    /** @type {Fl32_Leana_Extern_Google_Api} */
    #googleApi
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    #utilDate

    /**  @param {Object} spec */
    constructor(spec) {
        this.#googleApi = spec.Fl32_Leana_Extern_Google_Api$;
        this.#utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    }

    /**
     * Save booking details from front into RDB.
     *
     * @param {Function} trx
     * @param {Fl32_Leana_Shared_Api_Route_Book_Save_Request} req
     * @returns {Promise<{}>}
     */
    async exec({trx, req}) {
        // PARSE INPUT & DEFINE WORKING VARS
        const result = {};
        const me = this;
        const apiDate = new Date(req.date);

        // DEFINE INNER FUNCTIONS

        async function addToDb() {
            const date = me.#utilDate.formatDate(apiDate);
            const hh = `${apiDate.getHours()}`.padStart(2, 0);
            const mm = `${apiDate.getMinutes()}`.padStart(2, 0);
            const from = `${hh}${mm}`;
            const fromMin = me.#utilDate.convertDbHrsMinsToMins(from);
            const toMin = fromMin + Number.parseInt(req.duration);
            const to = me.#utilDate.convertMinsToDbHrsMins(toMin);
            const customer = req.name ?? undefined;
            const email = req.email ?? undefined;
            const phone = req.phone ?? undefined;
            const note = req.note ?? undefined;
            const lang = req.lang ?? undefined;
            // register ID for entity
            const rs = await trx('book').insert({});
            const bookId = rs[0];
            // add details for new entity
            await trx('book_detail').insert({
                book_ref: bookId,
                employee_ref: req.masterId,
                service_ref: req.serviceId,
                date, from, to, customer, email, phone, note, lang,
            });
            return bookId;
        }

        async function saveToDb() {
            const date = me.#utilDate.formatDate(apiDate);
            const hh = `${apiDate.getHours()}`.padStart(2, 0);
            const mm = `${apiDate.getMinutes()}`.padStart(2, 0);
            const from = `${hh}${mm}`;
            const fromMin = me.#utilDate.convertDbHrsMinsToMins(from);
            const toMin = fromMin + Number.parseInt(req.duration);
            const to = me.#utilDate.convertMinsToDbHrsMins(toMin);
            const customer = req.name ?? undefined;
            const email = req.email ?? undefined;
            const phone = req.phone ?? undefined;
            const note = req.note ?? undefined;
            const lang = req.lang ?? undefined;
            // update details for existing entity
            await trx('book_detail')
                .update({
                    employee_ref: req.masterId,
                    service_ref: req.serviceId,
                    date, from, to, customer, email, phone, note, lang,
                })
                .where({book_ref: req.id,});
            return req.id;
        }

        async function getEmployeeName(employeeId) {
            const query = trx.select();
            query.from('employee');
            query.where('id', employeeId);
            const rs = await query;
            const data = rs[0];
            return data.code;
        }

        async function getServiceName(serviceId) {
            const query = trx.select();
            query.from('service');
            query.where('id', serviceId);
            const rs = await query;
            const data = rs[0];
            return data.code;
        }

        async function saveToGoogle(bookId, master, service) {
            const summary = `${req.name} (${master})`;
            const description = `
Name: ${req.name}
Email: ${req.email}
Phone: ${req.phone}
Lang: ${req.lang}
Master: ${master}
Service: ${service}
`;
            const end = new Date(apiDate.getTime() + (req.duration * 60 * 1000));
            const opts = {summary, description, start: apiDate, end};
            await me.#googleApi.addEvent(opts);
        }

        // MAIN FUNCTIONALITY
        if (typeof req.id === 'number') {
            await saveToDb();
        } else {
            const bookId = await addToDb();
        }

        const master = await getEmployeeName(req.masterId);
        const service = await getServiceName(req.serviceId);
        // await saveToGoogle(bookId, master, service);

        // COMPOSE RESULT
        return result;
    }
}
