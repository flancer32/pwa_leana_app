/**
 * Data structures for 'Work Time' related widgets.
 */

class Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item {
    /** @type {Boolean} */
    current;
    /** @type {Number} day of the month (1,2, ..., 31) */
    date;
    /** @type {Boolean} */
    disabled;
    /** @type {String} */
    employeeCode;
    /** @type {Number} */
    employeeId;
    /** @type {Date} */
    timeFrom;
    /** @type {Date} */
    timeTo;
    /** @type {Boolean} 'true' if cell contains data for the date, 'false' - contains week index */
    typeIsDate;
}

export {
    Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item as Item,
};
