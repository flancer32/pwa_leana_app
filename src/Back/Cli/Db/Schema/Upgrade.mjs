/**
 * CLI action to upgrade RDB schema.
 */
export default class Fl32_Leana_Back_Cli_Db_Schema_Upgrade {
    // these 4 props are used in the base class 'TeqFw_Core_App_Cli_Command'
    action
    description = 'Upgrade RDB schema.'
    name = 'upgrade'
    namespace = 'db-schema'

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {TeqFw_Core_App_Logger} */
        const logger = spec.TeqFw_Core_App_Logger$;
        /** @type {TeqFw_Core_App_Db_Connector} */
        const connector = spec.TeqFw_Core_App_Db_Connector$;
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const util = spec.Fl32_Leana_Shared_Util_DateTime$;
        /** @type {TeqFw_Core_App_Obj_Factory} */
        const objFactory = spec.TeqFw_Core_App_Obj_Factory$;
        /** @type {TeqFw_Core_App_Cli_Command} */
        const base = spec.TeqFw_Core_App_Cli_Command$;
        /** @type {Fl32_Leana_Store_RDb_Employee} */
        const aEmployee = spec.Fl32_Leana_Store_RDb_Employee$;
        /** @type {Fl32_Leana_Store_RDb_Employee_Service} */
        const aEmplSrv = spec.Fl32_Leana_Store_RDb_Employee_Service$;
        /** @type {Fl32_Leana_Store_RDb_Employee_Time_Work} */
        const aEmplTimeWork = spec.Fl32_Leana_Store_RDb_Employee_Time_Work$;
        /** @type {Fl32_Leana_Store_RDb_Service} */
        const aService = spec.Fl32_Leana_Store_RDb_Service$;
        /** @type {Fl32_Leana_Store_RDb_Task} */
        const aTask = spec.Fl32_Leana_Store_RDb_Task$;
        /** @type {Fl32_Leana_Store_RDb_Task_Detail} */
        const aTaskDet = spec.Fl32_Leana_Store_RDb_Task_Detail$;

        // POPULATE CURRENT INSTANCE WITH BASE CLASSES METHODS (COMPOSITION INSTEAD OF INHERITANCE)
        objFactory.assignPrototypeMethods(this, base);

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)
        this.action = async function () {
            // PARSE INPUT & DEFINE WORKING VARS
            // DEFINE INNER FUNCTIONS
            // async function getTables(trx) {
            //     const result = [];
            //     const dialect = trx.client.config.client;
            //     if (['mysql', 'mysql2'].includes(dialect)) {
            //         const rs = await trx.raw('show tables');
            //         if (Array.isArray(rs)) {
            //             const column = rs[1][0]['name'];
            //             rs[0].map(one => result.push(one[column]));
            //         }
            //     } else {
            //         throw new Error(`This dialect (${dialect}) is not supported.`);
            //     }
            //     return result;
            // }

            async function dropTables(schema) {
                /* drop related tables (foreign keys) */
                // deprecated tables
                schema.dropTableIfExists('book_details');
                // actual tables
                schema.dropTableIfExists(aEmplSrv.TABLE);
                schema.dropTableIfExists(aEmplTimeWork.TABLE);
                schema.dropTableIfExists(aTaskDet.TABLE);

                /* drop registries */
                // deprecated tables
                schema.dropTableIfExists('book');
                // actual tables
                schema.dropTableIfExists(aEmployee.TABLE);
                schema.dropTableIfExists(aService.TABLE);
                schema.dropTableIfExists(aTask.TABLE);
            }

            async function composeRegistries(schema, knex) {
                // EMPLOYEE
                schema.createTable(aEmployee.TABLE, (table) => {
                    table.increments(aEmployee.A_ID);
                    table.string(aEmployee.A_CODE).notNullable().comment('Short unique name for employee.');
                    table.unique([aEmployee.A_CODE], 'UQ_employee__code');
                    table.comment('Register for employees.');
                });
                // SERVICE
                schema.createTable(aService.TABLE, (table) => {
                    table.increments(aService.A_ID);
                    table.string(aService.A_CODE).notNullable()
                        .comment('Short unique name for service.');
                    table.integer(aService.A_DURATION).unsigned().notNullable().defaultTo(0)
                        .comment('Service duration in minutes.');
                    table.boolean(aService.A_PUBLIC).notNullable().defaultTo(false)
                        .comment('Does this service available on front or only through admin UI.');
                    table.unique([aService.A_CODE], 'UQ_employee__code');
                    table.comment('Register for services.');
                });
                // TASK
                schema.createTable(aTask.TABLE, (table) => {
                    table.increments(aTask.A_ID);
                    table.dateTime(aTask.A_CREATED).notNullable().defaultTo(knex.fn.now());
                    table.comment('Register for tasks (appointments, bookings).');
                });
            }

            async function composeEmployee(schema) {
                // EMPLOYEE_SERVICE
                schema.createTable(aEmplSrv.TABLE, (table) => {
                    table.integer(aEmplSrv.A_EMPLOYEE_REF).unsigned().notNullable();
                    table.integer(aEmplSrv.A_SERVICE_REF).unsigned().notNullable();
                    table.primary([aEmplSrv.A_EMPLOYEE_REF, aEmplSrv.A_SERVICE_REF]);
                    table.foreign(aEmplSrv.A_EMPLOYEE_REF).references(aEmployee.A_ID).inTable(aEmployee.TABLE)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_employee_service__employee');
                    table.foreign(aEmplSrv.A_SERVICE_REF).references(aService.A_ID).inTable(aService.TABLE)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_employee_service__service');
                    table.comment('Employee provides services.');
                });
                // EMPLOYEE_TIME_WORK
                schema.createTable(aEmplTimeWork.TABLE, (table) => {
                    table.integer(aEmplTimeWork.A_EMPLOYEE_REF).unsigned().notNullable();
                    table.string(aEmplTimeWork.A_DATE, 8).comment('Date as "YYYYMMDD".');
                    table.string(aEmplTimeWork.A_FROM, 4).defaultTo('0900')
                        .comment('Time starting: 0900.');
                    table.string(aEmplTimeWork.A_TO, 4).defaultTo('2000')
                        .comment('Finish time: 2000.');
                    table.primary(
                        [aEmplTimeWork.A_EMPLOYEE_REF, aEmplTimeWork.A_DATE, aEmplTimeWork.A_FROM]
                    );
                    table.foreign(aEmplTimeWork.A_EMPLOYEE_REF).references(aEmployee.A_ID).inTable(aEmployee.TABLE)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_employee_time_work__employee');
                    table.comment('Working time for employees.');
                });
            }

            async function composeTaskDetails(schema) {
                schema.createTable(aTaskDet.TABLE, (table) => {
                    table.integer(aTaskDet.A_TASK_REF).unsigned().notNullable();
                    table.integer(aTaskDet.A_EMPLOYEE_REF).unsigned().notNullable();
                    table.integer(aTaskDet.A_SERVICE_REF).unsigned().notNullable();
                    table.string(aTaskDet.A_DATE, 8).comment('Date as "YYYYMMDD".');
                    table.string(aTaskDet.A_FROM, 4).notNullable().comment('Time starting: 0900.');
                    table.string(aTaskDet.A_TO, 4).notNullable().comment('Finish time: 2000.');
                    table.string(aTaskDet.A_CUSTOMER, 255).notNullable().comment('Customer name.');
                    table.string(aTaskDet.A_PHONE, 255).nullable().comment('Customer phone.');
                    table.string(aTaskDet.A_EMAIL, 255).nullable().comment('Customer email.');
                    table.string(aTaskDet.A_LANG, 255).nullable().comment('Customer language (locale).');
                    table.string(aTaskDet.A_NOTE, 255).nullable().comment('Task notes.');
                    table.primary([aTaskDet.A_TASK_REF]);
                    table.foreign(aTaskDet.A_TASK_REF).references(aTask.A_ID).inTable(aTask.TABLE)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_book_detail__book');
                    table.foreign(aTaskDet.A_EMPLOYEE_REF).references(aEmployee.A_ID).inTable(aEmployee.TABLE)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_book_detail__employee');
                    table.foreign(aTaskDet.A_SERVICE_REF).references(aService.A_ID).inTable(aService.TABLE)
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_book_detail__service');
                    table.comment('Task details.');
                });
            }

            async function initEmployee(trx) {
                await trx(aEmployee.TABLE).insert([
                    {[aEmployee.A_ID]: 1, [aEmployee.A_CODE]: 'elena'},
                    {[aEmployee.A_ID]: 2, [aEmployee.A_CODE]: 'natalie'}
                ]);
                await trx(aService.TABLE).insert([{
                    [aService.A_ID]: 1, [aService.A_CODE]: 'haircut_man',
                    [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30
                }, {
                    [aService.A_ID]: 2, [aService.A_CODE]: 'haircut_women',
                    [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30
                }, {
                    [aService.A_ID]: 3, [aService.A_CODE]: 'haircut_child',
                    [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30
                }, {
                    [aService.A_ID]: 4, [aService.A_CODE]: 'color_simple',
                    [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30
                }, {
                    [aService.A_ID]: 5, [aService.A_CODE]: 'color_complex',
                    [aService.A_DURATION]: 60
                }, {
                    [aService.A_ID]: 6, [aService.A_CODE]: 'color_highlight',
                    [aService.A_DURATION]: 120
                }, {
                    [aService.A_ID]: 7, [aService.A_CODE]: 'perm',
                    [aService.A_DURATION]: 60
                },]);
                await trx(aEmplSrv.TABLE).insert([
                    {[aEmplSrv.A_EMPLOYEE_REF]: 1, [aEmplSrv.A_SERVICE_REF]: 1},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 1, [aEmplSrv.A_SERVICE_REF]: 2},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 1, [aEmplSrv.A_SERVICE_REF]: 3},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 1, [aEmplSrv.A_SERVICE_REF]: 4},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 1, [aEmplSrv.A_SERVICE_REF]: 5},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 1, [aEmplSrv.A_SERVICE_REF]: 7},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 2, [aEmplSrv.A_SERVICE_REF]: 1},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 2, [aEmplSrv.A_SERVICE_REF]: 2},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 2, [aEmplSrv.A_SERVICE_REF]: 3},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 2, [aEmplSrv.A_SERVICE_REF]: 4},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 2, [aEmplSrv.A_SERVICE_REF]: 5},
                    {[aEmplSrv.A_EMPLOYEE_REF]: 2, [aEmplSrv.A_SERVICE_REF]: 6},
                ]);
                // employee_time_work
                const timeWorkItems = [];
                for (let i = 1; i < 20; i++) {
                    const ref = i % 2 + 1;
                    const dt = util.forwardDate(i);
                    const date = util.formatDate(dt);
                    timeWorkItems.push({employee_ref: ref, date});

                }
                await trx(aEmplTimeWork.TABLE).insert(timeWorkItems);
            }

            async function initBook(trx) {
                await trx(aTask.TABLE).insert([
                    {[aTask.A_ID]: 1},
                    {[aTask.A_ID]: 2},
                    {[aTask.A_ID]: 3},
                    {[aTask.A_ID]: 4},
                    {[aTask.A_ID]: 5},
                    {[aTask.A_ID]: 6},
                    {[aTask.A_ID]: 7},
                    {[aTask.A_ID]: 8},
                    {[aTask.A_ID]: 9},
                    {[aTask.A_ID]: 10},
                ]);
                const d0 = util.forwardDate(0);
                const d1 = util.forwardDate(1);
                const d2 = util.forwardDate(2);
                const d3 = util.forwardDate(3);
                const date0 = util.formatDate(d0);
                const date1 = util.formatDate(d1);
                const date2 = util.formatDate(d2);
                const date3 = util.formatDate(d3);
                await trx(aTaskDet.TABLE).insert([
                    {
                        [aTaskDet.A_TASK_REF]: 1, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 1,
                        [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '0900', [aTaskDet.A_TO]: '1115',
                        [aTaskDet.A_CUSTOMER]: 'John Doe', [aTaskDet.A_EMAIL]: 'john@inter.net',
                        [aTaskDet.A_PHONE]: '2912312312', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 2, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 2,
                        [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '0930', [aTaskDet.A_TO]: '1045',
                        [aTaskDet.A_CUSTOMER]: 'John Doe', [aTaskDet.A_EMAIL]: 'john@inter.net',
                        [aTaskDet.A_PHONE]: '2912312312', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 3, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 3,
                        [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '1030', [aTaskDet.A_TO]: '1130',
                        [aTaskDet.A_CUSTOMER]: 'John Doe', [aTaskDet.A_EMAIL]: 'john@inter.net',
                        [aTaskDet.A_PHONE]: '2912312312', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 4, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 4,
                        [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '1215', [aTaskDet.A_TO]: '1330',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 5, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 5,
                        [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '1630', [aTaskDet.A_TO]: '1730',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 6, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 5,
                        [aTaskDet.A_DATE]: date2, [aTaskDet.A_FROM]: '0915', [aTaskDet.A_TO]: '1130',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 7, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 5,
                        [aTaskDet.A_DATE]: date2, [aTaskDet.A_FROM]: '1230', [aTaskDet.A_TO]: '1730',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 8, [aTaskDet.A_EMPLOYEE_REF]: 2, [aTaskDet.A_SERVICE_REF]: 5,
                        [aTaskDet.A_DATE]: date1, [aTaskDet.A_FROM]: '0900', [aTaskDet.A_TO]: '1030',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 9, [aTaskDet.A_EMPLOYEE_REF]: 2, [aTaskDet.A_SERVICE_REF]: 5,
                        [aTaskDet.A_DATE]: date1, [aTaskDet.A_FROM]: '1030', [aTaskDet.A_TO]: '1130',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    }, {
                        [aTaskDet.A_TASK_REF]: 10, [aTaskDet.A_EMPLOYEE_REF]: 2, [aTaskDet.A_SERVICE_REF]: 5,
                        [aTaskDet.A_DATE]: date3, [aTaskDet.A_FROM]: '1030', [aTaskDet.A_TO]: '1730',
                        [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                        [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LANG]: 'en_US',
                        [aTaskDet.A_NOTE]: 'some notes related to the task.',
                    },
                ]);
            }

            // MAIN FUNCTIONALITY
            const knex = connector.getKnex();
            const trx = await connector.startTransaction();
            try {
                /** @type {SchemaBuilder} */
                const schema = connector.getSchema();
                // compose queries to create DB structure
                await dropTables(schema);
                await composeRegistries(schema, knex);
                await composeEmployee(schema);
                await composeTaskDetails(schema);
                // perform queries to create DB structure
                await schema;
                // insert data
                await initEmployee(trx);
                await initBook(trx);


                // _logger.info(`${tables.toString()}`);
                trx.commit();
            } catch (e) {
                trx.rollback();
                logger.error(`${e.toString()}`);
            }
            await connector.disconnect();
        };
    }
}
