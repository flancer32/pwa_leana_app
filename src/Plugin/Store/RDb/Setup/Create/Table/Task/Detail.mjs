export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForForeignKey} */
    const utilFKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForForeignKey']; // singleton instance
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    const eEmployee = spec['Fl32_Leana_Store_RDb_Schema_Employee$'];    // singleton instance
    /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
    const eService = spec['Fl32_Leana_Store_RDb_Schema_Service$'];  // singleton instance
    /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
    const eTask = spec['Fl32_Leana_Store_RDb_Schema_Task$'];    // singleton instance
    /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
    const eTaskDet = spec['Fl32_Leana_Store_RDb_Schema_Task_Detail$'];  // singleton instance
    /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
    const eUser = spec['Fl32_Teq_User_Store_RDb_Schema_User$'];    // singleton instance

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_Detail
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_Detail(knex, schema) {
        schema.createTable(eTaskDet.ENTITY, (table) => {
            table.integer(eTaskDet.A_TASK_REF).unsigned().notNullable();
            table.integer(eTaskDet.A_USER_REF).unsigned().nullable().comment('If related user exists for the task.');
            table.integer(eTaskDet.A_EMPLOYEE_REF).unsigned().notNullable();
            table.integer(eTaskDet.A_SERVICE_REF).unsigned().notNullable();
            table.string(eTaskDet.A_DATE, 8).comment('Date as "YYYYMMDD".');
            table.string(eTaskDet.A_FROM, 4).notNullable().comment('Time starting: 0900.');
            table.string(eTaskDet.A_TO, 4).notNullable().comment('Finish time: 2000.');
            table.boolean(eTaskDet.A_MADE_ON_FRONT).notNullable()
                .defaultTo(false)
                .comment('true - if task is created by customer from pub app.');
            table.string(eTaskDet.A_CUSTOMER, 255).nullable().comment('Customer name if task is registered with phone.');
            table.string(eTaskDet.A_PHONE, 255).nullable().comment('Customer phone if task is registered with phone.');
            table.string(eTaskDet.A_EMAIL, 255).nullable().comment('Customer email if task is registered with phone.');
            table.string(eTaskDet.A_LOCALE, 255).nullable().comment('Customer language (locale).');
            table.string(eTaskDet.A_NOTE, 255).nullable().comment('Task notes.');
            table.primary([eTaskDet.A_TASK_REF]);
            table.foreign(eTaskDet.A_TASK_REF).references(eTask.A_ID).inTable(eTask.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eTaskDet.ENTITY, eTaskDet.A_TASK_REF, eTask.ENTITY, eTask.A_ID));
            table.foreign(eTaskDet.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eTaskDet.ENTITY, eTaskDet.A_TASK_REF, eUser.ENTITY, eUser.A_ID));
            table.foreign(eTaskDet.A_EMPLOYEE_REF).references(eEmployee.A_USER_REF).inTable(eEmployee.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eTaskDet.ENTITY, eTaskDet.A_EMPLOYEE_REF, eEmployee.ENTITY, eEmployee.A_USER_REF));
            table.foreign(eTaskDet.A_SERVICE_REF).references(eService.A_ID).inTable(eService.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eTaskDet.ENTITY, eTaskDet.A_SERVICE_REF, eService.ENTITY, eService.A_ID));
            table.comment('Task details.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_Detail;
}
