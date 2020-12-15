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
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee} */
        const aEmployee = spec.Fl32_Leana_Store_RDb_Schema_Employee$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Service} */
        const aEmplSrv = spec.Fl32_Leana_Store_RDb_Schema_Employee_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Employee_Time_Work} */
        const aEmplTimeWork = spec.Fl32_Leana_Store_RDb_Schema_Employee_Time_Work$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Service} */
        const aService = spec.Fl32_Leana_Store_RDb_Schema_Service$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task} */
        const aTask = spec.Fl32_Leana_Store_RDb_Schema_Task$;
        /** @type {Fl32_Leana_Store_RDb_Schema_Task_Detail} */
        const aTaskDet = spec.Fl32_Leana_Store_RDb_Schema_Task_Detail$;

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

            // DEFINE INNER FUNCTIONS
            /**
             * Compose queries to drop and create tables.
             *
             * @param {SchemaBuilder} schema
             * @param knex
             */
            function recreateStructure(schema, knex) {
                // DEFINE INNER FUNCTIONS
                function dropTables(schema) {
                    /* drop related tables (foreign keys) */
                    // deprecated tables
                    schema.dropTableIfExists('book_detail');
                    // actual tables
                    schema.dropTableIfExists(aEmplSrv.ENTITY);
                    schema.dropTableIfExists(aEmplTimeWork.ENTITY);
                    schema.dropTableIfExists(aTaskDet.ENTITY);

                    /* drop registries */
                    // deprecated tables
                    schema.dropTableIfExists('book');
                    // actual tables
                    schema.dropTableIfExists(aEmployee.ENTITY);
                    schema.dropTableIfExists(aService.ENTITY);
                    schema.dropTableIfExists(aTask.ENTITY);
                }

                function createTblEmployee(schema) {
                    schema.createTable(aEmployee.ENTITY, (table) => {
                        table.increments(aEmployee.A_ID);
                        table.string(aEmployee.A_CODE).notNullable().comment('Short unique name for employee.');
                        table.string(aEmployee.A_NAME_LV).notNullable().comment('Employee name in latvian.');
                        table.string(aEmployee.A_NAME_RU).notNullable().comment('Employee name in russian.');
                        table.unique([aEmployee.A_CODE], 'UQ_employee__code');
                        table.comment('Register for employees.');
                    });
                }

                function createTblEmployeeService(schema) {
                    schema.createTable(aEmplSrv.ENTITY, (table) => {
                        table.integer(aEmplSrv.A_EMPLOYEE_REF).unsigned().notNullable();
                        table.integer(aEmplSrv.A_SERVICE_REF).unsigned().notNullable();
                        table.primary([aEmplSrv.A_EMPLOYEE_REF, aEmplSrv.A_SERVICE_REF]);
                        table.foreign(aEmplSrv.A_EMPLOYEE_REF).references(aEmployee.A_ID).inTable(aEmployee.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_employee_service__employee');
                        table.foreign(aEmplSrv.A_SERVICE_REF).references(aService.A_ID).inTable(aService.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_employee_service__service');
                        table.comment('Employee provides services.');
                    });
                }

                function createTblService(schema) {
                    schema.createTable(aService.ENTITY, (table) => {
                        table.increments(aService.A_ID);
                        table.string(aService.A_CODE).notNullable()
                            .comment('Short unique name for service (should we use code with names?).');
                        table.integer(aService.A_DURATION).unsigned().notNullable().defaultTo(0)
                            .comment('Service duration in minutes.');
                        table.boolean(aService.A_PUBLIC).notNullable().defaultTo(false)
                            .comment('Does this service available on front or only through admin UI.');
                        table.string(aService.A_NAME_LV).notNullable()
                            .comment('Service name in latvian.');
                        table.string(aService.A_NAME_RU).notNullable()
                            .comment('Service name in russian.');
                        table.unique([aService.A_CODE], 'UQ_employee__code');
                        table.comment('Register for services.');
                    });
                }

                function createTblEmployeeTimeWork(schema) {
                    schema.createTable(aEmplTimeWork.ENTITY, (table) => {
                        table.integer(aEmplTimeWork.A_EMPLOYEE_REF).unsigned().notNullable();
                        table.string(aEmplTimeWork.A_DATE, 8).comment('Date as "YYYYMMDD".');
                        table.string(aEmplTimeWork.A_FROM, 4).defaultTo('0900')
                            .comment('Time starting: 0900.');
                        table.string(aEmplTimeWork.A_TO, 4).defaultTo('2000')
                            .comment('Finish time: 2000.');
                        table.primary(
                            [aEmplTimeWork.A_EMPLOYEE_REF, aEmplTimeWork.A_DATE, aEmplTimeWork.A_FROM]
                        );
                        table.foreign(aEmplTimeWork.A_EMPLOYEE_REF).references(aEmployee.A_ID).inTable(aEmployee.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_employee_time_work__employee');
                        table.comment('Working time for employees.');
                    });
                }

                function createTblTask(schema, knex) {
                    schema.createTable(aTask.ENTITY, (table) => {
                        table.increments(aTask.A_ID);
                        table.dateTime(aTask.A_CREATED).notNullable().defaultTo(knex.fn.now());
                        table.comment('Register for tasks (appointments, bookings).');
                    });
                }

                function createTblTaskDetail(schema) {
                    schema.createTable(aTaskDet.ENTITY, (table) => {
                        table.integer(aTaskDet.A_TASK_REF).unsigned().notNullable();
                        table.integer(aTaskDet.A_EMPLOYEE_REF).unsigned().notNullable();
                        table.integer(aTaskDet.A_SERVICE_REF).unsigned().notNullable();
                        table.string(aTaskDet.A_DATE, 8).comment('Date as "YYYYMMDD".');
                        table.string(aTaskDet.A_FROM, 4).notNullable().comment('Time starting: 0900.');
                        table.string(aTaskDet.A_TO, 4).notNullable().comment('Finish time: 2000.');
                        table.boolean(aTaskDet.A_MADE_ON_FRONT).notNullable()
                            .defaultTo(false)
                            .comment('true - if task is created by customer from pub app.');
                        table.string(aTaskDet.A_CUSTOMER, 255).notNullable().comment('Customer name.');
                        table.string(aTaskDet.A_PHONE, 255).nullable().comment('Customer phone.');
                        table.string(aTaskDet.A_EMAIL, 255).nullable().comment('Customer email.');
                        table.string(aTaskDet.A_LOCALE, 255).nullable().comment('Customer language (locale).');
                        table.string(aTaskDet.A_NOTE, 255).nullable().comment('Task notes.');
                        table.primary([aTaskDet.A_TASK_REF]);
                        table.foreign(aTaskDet.A_TASK_REF).references(aTask.A_ID).inTable(aTask.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_book_detail__book');
                        table.foreign(aTaskDet.A_EMPLOYEE_REF).references(aEmployee.A_ID).inTable(aEmployee.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_book_detail__employee');
                        table.foreign(aTaskDet.A_SERVICE_REF).references(aService.A_ID).inTable(aService.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_book_detail__service');
                        table.comment('Task details.');
                    });
                }

                // MAIN FUNCTIONALITY
                // compose queries to drop existing tables
                dropTables(schema);
                // compose queries to create main tables (registries)
                createTblEmployee(schema);
                createTblService(schema);
                createTblTask(schema, knex);
                // compose queries to create additional tables (relations and details)
                createTblEmployeeService(schema);
                createTblEmployeeTimeWork(schema);
                createTblTaskDetail(schema);
            }

            /**
             * Compose queries to insert data into the tables.
             * @param trx
             */
            async function populateWithData(trx) {
                // DEFINE INNER FUNCTIONS
                async function insertEmployees(trx) {
                    await trx(aEmployee.ENTITY).insert([
                        {
                            [aEmployee.A_ID]: 1, [aEmployee.A_CODE]: 'elena',
                            [aEmployee.A_NAME_LV]: 'Helena', [aEmployee.A_NAME_RU]: 'Елена',
                        }, {
                            [aEmployee.A_ID]: 2, [aEmployee.A_CODE]: 'natalie',
                            [aEmployee.A_NAME_LV]: 'Natalija', [aEmployee.A_NAME_RU]: 'Наталья',
                        }
                    ]);
                }

                async function insertEmployeeServices(trx) {
                    await trx(aEmplSrv.ENTITY).insert([
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
                }

                async function insertEmployeeTimeWork(trx) {
                    const timeWorkItems = [];
                    for (let i = 0; i < 20; i++) {
                        const ref = i % 2 + 1;
                        const dt = util.forwardDate(i - 10);
                        const date = util.formatDate(dt);
                        const from = '0700';
                        const to = '1800';
                        timeWorkItems.push({employee_ref: ref, date, from, to});

                    }
                    await trx(aEmplTimeWork.ENTITY).insert(timeWorkItems);
                }

                async function insertServices(trx) {
                    await trx(aService.ENTITY).insert([{
                        [aService.A_ID]: 1, [aService.A_CODE]: 'haircut_man',
                        [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30,
                        [aService.A_NAME_LV]: 'Vīriešu frizūra',
                        [aService.A_NAME_RU]: 'Стрижка мужская',
                    }, {
                        [aService.A_ID]: 2, [aService.A_CODE]: 'haircut_women',
                        [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30,
                        [aService.A_NAME_LV]: 'Sieviešu frizūra',
                        [aService.A_NAME_RU]: 'Стрижка женская',
                    }, {
                        [aService.A_ID]: 3, [aService.A_CODE]: 'haircut_child',
                        [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30,
                        [aService.A_NAME_LV]: 'Bērnu frizūra',
                        [aService.A_NAME_RU]: 'Стрижка детская',
                    }, {
                        [aService.A_ID]: 4, [aService.A_CODE]: 'color_simple',
                        [aService.A_PUBLIC]: true, [aService.A_DURATION]: 30,
                        [aService.A_NAME_LV]: 'Vienkārša krāsošana',
                        [aService.A_NAME_RU]: 'Окрашивание простое',
                    }, {
                        [aService.A_ID]: 5, [aService.A_CODE]: 'color_complex',
                        [aService.A_DURATION]: 60,
                        [aService.A_NAME_LV]: 'Kompleksa krāsošana',
                        [aService.A_NAME_RU]: 'Окрашивание сложное',
                    }, {
                        [aService.A_ID]: 6, [aService.A_CODE]: 'color_highlight',
                        [aService.A_DURATION]: 120,
                        [aService.A_NAME_LV]: 'Izcelšana',
                        [aService.A_NAME_RU]: 'Мелирование',
                    }, {
                        [aService.A_ID]: 7, [aService.A_CODE]: 'perm',
                        [aService.A_DURATION]: 60,
                        [aService.A_NAME_LV]: 'Perm',
                        [aService.A_NAME_RU]: 'Химическая завивка',
                    },]);
                }

                async function insertTasks(trx) {
                    await trx(aTask.ENTITY).insert([
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
                }

                async function insertTasksDetails(trx) {
                    const d0 = util.forwardDate(0);
                    const d1 = util.forwardDate(1);
                    const d2 = util.forwardDate(2);
                    const d3 = util.forwardDate(3);
                    const date0 = util.formatDate(d0);
                    const date1 = util.formatDate(d1);
                    const date2 = util.formatDate(d2);
                    const date3 = util.formatDate(d3);
                    await trx(aTaskDet.ENTITY).insert([
                        {
                            [aTaskDet.A_TASK_REF]: 1, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 1,
                            [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '0900', [aTaskDet.A_TO]: '1130',
                            [aTaskDet.A_CUSTOMER]: 'John Doe', [aTaskDet.A_EMAIL]: 'john@inter.net',
                            [aTaskDet.A_PHONE]: '2912312312', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 2, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 2,
                            [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '0930', [aTaskDet.A_TO]: '1030',
                            [aTaskDet.A_CUSTOMER]: 'John Doe', [aTaskDet.A_EMAIL]: 'john@inter.net',
                            [aTaskDet.A_PHONE]: '2912312312', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 3, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 3,
                            [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '1030', [aTaskDet.A_TO]: '1130',
                            [aTaskDet.A_CUSTOMER]: 'John Doe', [aTaskDet.A_EMAIL]: 'john@inter.net',
                            [aTaskDet.A_PHONE]: '2912312312', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 4, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 4,
                            [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '1200', [aTaskDet.A_TO]: '1330',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 5, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 5,
                            [aTaskDet.A_DATE]: date0, [aTaskDet.A_FROM]: '1630', [aTaskDet.A_TO]: '1730',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 6, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 5,
                            [aTaskDet.A_DATE]: date2, [aTaskDet.A_FROM]: '0930', [aTaskDet.A_TO]: '1130',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 7, [aTaskDet.A_EMPLOYEE_REF]: 1, [aTaskDet.A_SERVICE_REF]: 5,
                            [aTaskDet.A_DATE]: date2, [aTaskDet.A_FROM]: '1230', [aTaskDet.A_TO]: '1730',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 8, [aTaskDet.A_EMPLOYEE_REF]: 2, [aTaskDet.A_SERVICE_REF]: 5,
                            [aTaskDet.A_DATE]: date1, [aTaskDet.A_FROM]: '0900', [aTaskDet.A_TO]: '1030',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 9, [aTaskDet.A_EMPLOYEE_REF]: 2, [aTaskDet.A_SERVICE_REF]: 5,
                            [aTaskDet.A_DATE]: date1, [aTaskDet.A_FROM]: '1030', [aTaskDet.A_TO]: '1130',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [aTaskDet.A_TASK_REF]: 10, [aTaskDet.A_EMPLOYEE_REF]: 2, [aTaskDet.A_SERVICE_REF]: 5,
                            [aTaskDet.A_DATE]: date3, [aTaskDet.A_FROM]: '1030', [aTaskDet.A_TO]: '1730',
                            [aTaskDet.A_CUSTOMER]: 'Jane Doe', [aTaskDet.A_EMAIL]: 'jane@inter.net',
                            [aTaskDet.A_PHONE]: '2932132132', [aTaskDet.A_LOCALE]: 'en_US',
                            [aTaskDet.A_NOTE]: 'some notes related to the task.',
                        },
                    ]);
                }

                // MAIN FUNCTIONALITY
                await insertEmployees(trx);
                await insertServices(trx);
                await insertEmployeeServices(trx);
                await insertEmployeeTimeWork(trx);
                await insertTasks(trx);
                await insertTasksDetails(trx);
            }

            // MAIN FUNCTIONALITY
            const knex = connector.getKnex();
            const trx = await connector.startTransaction();
            try {
                // compose queries to recreate DB structure
                /** @type {SchemaBuilder} */
                const schema = connector.getSchema();
                recreateStructure(schema, knex);
                // perform queries to recreate DB structure
                await schema;

                // perform queries to insert data into created tables
                await populateWithData(trx);
                // perform queries to insert data and commit changes
                trx.commit();
            } catch (e) {
                trx.rollback();
                logger.error(`${e.toString()}`);
            }
            await connector.disconnect();
        };
    }
}
