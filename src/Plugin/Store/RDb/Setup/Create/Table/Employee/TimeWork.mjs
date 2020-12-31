export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForForeignKey} */
    const utilFKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForForeignKey'];

    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    const eEmployee = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
    const eEmplTimeWork = spec.Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$;

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_TimeWork
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_TimeWork(knex, schema) {
        schema.createTable(eEmplTimeWork.ENTITY, (table) => {
            table.integer(eEmplTimeWork.A_EMPLOYEE_REF).unsigned().notNullable();
            table.string(eEmplTimeWork.A_DATE, 8).comment('Date as "YYYYMMDD".');
            table.string(eEmplTimeWork.A_FROM, 4).defaultTo('0900')
                .comment('Time starting: 0900.');
            table.string(eEmplTimeWork.A_TO, 4).defaultTo('2000')
                .comment('Finish time: 2000.');
            table.primary(
                [eEmplTimeWork.A_EMPLOYEE_REF, eEmplTimeWork.A_DATE, eEmplTimeWork.A_FROM]
            );
            table.foreign(eEmplTimeWork.A_EMPLOYEE_REF).references(eEmployee.A_USER_REF).inTable(eEmployee.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(
                    eEmplTimeWork.ENTITY, eEmplTimeWork.A_EMPLOYEE_REF,
                    eEmployee.ENTITY, eEmployee.A_USER_REF
                ));
            table.comment('Working time for employees.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_TimeWork;
}
