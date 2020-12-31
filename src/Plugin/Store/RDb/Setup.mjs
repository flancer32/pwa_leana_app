export default class Fl32_Leana_Plugin_Store_RDb_Setup {
    constructor(spec) {
        /** @type {Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee} */
        const createTblEmployee = spec.Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee$;
        /** @type {Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_Service} */
        const createTblEmplSrv = spec.Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_Service$;
        /** @type {Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_TimeWork} */
        const createTblEmplTimeWork = spec.Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Employee_TimeWork$;
        /** @type {Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Service} */
        const createTblService = spec.Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Service$;
        /** @type {Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task} */
        const createTblTask = spec.Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task$;
        /** @type {Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_Detail} */
        const createTblTaskDet = spec.Fl32_Leana_Plugin_Store_RDb_Setup_Create_Table_Task_Detail$;

        /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
        const eEmployee = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Service} */
        const eEmplSrv = spec.Fl32_Leana_Store_RDb_Schema_Employee_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const eEmplTimeWork = spec.Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const eService = spec.Fl32_Leana_Store_RDb_Schema_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const eTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const eTaskDet = spec.Fl32_Leana_Store_RDb_Schema_Task_Detail$;


        /**
         * TODO: tables drop should be ordered according to relations between tables (DEM).
         * For the moment I use levels for drop: N, ..., 2, 1, 0.
         *
         * @param schema
         */
        this.dropTables0 = function (schema) {
            // drop base registries
            schema.dropTableIfExists(eEmployee.ENTITY);
            schema.dropTableIfExists(eService.ENTITY);
            schema.dropTableIfExists(eTask.ENTITY);
        };

        this.dropTables1 = function (schema) {
            // drop related tables (with foreign keys)
            schema.dropTableIfExists(eEmplSrv.ENTITY);
            schema.dropTableIfExists(eEmplTimeWork.ENTITY);
            schema.dropTableIfExists(eTaskDet.ENTITY);
        };

        this.initData = async function (knex, trx) {

        };

        /**
         * Upgrade database structure (drop/create tables).
         *
         * @param knex
         * @param {SchemaBuilder} schema
         */
        this.createStructure = function (knex, schema) {
            // registries
            createTblEmployee(knex, schema);
            createTblService(knex, schema);
            createTblTask(knex, schema);
            // related tables
            createTblEmplSrv(knex, schema);
            createTblEmplTimeWork(knex, schema);
            createTblTaskDet(knex, schema);
        };
    }
}
