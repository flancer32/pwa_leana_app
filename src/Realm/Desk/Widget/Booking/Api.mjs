/**
 * Data structure for Booking Panel entry (hour with bound tasks).
 */
class Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry {
    /**
     * Unique ID for DOM element.
     * @type {string}
     */
    id
    /**
     * Label for the row (HH:MM)
     * @type {string}
     */
    timestamp
    /**
     * Start of the entry interval in minutes from the day beginning (inclusive).
     * @type {number} 540
     */
    begin
    /**
     * End of the entry interval in minutes from the day beginning (exclusive).
     * @type {number} 600
     */
    end
    /** @type {Object.<string, Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task>} */
    tasks
    /**
     * Total active tasks for the period (row - hour, half, etc.).
     * Some tasks can be started in other periods.
     * @type {number} 1, 2, 3, ...
     */
    activeTasks
    /** @type {number} */
    cssZindex
}

/**
 * Data structure for entry's task in Booking Panel (booked service).
 */
class Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task {
    /**
     * Unique ID for DOM element.
     * @type {string}
     */
    id
    /**
     * Label for the task
     * @type {string}
     */
    title
    /**
     * Start time for the task in minutes from day begin (00:00)
     * @type {number} 540
     */
    begin
    /**
     * End time for the task in minutes from day begin (00:00)
     * @type {number} 570
     */
    end
    /**
     * Duration in minutes.
     * @type {Number} 30
     */
    duration
    /**
     * Total active tasks for the period (row - hour, half, etc.).
     * @type {number} 1, 2, 3, ...
     */
    activeTasks
    /**
     * Position in row to print out task.
     * @type {number} 1,2,3
     */
    column
    /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Task} */
    taskData
}

export {
    Fl32_Leana_Realm_Desk_Widget_Booking_Api_Entry as Entry,
    Fl32_Leana_Realm_Desk_Widget_Booking_Api_Task as Task,
};
