/**
 * CLI action to upgrade RDB schema.
 */
export default class Fl32_Leana_Back_Cli_Db_Schema_Upgrade {
    // these 4 props are used in the base class 'Fl32_Leana_App_Cli_Command'
    action
    description = 'Upgrade RDB schema.'
    name = 'upgrade'
    namespace = 'db-schema'

    constructor(spec) {
        // INJECT DEPENDENCIES INTO THIS INSTANCE (PROPS AND VARS IN THE CLOSURE OF THE CONSTRUCTOR)
        /** @type {Fl32_Leana_App_Logger} */
        const _logger = spec.Fl32_Leana_App_Logger$;
        /** @type {Fl32_Leana_App_Db_Connector} */
        const _connector = spec.Fl32_Leana_App_Db_Connector$;
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const _util = spec.Fl32_Leana_Shared_Util_DateTime$;
        /** @type {Fl32_Leana_App_Obj_Factory} */
        const _objFactory = spec.Fl32_Leana_App_Obj_Factory$;
        /** @type {Fl32_Leana_App_Cli_Command} */
        const _base = spec.Fl32_Leana_App_Cli_Command$;

        // POPULATE CURRENT INSTANCE WITH BASE CLASSES METHODS (COMPOSITION INSTEAD OF INHERITANCE)
        _objFactory.assignPrototypeMethods(this, _base);

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
                // drop related tables (foreign keys)
                schema.dropTableIfExists('employee_service');
                schema.dropTableIfExists('employee_time_work');
                schema.dropTableIfExists('book_detail');
                // drop registries
                schema.dropTableIfExists('employee');
                schema.dropTableIfExists('service');
                schema.dropTableIfExists('book');
            }

            async function composeRegistries(schema, knex) {
                // EMPLOYEE
                schema.createTable('employee', (table) => {
                    table.increments('id');
                    table.string('code').notNullable().comment('Short unique name for employee.');
                    table.unique(['code'], 'UQ_employee__code');
                    table.comment('Register for employees.');
                });
                // SERVICE
                schema.createTable('service', (table) => {
                    table.increments('id');
                    table.string('code').notNullable()
                        .comment('Short unique name for service.');
                    table.integer('duration').unsigned().notNullable().defaultTo(0)
                        .comment('Service duration in minutes.');
                    table.boolean('public').notNullable().defaultTo(false)
                        .comment('Does this service available on front or only through admin UI.');
                    table.unique(['code'], 'UQ_employee__code');
                    table.comment('Register for services.');
                });
                // BOOKING
                schema.createTable('book', (table) => {
                    table.increments('id');
                    table.dateTime('created').notNullable().defaultTo(knex.fn.now());
                    table.comment('Register for appointments (booking).');
                });
            }

            async function composeEmployee(schema) {
                // EMPLOYEE_SERVICE
                schema.createTable('employee_service', (table) => {
                    table.integer('employee_ref').unsigned().notNullable();
                    table.integer('service_ref').unsigned().notNullable();
                    table.primary(['employee_ref', 'service_ref']);
                    table.foreign('employee_ref').references('id').inTable('employee')
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_employee_service__employee');
                    table.foreign('service_ref').references('id').inTable('service')
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_employee_service__service');
                    table.comment('Employee provides services.');
                });
                // EMPLOYEE_TIME_WORK
                schema.createTable('employee_time_work', (table) => {
                    table.integer('employee_ref').unsigned().notNullable();
                    table.string('date', 8).comment('Date as "YYYYMMDD".');
                    table.string('from', 4).defaultTo('0900').comment('Time starting: 0900.');
                    table.string('to', 4).defaultTo('2000').comment('Finish time: 2000.');
                    table.primary(['employee_ref', 'date', 'from']);
                    table.foreign('employee_ref').references('id').inTable('employee')
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_employee_time_work__employee');
                    table.comment('Working time for employees.');
                });
            }

            async function composeBook(schema) {
                schema.createTable('book_detail', (table) => {
                    table.integer('book_ref').unsigned().notNullable();
                    table.integer('employee_ref').unsigned().notNullable();
                    table.integer('service_ref').unsigned().notNullable();
                    table.string('date', 8).comment('Date as "YYYYMMDD".');
                    table.string('from', 4).notNullable().comment('Time starting: 0900.');
                    table.string('to', 4).notNullable().comment('Finish time: 2000.');
                    table.string('customer', 255).notNullable().comment('Customer name.');
                    table.string('phone', 255).nullable().comment('Customer phone.');
                    table.string('email', 255).nullable().comment('Customer email.');
                    table.string('lang', 255).nullable().comment('Customer language (locale).');
                    table.string('note', 255).nullable().comment('Task notes.');
                    table.primary(['book_ref']);
                    table.foreign('book_ref').references('id').inTable('book')
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_book_detail__book');
                    table.foreign('employee_ref').references('id').inTable('employee')
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_book_detail__employee');
                    table.foreign('service_ref').references('id').inTable('service')
                        .onDelete('CASCADE').onUpdate('CASCADE')
                        .withKeyName('FK_book_detail__service');
                    table.comment('Booking details.');
                });
            }

            async function initEmployee(trx) {
                await trx('employee').insert([
                    {id: 1, code: 'elena'},
                    {id: 2, code: 'natalie'}
                ]);
                await trx('service').insert([
                    {id: 1, code: 'haircut_man', public: true, duration: 30},
                    {id: 2, code: 'haircut_women', public: true, duration: 30},
                    {id: 3, code: 'haircut_child', public: true, duration: 30},
                    {id: 4, code: 'color_simple', public: true, duration: 30},
                    {id: 5, code: 'color_complex', duration: 60},
                    {id: 6, code: 'color_highlight', duration: 120},
                    {id: 7, code: 'perm', duration: 60},
                ]);
                await trx('employee_service').insert([
                    {employee_ref: 1, service_ref: 1},
                    {employee_ref: 1, service_ref: 2},
                    {employee_ref: 1, service_ref: 3},
                    {employee_ref: 1, service_ref: 4},
                    {employee_ref: 1, service_ref: 5},
                    {employee_ref: 1, service_ref: 7},
                    {employee_ref: 2, service_ref: 1},
                    {employee_ref: 2, service_ref: 2},
                    {employee_ref: 2, service_ref: 3},
                    {employee_ref: 2, service_ref: 4},
                    {employee_ref: 2, service_ref: 5},
                    {employee_ref: 2, service_ref: 6},
                ]);
                // employee_time_work
                const timeWorkItems = [];
                for (let i = 1; i < 20; i++) {
                    const ref = i % 2 + 1;
                    const dt = _util.forwardDate(i);
                    const date = _util.formatDate(dt);
                    timeWorkItems.push({employee_ref: ref, date});

                }
                await trx('employee_time_work').insert(timeWorkItems);
            }

            async function initBook(trx) {
                await trx('book').insert([
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4},
                    {id: 5},
                    {id: 6},
                    {id: 7},
                    {id: 8},
                    {id: 9},
                    {id: 10},
                ]);
                const d0 = _util.forwardDate(0);
                const d1 = _util.forwardDate(1);
                const d2 = _util.forwardDate(2);
                const d3 = _util.forwardDate(3);
                const date0 = _util.formatDate(d0);
                const date1 = _util.formatDate(d1);
                const date2 = _util.formatDate(d2);
                const date3 = _util.formatDate(d3);
                await trx('book_detail').insert([
                    {
                        book_ref: 1, employee_ref: 1, service_ref: 1, date: date0, from: '0900', to: '1115',
                        customer: 'John Doe', email: 'john@inter.net', phone: '2912312312',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 2, employee_ref: 1, service_ref: 2, date: date0, from: '0930', to: '1045',
                        customer: 'John Doe', email: 'john@inter.net', phone: '2912312312',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 3, employee_ref: 1, service_ref: 3, date: date0, from: '1030', to: '1130',
                        customer: 'John Doe', email: 'john@inter.net', phone: '2912312312',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 4, employee_ref: 1, service_ref: 4, date: date0, from: '1215', to: '1330',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 5, employee_ref: 1, service_ref: 5, date: date0, from: '1630', to: '1730',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 6, employee_ref: 1, service_ref: 5, date: date2, from: '0915', to: '1130',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 7, employee_ref: 1, service_ref: 5, date: date2, from: '1230', to: '1730',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 8, employee_ref: 2, service_ref: 5, date: date1, from: '0900', to: '1030',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 9, employee_ref: 2, service_ref: 5, date: date1, from: '1030', to: '1130',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    }, {
                        book_ref: 10, employee_ref: 2, service_ref: 5, date: date3, from: '1030', to: '1730',
                        customer: 'Jane Doe', email: 'jane@inter.net', phone: '2932132132',
                        lang: 'en_US', note: 'some notes related to the task.',
                    },
                ]);
            }

            // MAIN FUNCTIONALITY
            const knex = _connector.getKnex();
            const trx = await _connector.startTransaction();
            try {
                /** @type {SchemaBuilder} */
                const schema = _connector.getSchema();
                // compose queries to create DB structure
                await dropTables(schema);
                await composeRegistries(schema, knex);
                await composeEmployee(schema);
                await composeBook(schema);
                // perform queries to create DB structure
                await schema;
                // insert data
                await initEmployee(trx);
                await initBook(trx);


                // _logger.info(`${tables.toString()}`);
                trx.commit();
            } catch (e) {
                trx.rollback();
                _logger.error(`${e.toString()}`);
            }
            await _connector.disconnect();
        };
    }
}
