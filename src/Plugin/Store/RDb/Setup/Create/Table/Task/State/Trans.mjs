export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForForeignKey} */
    const utilFKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForForeignKey']; // singleton function
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForIndexKey} */
    const utilIKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForIndexKey']; // singleton function
    /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
    const eTask = spec['Fl32_Leana_Store_RDb_Schema_Task$'];    // singleton instance
    /** @type {Fl32_Leana_Store_RDb_Schema_Task_State_Trans} */
    const eTrans = spec['Fl32_Leana_Store_RDb_Schema_Task_State_Trans$'];  // singleton instance

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_State_Trans
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_State_Trans(knex, schema) {
        schema.createTable(eTrans.ENTITY, (table) => {
            table.integer(eTrans.A_TASK_REF).unsigned().notNullable();
            table.dateTime(eTrans.A_DATE).notNullable().defaultTo(knex.fn.now())
                .comment('Date-time for the transition.');
            table.string(eTrans.A_STATE_OLD).notNullable().comment('Old state of the task.');
            table.string(eTrans.A_STATE_NEW).notNullable().comment('New state of the task.');
            table.index(
                [eTrans.A_TASK_REF, eTrans.A_DATE],
                utilIKName(eTrans.ENTITY, [eTrans.A_TASK_REF, eTrans.A_DATE]));
            table.foreign(eTrans.A_TASK_REF).references(eTask.A_ID).inTable(eTask.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eTrans.ENTITY, eTrans.A_TASK_REF, eTask.ENTITY, eTask.A_ID));
            table.comment('Task state transistions.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_State_Trans;
}
