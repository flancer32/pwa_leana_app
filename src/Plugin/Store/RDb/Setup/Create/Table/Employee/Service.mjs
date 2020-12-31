export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForForeignKey} */
    const utilFKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForForeignKey'];

    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    const eEmployee = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Service} */
    const eEmplSrv = spec.Fl32_Leana_Store_RDb_Schema_Employee_Service$;
    /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
    const eService = spec.Fl32_Leana_Store_RDb_Schema_Service$;

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_Service
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_Service(knex, schema) {
        schema.createTable(eEmplSrv.ENTITY, (table) => {
            table.integer(eEmplSrv.A_EMPLOYEE_REF).unsigned().notNullable();
            table.integer(eEmplSrv.A_SERVICE_REF).unsigned().notNullable();
            table.primary([eEmplSrv.A_EMPLOYEE_REF, eEmplSrv.A_SERVICE_REF]);
            table.foreign(eEmplSrv.A_EMPLOYEE_REF).references(eEmployee.A_USER_REF).inTable(eEmployee.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eEmplSrv.ENTITY, eEmplSrv.A_EMPLOYEE_REF, eEmployee.ENTITY, eEmployee.A_USER_REF));
            table.foreign(eEmplSrv.A_SERVICE_REF).references(eService.A_ID).inTable(eService.ENTITY)
                .onDelete('CASCADE').onUpdate('CASCADE')
                .withKeyName(utilFKName(eEmplSrv.ENTITY, eEmplSrv.A_USER_REF, eService.ENTITY, eService.A_ID));
            table.comment('Employee provides services.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_Service;
}
