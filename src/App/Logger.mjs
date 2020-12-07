/**
 * Server side logger. Used by all objects on server side.
 */
const LEVEL_DEBUG = 1;
const LEVEL_INFO = 2;
const LEVEL_WARN = 3;
const LEVEL_ERROR = 4;
const TEQ_FW_LOG_MARKERS = 'teqFwLogMarkers';

export default class Fl32_Leana_App_Logger {
    /** @type {LogQueue} */
    _queue
    /** @type {Array<Object>} */
    _transports = []

    constructor() {

        /**
         * Internal queue to save log data (FIFO).
         *
         * https://stackoverflow.com/a/53966257/4073821
         */
        class LogQueue extends Map {
            insertionIndex = 0
            removalIndex = 0

            /**
             * Put log record into the queue.
             *
             * @param element
             */
            queue(element) {
                this.set(this.insertionIndex, element);
                this.insertionIndex++;
            }

            /**
             * Get last queued item.
             *
             * @return {Object}
             */
            getLast() {
                return this.get(this.insertionIndex - 1);
            }

            /**
             * Get log record from queue.
             *
             * @return {Object}
             */
            dequeue() {
                const result = this.get(this.removalIndex);
                if (typeof result !== 'undefined') {
                    this.delete(this.removalIndex);
                    this.removalIndex++;
                }
                return result;
            }
        }

        /**
         * Internal queue to temporary save log data before processing.
         *
         * @type {LogQueue}
         * @private
         */
        this._queue = new LogQueue();

        const me = this;

        /**
         * Place log record in queue, then process queue against existing transports.
         *
         * @private
         * @param {Number} level
         * @param {string|Object} first
         * @param {string|Object} [second]
         * @param {Object} [third]
         */
        function write(level, first, second, third) {
            const record = {};
            // TODO: use 'process.hrtime()' to get microtime
            record.date = (new Date()).getTime(); // int, UTC
            record.level = level;
            record.markers = {};

            if (arguments.length === 2) {
                if (typeof first === 'string') {
                    // debug('message')
                    record.message = first;
                } else {
                    // OK, it is not a first argument in this function but first argument in public wrapper.
                    throw 'Logger error. String message is expected as first argument!';
                }
            } else if (arguments.length === 3) {
                if ((typeof first === 'object') && (typeof second === 'string')) {
                    // debug(this, message)
                    if (first[TEQ_FW_LOG_MARKERS] !== undefined) {
                        record.markers = first[TEQ_FW_LOG_MARKERS];
                    }
                    record.message = second;
                } else if (typeof first === 'string') {
                    // debug(message, details)
                    record.message = first;
                    record.details = second;
                } else {
                    // OK, it is not a first & second argument in this function, but (see upper)).
                    throw 'Logger error. Check first & second arguments (should be object/string or string/object)!';
                }
            } else if (arguments.length === 4) {
                if (
                    (typeof first === 'object') &&
                    (typeof second === 'string') &&
                    (typeof third === 'object')
                ) {
                    // debug(this, message, details)
                    if (first[TEQ_FW_LOG_MARKERS] !== undefined) {
                        record.markers = first[TEQ_FW_LOG_MARKERS];
                    }
                    record.message = second;
                    record.details = third;
                } else {
                    throw 'Logger error. Check arguments types (object/string/object are expected)!';
                }
            } else {
                // OK, it is 4 arguments max are expected, but (see upper)).
                throw 'Logger error. Max 3 arguments are expected!';
            }
            me._queue.queue(record);
            // print or save logs in queue
            processQueue();
        }

        /**
         * Output queued log items using transports.
         */
        function processQueue() {
            /* process queue if transports list is not empty */
            if (me._transports.length > 0) {
                /* compose batch with log messages to process */
                const batch = [];
                let item = me._queue.dequeue();
                while (item !== undefined) {
                    batch.push(item);
                    item = me._queue.dequeue();
                }
                /* process batch against transports */
                if (batch.length > 0) {
                    /* make async processing */
                    for (const one of me._transports) {
                        one.process(batch);
                    }
                }
            }
        }

        this.debug = function () {
            const params = Array.prototype.slice.call(arguments);
            params.unshift(LEVEL_DEBUG);
            write.apply(this, params);
        };

        this.info = function () {
            const params = Array.prototype.slice.call(arguments);
            params.unshift(LEVEL_INFO);
            write.apply(this, params);
        };

        this.warn = function () {
            const params = Array.prototype.slice.call(arguments);
            params.unshift(LEVEL_WARN);
            write.apply(this, params);
        };

        this.error = function () {
            const params = Array.prototype.slice.call(arguments);
            params.unshift(LEVEL_ERROR);
            write.apply(this, params);
        };
    }


    getLast() {
        return this._queue.getLast();
    }

    /**
     * Add transport to logger.
     *
     * @param {Object} transport
     */
    addTransport(transport) {
        this._transports.push(transport);
    }
}
