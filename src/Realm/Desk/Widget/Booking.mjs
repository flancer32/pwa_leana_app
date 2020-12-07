const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const template = `
<div class="booking">
    <div>
        <div class="book_panel">
            <booking-entry
                v-for="one in Object.values(panelEntries)"
                :style="{'z-index': one.cssZindex}"
                :id="one.id"
                :timestamp="one.timestamp"
                :tasks = "one.tasks"
                :begin = "one.begin"
                :end = "one.end"
                :interval="step"
            ></booking-entry>
        </div>
    </div> 
</div>
`;

export default function Fl32_Leana_Realm_Desk_Widget_Booking(spec) {
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Entry} */
    const bookingEntry = spec.Fl32_Leana_Realm_Desk_Widget_Booking_Entry$;
    const EntryUi = spec['Fl32_Leana_Realm_Desk_Widget_Booking_Api#Entry'];
    const Swipe = spec['Fl32_Leana_Realm_Desk_Util_Swipe#'];
    return {
        template,
        components: {
            bookingEntry
        },
        props: {
            begin: String,  // '0900'
            end: String,    // '2000'
            step: Number,   // 60 - entry height in minutes
            tasks: Object,  // {'20201120': {1: {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task}}} tasks for the date
        },
        data: function () {
            return {
                gridStep: 15,   // minimal step for tasks scheduling
            };
        },
        computed: {
            beginMins() {
                return utilDate.convertDbHrsMinsToMins(this.begin);
            },
            endMins() {
                return utilDate.convertDbHrsMinsToMins(this.end);
            },
            /**
             * Get tasks for selected date then compose array with 'hours' in rows and tasks being bound to the rows.
             * @return {Object.<number, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry>}
             */
            panelEntries() {
                const me = this;

                // DEFINE INNER FUNCTIONS
                /**
                 * Get array of the tasks for the given date.
                 *
                 * @param datestamp - 'YYYYMMDD'
                 * @return {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task[]}
                 * @private
                 */
                function _getTasksOnDate(datestamp) {
                    const result = [];
                    /** @type {Object.<string, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task>} */
                    const tasksProxy = me.tasks[datestamp];
                    // we can't iterate over proxy object directly
                    if (tasksProxy) {
                        for (const id in tasksProxy) {
                            // const task = tasksProxy[id];
                            // task.begin = utilDate.convertHrsMinsToMins(task.begin);
                            result.push(tasksProxy[id]);
                        }
                    }
                    return result;
                }

                /**
                 * Place all tasks on the grid with minimal step (15, 10, 5 minutes - see this.gridStep).
                 * @param {number} dayBegin 540
                 * @param {number} dayEnd 1200
                 * @param {number} step 15, 10, 5
                 * @param {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task[]} tasksOnDate
                 * @return {Object.<number, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry>}
                 * @private
                 */
                function _getGridWithTasks(dayBegin, dayEnd, step, tasksOnDate) {
                    const result = {};
                    let intervalBegin = dayBegin;
                    let running = [];
                    while (intervalBegin <= dayEnd) {
                        const id = intervalBegin;
                        const timestamp = utilDate.convertMinsToHrsMins(intervalBegin, true);
                        // leave not ended tasks only in 'running' registry
                        running = running.filter(one => one.end > intervalBegin);
                        // filter tasks that started in interval [begin, end].
                        const intervalEnd = intervalBegin + step;
                        const tasks = tasksOnDate.filter(one => (one.begin >= intervalBegin) && (one.begin < intervalEnd));
                        // we need to place new task in appropriate column in the row (entry)
                        for (/** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task} */ const task of tasks) {
                            // do it for every task in the row (entry)
                            let column = 1; // place task to the first column by default
                            // calculate column for the task
                            for (/** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task} */const old of running) {
                                const end = old.end;
                                const col = old.column;
                                const begin = task.begin;
                                // place task to the next column if current column is occupied
                                if ((col === column) && (begin < end)) {
                                    column++;
                                } else if (begin > end) {
                                    column = 1;
                                }
                            }
                            task.column = column;
                            // registry tasks as running
                            running.push(task);
                        }
                        // total active tasks for the period
                        const totalActive = Object.keys(running).length;
                        for (const one of running) {
                            one.activeTasks = (one.activeTasks > totalActive) ? one.activeTasks : totalActive;
                        }
                        const cssZindex = 1500 - intervalBegin; // z-index (from high to low)
                        // compose new entry (row in table, 'one hour')
                        /** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry} */
                        const entry = new EntryUi();
                        entry.activeTasks = totalActive;
                        entry.cssZindex = cssZindex;
                        entry.id = id;
                        entry.tasks = tasks;
                        entry.timestamp = timestamp;
                        entry.begin = intervalBegin;
                        entry.end = intervalEnd;
                        result[id] = entry;
                        intervalBegin += step;
                    }
                    return result;
                }

                /**
                 *
                 * @param {Object.<number, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry>} grid
                 * @param {number} stepEntry 60 'height' for the panel entry in minutes
                 * @param {number} stepGrid  15
                 * @return {Object.<number, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry>}
                 * @private
                 */
                function _convertGridToEntries(grid, stepEntry, stepGrid) {
                    const result = {};
                    let gridInEntry = 0;
                    /** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry} */
                    let entry = new EntryUi();
                    for (/** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry} */const key of Object.keys(grid)) {
                        /** @type {Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry} */
                        const one = grid[key];
                        if (gridInEntry === 0) {
                            // this is first grid row for entry interval
                            Object.assign(entry, one);
                        } else {
                            // this is subsequent grid rows for entry interval
                            entry.tasks = entry.tasks.concat(one.tasks);
                            entry.end = one.end;
                        }
                        gridInEntry += stepGrid;
                        if (gridInEntry >= stepEntry) {
                            result[entry.id] = entry;
                            entry = new EntryUi();
                            gridInEntry = 0;
                        }
                    }
                    // add the last incomplete entry
                    if (entry.id) result[entry.id] = entry;
                    return result;
                }

                // MAIN FUNCTIONALITY
                // const result = {};
                const dayBegin = utilDate.convertDbHrsMinsToMins(this.begin);
                const dayEnd = utilDate.convertDbHrsMinsToMins(this.end);
                // get tasks for selected date
                const datestamp = utilDate.formatDate(this.dateSelected);
                const tasksOnDate = _getTasksOnDate(datestamp);    // all tasks being scheduled for the date
                const grid = _getGridWithTasks(dayBegin, dayEnd, this.gridStep, tasksOnDate);
                return _convertGridToEntries(grid, this.step, this.gridStep);
            },
            ...mapState({
                dateSelected: state => state.calendar.dateSelected,
            })
        },
        methods: {
            ...mapMutations({
                saveDateSelected: 'calendar/setDateSelected',
            }),
        },
        mounted() {
            const me = this;
            /** @type {Fl32_Leana_Realm_Desk_Util_Swipe} */
            const swipe = new Swipe('.book_panel');
            swipe.setOnLeft(function () {
                const dayAfter = utilDate.forwardDate(1, me.dateSelected);
                me.saveDateSelected(dayAfter);
            });
            swipe.setOnRight(function () {
                const dayBefore = utilDate.forwardDate(-1, me.dateSelected);
                me.saveDateSelected(dayBefore);
            });
        }
    };
}
