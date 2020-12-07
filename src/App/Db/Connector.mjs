import $knex from 'knex';

/**
 * 'knex' based connector to relational database.
 */
export default class Fl32_Leana_App_Db_Connector {
    /** @type {Fl32_Leana_App_Config} */
    _config
    /** @type {Fl32_Leana_App_Logger} */
    _logger
    _knex

    /**  @param {Object} spec */
    constructor(spec) {
        this._config = spec.Fl32_Leana_App_Config$;
        this._logger = spec.Fl32_Leana_App_Logger$;
    }

    /**
     * Initialize connection to 'main' database.
     *
     * @returns {Promise<void>}
     */
    async init() {
        const dbSpec = this._config.get('/local/db/main');
        const db = dbSpec.connection.database + '@' + dbSpec.connection.host;
        const user = dbSpec.connection.user;
        try {
            this._knex = await $knex(dbSpec);
            this._logger.info('Connected to DB \'' + db + '\' as \'' + user + '\'.');
        } catch (e) {
            this._logger.error('Cannot connect to DB \'' + db + '\' as \'' + user + '\'. Error: ' + e);
        }
    }

    /**
     * Start new knex transaction.
     *
     * @returns {Promise<*>}
     */
    async startTransaction() {
        return await this._knex.transaction();
    }

    /**
     * Accessor for 'knex' object.
     *
     * @return {*}
     */
    getKnex() {
        return this._knex;
    }

    /**
     * Accessor for 'knex.schema' object.
     * @returns {*}
     */
    getSchema() {
        return this._knex.schema;
    }

    async disconnect() {
        const me = this;
        const pool = me._knex.client.pool;
        return new Promise(function (resolve) {
            const WAIT = 100;

            /**
             * Check DB connections in loop and close all when all connections will be released.
             */
            function checkPool() {
                const acquires = pool.numPendingAcquires();
                const creates = pool.numPendingCreates();
                const pending = acquires + creates;
                if (pending > 0) {
                    // wait until all connections will be released
                    setTimeout(checkPool, WAIT);
                } else {
                    // close all connections
                    me._knex.destroy();
                    me._logger.info('All database connections are closed.');
                    resolve();
                }
            }

            setTimeout(checkPool, WAIT);
        });

    }
}
