export default class Fl32_Leana_Back_Process_Book_Save {
    /** @type {Fl32_Leana_Extern_Google_Api} */
    #googleApi
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    #utilDate
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    eEmpl
    /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
    eSrv
    /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
    eTask
    /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
    eTaskDet

    /**  @param {Object} spec */
    constructor(spec) {
        this.#googleApi = spec.Fl32_Leana_Extern_Google_Api$;
        this.#utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
        this.eEmpl = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
        this.eSrv = spec.Fl32_Leana_Store_RDb_Schema_Service$;
        this.eTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;
        this.eTaskDet = spec.Fl32_Leana_Store_RDb_Schema_Task_Detail$;
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
            const rs = await trx(me.eTask.ENTITY).insert({});
            const taskId = rs[0];
            // add details for new entity
            await trx(me.eTaskDet.ENTITY).insert({
                [me.eTaskDet.A_TASK_REF]: taskId,
                [me.eTaskDet.A_EMPLOYEE_REF]: req.masterId,
                [me.eTaskDet.A_SERVICE_REF]: req.serviceId,
                [me.eTaskDet.A_DATE]: date,
                [me.eTaskDet.A_FROM]: from,
                [me.eTaskDet.A_TO]: to,
                [me.eTaskDet.A_CUSTOMER]: customer,
                [me.eTaskDet.A_EMAIL]: email,
                [me.eTaskDet.A_PHONE]: phone,
                [me.eTaskDet.A_NOTE]: note,
                [me.eTaskDet.A_LANG]: lang,
            });
            return taskId;
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
            await trx(me.eTaskDet.ENTITY)
                .update({
                    [me.eTaskDet.A_EMPLOYEE_REF]: req.masterId,
                    [me.eTaskDet.A_SERVICE_REF]: req.serviceId,
                    [me.eTaskDet.A_DATE]: date,
                    [me.eTaskDet.A_FROM]: from,
                    [me.eTaskDet.A_TO]: to,
                    [me.eTaskDet.A_CUSTOMER]: customer,
                    [me.eTaskDet.A_EMAIL]: email,
                    [me.eTaskDet.A_PHONE]: phone,
                    [me.eTaskDet.A_NOTE]: note,
                    [me.eTaskDet.A_LANG]: lang,
                })
                .where({[me.eTaskDet.A_TASK_REF]: req.id,});
            return req.id;
        }

        async function getEmployeeName(employeeId) {
            const query = trx.select();
            query.from(me.eEmpl.ENTITY);
            query.where(me.eEmpl.A_ID, employeeId);
            const rs = await query;
            const data = rs[0];
            return data[me.eEmpl.A_CODE];
        }

        async function getServiceName(serviceId) {
            const query = trx.select();
            query.from(me.eSrv.ENTITY);
            query.where(me.eSrv.A_ID, serviceId);
            const rs = await query;
            const data = rs[0];
            return data[me.eSrv.A_CODE];
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
