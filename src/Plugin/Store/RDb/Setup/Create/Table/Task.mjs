export default function (spec) {
    /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
    const eTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task(knex, schema) {
        schema.createTable(eTask.ENTITY, (table) => {
            table.increments(eTask.A_ID);
            table.dateTime(eTask.A_CREATED).notNullable().defaultTo(knex.fn.now());
            table.comment('Register for tasks (appointments, bookings).');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task;
}
