import $bcrypt from 'bcrypt';

const PERM_ID_CUST = 3;
const PERM_ID_DEV = 1;
const PERM_ID_EMPL = 2;
const ROLE_ID_CUST = 2;
const ROLE_ID_EMPL = 1;
const USER_ID_ALEX = 1;
const USER_ID_CUST = 4;
const USER_ID_LENA = 2;
const USER_ID_NATA = 3;

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
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec.Fl32_Leana_Defaults$;
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF_USER = spec.Fl32_Teq_User_Defaults$;
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
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Permission} */
        const ePerm = spec.Fl32_Teq_Acl_Store_RDb_Schema_Permission$;
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Perm_User} */
        const ePermUser = spec.Fl32_Teq_Acl_Store_RDb_Schema_Perm_User$;
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Role_Perm} */
        const eRolePerm = spec.Fl32_Teq_Acl_Store_RDb_Schema_Role_Perm$;
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Role_User} */
        const eRoleUser = spec.Fl32_Teq_Acl_Store_RDb_Schema_Role_User$;
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Role} */
        const eRole = spec.Fl32_Teq_Acl_Store_RDb_Schema_Role$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Auth_Password} */
        const eAuthPassword = spec['Fl32_Teq_User_Store_RDb_Schema_Auth_Password$'];
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Email$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec.Fl32_Teq_User_Store_RDb_Schema_Id_Phone$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eProfile = spec.Fl32_Teq_User_Store_RDb_Schema_Profile$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Link} */
        const eRefLink = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Link$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Ref_Tree} */
        const eRefTree = spec.Fl32_Teq_User_Store_RDb_Schema_Ref_Tree$;
        /** @type {Fl32_Teq_User_Store_RDb_Schema_User} */
        const eUser = spec.Fl32_Teq_User_Store_RDb_Schema_User$;
        /** @type {Fl32_Teq_Acl_Plugin_Store_RDb_Setup} */
        const setupTeqAcl = spec.Fl32_Teq_Acl_Plugin_Store_RDb_Setup$;
        /** @type {Fl32_Teq_User_Plugin_Store_RDb_Setup} */
        const setupTeqUser = spec.Fl32_Teq_User_Plugin_Store_RDb_Setup$;

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
                    schema.dropTableIfExists(eEmplSrv.ENTITY);
                    schema.dropTableIfExists(eEmplTimeWork.ENTITY);
                    schema.dropTableIfExists(eTaskDet.ENTITY);

                    /* drop registries */
                    // deprecated tables
                    schema.dropTableIfExists('book');
                    // actual tables
                    schema.dropTableIfExists(eEmployee.ENTITY);
                    schema.dropTableIfExists(eService.ENTITY);
                    schema.dropTableIfExists(eTask.ENTITY);
                }

                function createTblEmployee(schema) {
                    schema.createTable(eEmployee.ENTITY, (table) => {
                        table.increments(eEmployee.A_ID);
                        table.string(eEmployee.A_CODE).notNullable().comment('Short unique name for employee.');
                        table.string(eEmployee.A_NAME_LV).notNullable().comment('Employee name in latvian.');
                        table.string(eEmployee.A_NAME_RU).notNullable().comment('Employee name in russian.');
                        table.unique([eEmployee.A_CODE], 'UQ_employee__code');
                        table.comment('Register for employees.');
                    });
                }

                function createTblEmployeeService(schema) {
                    schema.createTable(eEmplSrv.ENTITY, (table) => {
                        table.integer(eEmplSrv.A_EMPLOYEE_REF).unsigned().notNullable();
                        table.integer(eEmplSrv.A_SERVICE_REF).unsigned().notNullable();
                        table.primary([eEmplSrv.A_EMPLOYEE_REF, eEmplSrv.A_SERVICE_REF]);
                        table.foreign(eEmplSrv.A_EMPLOYEE_REF).references(eEmployee.A_ID).inTable(eEmployee.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_employee_service__employee');
                        table.foreign(eEmplSrv.A_SERVICE_REF).references(eService.A_ID).inTable(eService.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_employee_service__service');
                        table.comment('Employee provides services.');
                    });
                }

                function createTblService(schema) {
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
                        table.unique([eService.A_CODE], 'UQ_employee__code');
                        table.comment('Register for services.');
                    });
                }

                function createTblEmployeeTimeWork(schema) {
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
                        table.foreign(eEmplTimeWork.A_EMPLOYEE_REF).references(eEmployee.A_ID).inTable(eEmployee.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_employee_time_work__employee');
                        table.comment('Working time for employees.');
                    });
                }

                function createTblTask(schema, knex) {
                    schema.createTable(eTask.ENTITY, (table) => {
                        table.increments(eTask.A_ID);
                        table.dateTime(eTask.A_CREATED).notNullable().defaultTo(knex.fn.now());
                        table.comment('Register for tasks (appointments, bookings).');
                    });
                }

                function createTblTaskDetail(schema) {
                    schema.createTable(eTaskDet.ENTITY, (table) => {
                        table.integer(eTaskDet.A_TASK_REF).unsigned().notNullable();
                        table.integer(eTaskDet.A_EMPLOYEE_REF).unsigned().notNullable();
                        table.integer(eTaskDet.A_SERVICE_REF).unsigned().notNullable();
                        table.string(eTaskDet.A_DATE, 8).comment('Date as "YYYYMMDD".');
                        table.string(eTaskDet.A_FROM, 4).notNullable().comment('Time starting: 0900.');
                        table.string(eTaskDet.A_TO, 4).notNullable().comment('Finish time: 2000.');
                        table.boolean(eTaskDet.A_MADE_ON_FRONT).notNullable()
                            .defaultTo(false)
                            .comment('true - if task is created by customer from pub app.');
                        table.string(eTaskDet.A_CUSTOMER, 255).notNullable().comment('Customer name.');
                        table.string(eTaskDet.A_PHONE, 255).nullable().comment('Customer phone.');
                        table.string(eTaskDet.A_EMAIL, 255).nullable().comment('Customer email.');
                        table.string(eTaskDet.A_LOCALE, 255).nullable().comment('Customer language (locale).');
                        table.string(eTaskDet.A_NOTE, 255).nullable().comment('Task notes.');
                        table.primary([eTaskDet.A_TASK_REF]);
                        table.foreign(eTaskDet.A_TASK_REF).references(eTask.A_ID).inTable(eTask.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_book_detail__book');
                        table.foreign(eTaskDet.A_EMPLOYEE_REF).references(eEmployee.A_ID).inTable(eEmployee.ENTITY)
                            .onDelete('CASCADE').onUpdate('CASCADE')
                            .withKeyName('FK_book_detail__employee');
                        table.foreign(eTaskDet.A_SERVICE_REF).references(eService.A_ID).inTable(eService.ENTITY)
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
                async function insertAcl(trx) {
                    // permissions
                    await trx(ePerm.ENTITY).insert([
                        {[ePerm.A_ID]: PERM_ID_CUST, [ePerm.A_CODE]: DEF.ACL_IS_CUSTOMER},
                        {[ePerm.A_ID]: PERM_ID_DEV, [ePerm.A_CODE]: DEF.ACL_IS_DEVELOPER},
                        {[ePerm.A_ID]: PERM_ID_EMPL, [ePerm.A_CODE]: DEF.ACL_IS_EMPLOYEE},
                    ]);
                    // roles
                    await trx(eRole.ENTITY).insert([
                        {[eRole.A_ID]: ROLE_ID_CUST, [eRole.A_CODE]: 'customer'},
                        {[eRole.A_ID]: ROLE_ID_EMPL, [eRole.A_CODE]: 'employee'},
                    ]);
                    // permissions for roles
                    await trx(eRolePerm.ENTITY).insert([
                        {[eRolePerm.A_ROLE_REF]: ROLE_ID_EMPL, [eRolePerm.A_PERM_REF]: PERM_ID_EMPL},
                        {[eRolePerm.A_ROLE_REF]: ROLE_ID_CUST, [eRolePerm.A_PERM_REF]: PERM_ID_CUST},
                    ]);
                    // users for roles
                    await trx(eRoleUser.ENTITY).insert([
                        {[eRoleUser.A_ROLE_REF]: ROLE_ID_CUST, [eRoleUser.A_USER_REF]: USER_ID_ALEX},
                        {[eRoleUser.A_ROLE_REF]: ROLE_ID_CUST, [eRoleUser.A_USER_REF]: USER_ID_CUST},
                        {[eRoleUser.A_ROLE_REF]: ROLE_ID_EMPL, [eRoleUser.A_USER_REF]: USER_ID_ALEX},
                        {[eRoleUser.A_ROLE_REF]: ROLE_ID_EMPL, [eRoleUser.A_USER_REF]: USER_ID_LENA},
                        {[eRoleUser.A_ROLE_REF]: ROLE_ID_EMPL, [eRoleUser.A_USER_REF]: USER_ID_NATA},
                    ]);
                    // individual permissions
                    await trx(ePermUser.ENTITY).insert([
                        {[ePermUser.A_PERM_REF]: PERM_ID_CUST, [ePermUser.A_USER_REF]: USER_ID_ALEX},
                        {[ePermUser.A_PERM_REF]: PERM_ID_DEV, [ePermUser.A_USER_REF]: USER_ID_ALEX},
                        {[ePermUser.A_PERM_REF]: PERM_ID_EMPL, [ePermUser.A_USER_REF]: USER_ID_ALEX},
                    ]);
                }

                async function insertEmployees(trx) {
                    await trx(eEmployee.ENTITY).insert([
                        {
                            [eEmployee.A_ID]: 1, [eEmployee.A_CODE]: 'elena',
                            [eEmployee.A_NAME_LV]: 'Helena', [eEmployee.A_NAME_RU]: 'Елена',
                        }, {
                            [eEmployee.A_ID]: 2, [eEmployee.A_CODE]: 'natalie',
                            [eEmployee.A_NAME_LV]: 'Natalija', [eEmployee.A_NAME_RU]: 'Наталья',
                        }
                    ]);
                }

                async function insertEmployeeServices(trx) {
                    await trx(eEmplSrv.ENTITY).insert([
                        {[eEmplSrv.A_EMPLOYEE_REF]: 1, [eEmplSrv.A_SERVICE_REF]: 1},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 1, [eEmplSrv.A_SERVICE_REF]: 2},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 1, [eEmplSrv.A_SERVICE_REF]: 3},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 1, [eEmplSrv.A_SERVICE_REF]: 4},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 1, [eEmplSrv.A_SERVICE_REF]: 5},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 1, [eEmplSrv.A_SERVICE_REF]: 7},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 2, [eEmplSrv.A_SERVICE_REF]: 1},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 2, [eEmplSrv.A_SERVICE_REF]: 2},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 2, [eEmplSrv.A_SERVICE_REF]: 3},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 2, [eEmplSrv.A_SERVICE_REF]: 4},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 2, [eEmplSrv.A_SERVICE_REF]: 5},
                        {[eEmplSrv.A_EMPLOYEE_REF]: 2, [eEmplSrv.A_SERVICE_REF]: 6},
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
                    await trx(eEmplTimeWork.ENTITY).insert(timeWorkItems);
                }

                async function insertServices(trx) {
                    await trx(eService.ENTITY).insert([{
                        [eService.A_ID]: 1, [eService.A_CODE]: 'haircut_man',
                        [eService.A_PUBLIC]: true, [eService.A_DURATION]: 30,
                        [eService.A_NAME_LV]: 'Vīriešu frizūra',
                        [eService.A_NAME_RU]: 'Стрижка мужская',
                    }, {
                        [eService.A_ID]: 2, [eService.A_CODE]: 'haircut_women',
                        [eService.A_PUBLIC]: true, [eService.A_DURATION]: 30,
                        [eService.A_NAME_LV]: 'Sieviešu frizūra',
                        [eService.A_NAME_RU]: 'Стрижка женская',
                    }, {
                        [eService.A_ID]: 3, [eService.A_CODE]: 'haircut_child',
                        [eService.A_PUBLIC]: true, [eService.A_DURATION]: 30,
                        [eService.A_NAME_LV]: 'Bērnu frizūra',
                        [eService.A_NAME_RU]: 'Стрижка детская',
                    }, {
                        [eService.A_ID]: 4, [eService.A_CODE]: 'color_simple',
                        [eService.A_PUBLIC]: true, [eService.A_DURATION]: 30,
                        [eService.A_NAME_LV]: 'Vienkārša krāsošana',
                        [eService.A_NAME_RU]: 'Окрашивание простое',
                    }, {
                        [eService.A_ID]: 5, [eService.A_CODE]: 'color_complex',
                        [eService.A_DURATION]: 60,
                        [eService.A_NAME_LV]: 'Kompleksa krāsošana',
                        [eService.A_NAME_RU]: 'Окрашивание сложное',
                    }, {
                        [eService.A_ID]: 6, [eService.A_CODE]: 'color_highlight',
                        [eService.A_DURATION]: 120,
                        [eService.A_NAME_LV]: 'Izcelšana',
                        [eService.A_NAME_RU]: 'Мелирование',
                    }, {
                        [eService.A_ID]: 7, [eService.A_CODE]: 'perm',
                        [eService.A_DURATION]: 60,
                        [eService.A_NAME_LV]: 'Perm',
                        [eService.A_NAME_RU]: 'Химическая завивка',
                    },]);
                }

                async function insertTasks(trx) {
                    await trx(eTask.ENTITY).insert([
                        {[eTask.A_ID]: 1},
                        {[eTask.A_ID]: 2},
                        {[eTask.A_ID]: 3},
                        {[eTask.A_ID]: 4},
                        {[eTask.A_ID]: 5},
                        {[eTask.A_ID]: 6},
                        {[eTask.A_ID]: 7},
                        {[eTask.A_ID]: 8},
                        {[eTask.A_ID]: 9},
                        {[eTask.A_ID]: 10},
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
                    await trx(eTaskDet.ENTITY).insert([
                        {
                            [eTaskDet.A_TASK_REF]: 1, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 1,
                            [eTaskDet.A_DATE]: date0, [eTaskDet.A_FROM]: '0900', [eTaskDet.A_TO]: '1130',
                            [eTaskDet.A_CUSTOMER]: 'John Doe', [eTaskDet.A_EMAIL]: 'john@inter.net',
                            [eTaskDet.A_PHONE]: '2912312312', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 2, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 2,
                            [eTaskDet.A_DATE]: date0, [eTaskDet.A_FROM]: '0930', [eTaskDet.A_TO]: '1030',
                            [eTaskDet.A_CUSTOMER]: 'John Doe', [eTaskDet.A_EMAIL]: 'john@inter.net',
                            [eTaskDet.A_PHONE]: '2912312312', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 3, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 3,
                            [eTaskDet.A_DATE]: date0, [eTaskDet.A_FROM]: '1030', [eTaskDet.A_TO]: '1130',
                            [eTaskDet.A_CUSTOMER]: 'John Doe', [eTaskDet.A_EMAIL]: 'john@inter.net',
                            [eTaskDet.A_PHONE]: '2912312312', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 4, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 4,
                            [eTaskDet.A_DATE]: date0, [eTaskDet.A_FROM]: '1200', [eTaskDet.A_TO]: '1330',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 5, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 5,
                            [eTaskDet.A_DATE]: date0, [eTaskDet.A_FROM]: '1630', [eTaskDet.A_TO]: '1730',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 6, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 5,
                            [eTaskDet.A_DATE]: date2, [eTaskDet.A_FROM]: '0930', [eTaskDet.A_TO]: '1130',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 7, [eTaskDet.A_EMPLOYEE_REF]: 1, [eTaskDet.A_SERVICE_REF]: 5,
                            [eTaskDet.A_DATE]: date2, [eTaskDet.A_FROM]: '1230', [eTaskDet.A_TO]: '1730',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 8, [eTaskDet.A_EMPLOYEE_REF]: 2, [eTaskDet.A_SERVICE_REF]: 5,
                            [eTaskDet.A_DATE]: date1, [eTaskDet.A_FROM]: '0900', [eTaskDet.A_TO]: '1030',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 9, [eTaskDet.A_EMPLOYEE_REF]: 2, [eTaskDet.A_SERVICE_REF]: 5,
                            [eTaskDet.A_DATE]: date1, [eTaskDet.A_FROM]: '1030', [eTaskDet.A_TO]: '1130',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        }, {
                            [eTaskDet.A_TASK_REF]: 10, [eTaskDet.A_EMPLOYEE_REF]: 2, [eTaskDet.A_SERVICE_REF]: 5,
                            [eTaskDet.A_DATE]: date3, [eTaskDet.A_FROM]: '1030', [eTaskDet.A_TO]: '1730',
                            [eTaskDet.A_CUSTOMER]: 'Jane Doe', [eTaskDet.A_EMAIL]: 'jane@inter.net',
                            [eTaskDet.A_PHONE]: '2932132132', [eTaskDet.A_LOCALE]: 'en_US',
                            [eTaskDet.A_NOTE]: 'some notes related to the task.',
                        },
                    ]);
                }

                async function insertUsers(trx) {
                    await trx(eUser.ENTITY).insert([
                        {[eUser.A_ID]: USER_ID_ALEX},
                        {[eUser.A_ID]: USER_ID_LENA},
                        {[eUser.A_ID]: USER_ID_NATA},
                        {[eUser.A_ID]: USER_ID_CUST},
                    ]);
                    await trx(eProfile.ENTITY).insert([
                        {[eProfile.A_USER_REF]: USER_ID_ALEX, [eProfile.A_NAME]: 'Alex'},
                        {[eProfile.A_USER_REF]: USER_ID_LENA, [eProfile.A_NAME]: 'Helena'},
                        {[eProfile.A_USER_REF]: USER_ID_NATA, [eProfile.A_NAME]: 'Nataly'},
                        {[eProfile.A_USER_REF]: USER_ID_CUST, [eProfile.A_NAME]: 'Some Customer'},
                    ]);
                    const hash1 = await $bcrypt.hash('test', DEF_USER.BCRYPT_HASH_ROUNDS);
                    const hash2 = await $bcrypt.hash('test', DEF_USER.BCRYPT_HASH_ROUNDS);
                    const hash3 = await $bcrypt.hash('test', DEF_USER.BCRYPT_HASH_ROUNDS);
                    const hash4 = await $bcrypt.hash('test', DEF_USER.BCRYPT_HASH_ROUNDS);
                    await trx(eAuthPassword.ENTITY).insert([
                        {
                            [eAuthPassword.A_USER_REF]: USER_ID_ALEX,
                            [eAuthPassword.A_LOGIN]: 'alex',
                            [eAuthPassword.A_PASSWORD_HASH]: hash1,
                        }, {
                            [eAuthPassword.A_USER_REF]: USER_ID_LENA,
                            [eAuthPassword.A_LOGIN]: 'lena',
                            [eAuthPassword.A_PASSWORD_HASH]: hash2,
                        }, {
                            [eAuthPassword.A_USER_REF]: USER_ID_NATA,
                            [eAuthPassword.A_LOGIN]: 'nata',
                            [eAuthPassword.A_PASSWORD_HASH]: hash3,
                        }, {
                            [eAuthPassword.A_USER_REF]: USER_ID_CUST,
                            [eAuthPassword.A_LOGIN]: 'cust',
                            [eAuthPassword.A_PASSWORD_HASH]: hash4,
                        }
                    ]);
                    await trx(eIdEmail.ENTITY).insert({
                        [eIdEmail.A_EMAIL]: 'alex@flancer64.com',
                        [eIdEmail.A_USER_REF]: USER_ID_ALEX,
                    });
                    await trx(eIdPhone.ENTITY).insert({
                        [eIdPhone.A_PHONE]: '(371)29181801',
                        [eIdPhone.A_USER_REF]: USER_ID_ALEX,
                    });
                    await trx(eRefLink.ENTITY).insert({
                        [eRefLink.A_USER_REF]: USER_ID_ALEX,
                        [eRefLink.A_CODE]: 'dev',
                    });
                    // users tree
                    await trx(eRefTree.ENTITY).insert({
                        [eRefTree.A_USER_REF]: USER_ID_ALEX,
                        [eRefTree.A_PARENT_REF]: USER_ID_ALEX,
                    });
                    await trx(eRefTree.ENTITY).insert({
                        [eRefTree.A_USER_REF]: USER_ID_LENA,
                        [eRefTree.A_PARENT_REF]: USER_ID_ALEX,
                    });
                    await trx(eRefTree.ENTITY).insert({
                        [eRefTree.A_USER_REF]: USER_ID_NATA,
                        [eRefTree.A_PARENT_REF]: USER_ID_ALEX,
                    });
                    await trx(eRefTree.ENTITY).insert({
                        [eRefTree.A_USER_REF]: USER_ID_CUST,
                        [eRefTree.A_PARENT_REF]: USER_ID_LENA,
                    });
                }

                // MAIN FUNCTIONALITY
                await insertEmployees(trx);
                await insertServices(trx);
                await insertEmployeeServices(trx);
                await insertEmployeeTimeWork(trx);
                await insertTasks(trx);
                await insertTasksDetails(trx);
                await insertUsers(trx);
                await insertAcl(trx);
            }

            // MAIN FUNCTIONALITY
            const knex = connector.getKnex();
            const trx = await connector.startTransaction();
            try {
                // compose queries to recreate DB structure
                /** @type {SchemaBuilder} */
                const schema = connector.getSchema();
                recreateStructure(schema, knex);
                //
                // run setups from modules:
                //
                // drop tables considering relations
                await setupTeqAcl.dropTables1(schema);
                await setupTeqUser.dropTables1(schema);
                await setupTeqAcl.dropTables0(schema);
                await setupTeqUser.dropTables0(schema);
                // create tables
                await setupTeqUser.createStructure(knex, schema);
                await setupTeqAcl.createStructure(knex, schema);
                // perform queries to recreate DB structure
                await schema;

                // perform queries to insert data into created tables
                await populateWithData(trx);
                // run setups from modules
                await setupTeqUser.initData(knex, trx);
                await setupTeqAcl.initData(knex, trx);
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
