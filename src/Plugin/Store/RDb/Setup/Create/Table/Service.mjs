export default function (spec) {
    /** @type {TeqFw_Core_App_Util_Store_RDb_NameForUniqueKey} */
    const utilUKName = spec['TeqFw_Core_App_Util_Store_RDb#NameForUniqueKey'];
    /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
    const eService = spec.Fl32_Leana_Store_RDb_Schema_Service$;

    /**
     * @param knex
     * @param schema
     * @exports Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Service
     */
    function Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Service(knex, schema) {
        schema.createTable(eService.ENTITY, (table) => {
            table.increments(eService.A_ID);
            table.string(eService.A_CODE).notNullable()
                .comment('Short unique name for service (should we use code with names?).');
            table.integer(eService.A_DURATION).unsigned().notNullable().defaultTo(0)
                .comment('Service duration in minutes.');
            table.boolean(eService.A_PUBLIC).notNullable().defaultTo(false)
                .comment('Does this service available on front or only through admin UI.');
            table.string(eService.A_NAME_LV).notNullable()
                .comment('Service name in latvian.');
            table.string(eService.A_NAME_RU).notNullable()
                .comment('Service name in russian.');
            table.unique([eService.A_CODE], utilUKName(eService.ENTITY, eService.A_CODE));
            table.comment('Register for services.');
        });
    }

    return Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Service;
}
