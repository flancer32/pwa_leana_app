export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForUniqueKey} */
    const utilUKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForUniqueKey'];
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    const eEmployee = spec.Fl32_Leana_Store_RDb_Schema_Employee$;

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee(knex, schema) {
        schema.createTable(eEmployee.ENTITY, (table) => {
            table.increments(eEmployee.A_ID);
            table.string(eEmployee.A_CODE).notNullable().comment('Short unique name for employee.');
            table.string(eEmployee.A_NAME_LV).notNullable().comment('Employee name in latvian.');
            table.string(eEmployee.A_NAME_RU).notNullable().comment('Employee name in russian.');
            table.unique([eEmployee.A_CODE], utilUKName(eEmployee.ENTITY, eEmployee.A_CODE));
            table.comment('Register for employees.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee;
}
