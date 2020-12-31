export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForForeignKey} */
    const utilFKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForForeignKey'];
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForUniqueKey} */
    const utilUKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForUniqueKey'];
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    const eEmployee = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
    /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
    const eUser = spec.Fl32_Teq_User_Store_RDb_Schema_User$;

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee(knex, schema) {
        schema.createTable(eEmployee.ENTITY, (table) => {
            table.integer(eEmployee.A_USER_REF).unsigned().notNullable();
            table.string(eEmployee.A_CODE).notNullable().comment('Short unique name for employee.');
            table.string(eEmployee.A_NAME_LV).notNullable().comment('Employee name in latvian.');
            table.string(eEmployee.A_NAME_RU).notNullable().comment('Employee name in russian.');
            table.primary(eEmployee.A_USER_REF);
            table.unique([eEmployee.A_CODE], utilUKName(eEmployee.ENTITY, eEmployee.A_CODE));
            table.foreign(eEmployee.A_USER_REF).references(eUser.A_ID).inTable(eUser.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eEmployee.ENTITY, eEmployee.A_USER_REF, eUser.ENTITY, eUser.A_ID));
            table.comment('Register for employees.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee;
}
