/**
 * Shared functions to process date-time values (are used on front and back).
 */


// MODULE'S EXPORT
export default class Fl32_Leana_Shared_Util_DateTime {
    /**
     * Convert 'HHMM' or 'MM' to minutes.
     *
     * @param {string|number} hm 1000, 925 or 59
     * @returns {number} 600
     */
    convertDbHrsMinsToMins(hm) {
        let result = 0;
        const str = (typeof hm === 'string') ? hm : hm.toString();
        if (str.length === 4) {
            const h = str.substring(0, 2);
            const m = str.substring(2, 4);
            result = Number(h) * 60 + Number(m);
        } else if (str.length === 3) {
            const h = str.substring(0, 1);
            const m = str.substring(1, 3);
            result = Number(h) * 60 + Number(m);
        } else if (str.length <= 2) {
            result = Number(str);
        } else {
            throw new Error(`Illegal format for DB hours-minutes data (${hm}).`);
        }
        return result;
    }

    /**
     * Convert 'HH:MM' to minutes.
     *
     * @param {string} hm 10:00
     * @returns {number} 600
     */
    convertHrsMinsToMins(hm) {
        let result = 0;
        if (
            (typeof hm === 'string') &&
            (hm.includes(':'))
        ) {
            const [h, m] = hm.split(':');
            result = Number(h) * 60 + Number(m);
        } else if (hm) {
            result = Number(hm);
        }
        return result;
    }

    convertMinsToDbHrsMins(mins) {
        let h = 0;
        let m = 0;
        if (mins) {
            h = Math.floor(mins / 60);
            m = mins % 60;
        }
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        return `${h}${m}`;
    }

    /**
     *  Convert minutes to 'hours:minutes'.
     *
     * @param {Number} mins
     * @param {boolean} addLeadingZero to hours only
     * @returns {string}
     */
    convertMinsToHrsMins(mins, addLeadingZero = false) {
        let h = 0;
        let m = 0;
        if (mins) {
            h = Math.floor(mins / 60);
            m = mins % 60;
        }
        if (addLeadingZero) {
            h = h < 10 ? '0' + h : h;
        }
        m = m < 10 ? '0' + m : m;
        return `${h}:${m}`;
    }

    /**
     * Convert `dateIn` into 'YYYYMMDD'. `new Date()` is used if `dateIn` is null.
     *
     * @param {Date|string|null} dateIn
     * @returns {string}
     */
    formatDate(dateIn = null) {
        /** @type {Date} */
        const date = (dateIn) ?
            (dateIn instanceof Date) ? dateIn : new Date(dateIn) :
            new Date();
        const y = date.getFullYear();
        const m = `${date.getMonth() + 1}`.padStart(2, '0');
        const d = `${date.getDate()}`.padStart(2, '0');
        return `${y}${m}${d}`;
    }

    /**
     * Return `date` forwarded up to `days`.
     *
     * @param {number} days
     * @param {Date|null} date
     * @returns {Date}
     */
    forwardDate(days, date = null) {
        let result = (date) ? new Date(date.getTime()) : new Date();
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Thanks to https://stackoverflow.com/a/6117889/4073821:
     *
     * For a given date, get the ISO week number
     *
     * Based on information at:
     *
     *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
     *
     * Algorithm is to find nearest thursday, it's year
     * is the year of the week number. Then get weeks
     * between that date and the first day of that year.
     *
     * Note that dates in one year can be weeks of previous
     * or next year, overlap is up to 3 days.
     *
     * e.g. 2014/12/29 is Monday in week  1 of 2015
     *      2012/1/1   is Sunday in week 52 of 2011
     */
    getWeekNumber(d) {
        // Copy date so don't modify original
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        // Get first day of year
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        // Return array of year and week number
        return [d.getUTCFullYear(), weekNo];
    }

    /**
     * Get data to build month widget.
     *
     * @param month
     * @return {{week: number, dateLast: Date, year: number, dateFirst: Date}}
     */
    getMonthWidgetData(month) {
        let [year, week] = this.getWeekNumber(month);
        const dateFirst = new Date(month.getTime());
        const weekDayCurrent = month.getUTCDay();
        const diff = (weekDayCurrent > 0)
            ? ((weekDayCurrent === 1) ? 7 : weekDayCurrent - 1)  // (monday) : (other days)
            : 6;    // sunday
        dateFirst.setUTCDate(1 - diff); // to get date for monday
        const dateLast = new Date(dateFirst.getTime());
        dateLast.setUTCDate(dateFirst.getUTCDate() + 42);
        return {year, week, dateFirst, dateLast};
    }

    /**
     * Convert minutes to milliseconds.
     * @param {Number|String} minutes
     * @return {Number}
     */
    minutesToMilliseconds(minutes) {
        return Number.parseInt(minutes) * 60 * 1000;
    }

    /**
     * Convert `dateIn` into 'YYYYMMDD'.
     * `new Date()` is used if `dateIn` is null.
     *
     * @param {Date|string|null} dateIn
     * @returns {string}
     */
    stampDateUtc(dateIn = null) {
        /** @type {Date} */
        const date = (dateIn) ?
            (dateIn instanceof Date) ? dateIn : new Date(dateIn) :
            new Date();
        const y = date.getUTCFullYear();
        const m = `${date.getUTCMonth() + 1}`.padStart(2, '0');
        const d = `${date.getUTCDate()}`.padStart(2, '0');
        return `${y}${m}${d}`;
    }

    /**
     * Convert `dateIn` into 'HHMM' or 'HH:MM' (local time zone).
     * `new Date()` is used if `dateIn` is null.
     *
     * @param {Date|string|null} dateIn
     * @param {Boolean} addColon
     * @returns {string}
     */
    stampTime(dateIn = null, addColon = false) {
        /** @type {Date} */
        const date = (dateIn) ?
            (dateIn instanceof Date) ? dateIn : new Date(dateIn) :
            new Date();
        const h = `${date.getHours()}`.padStart(2, '0');
        const m = `${date.getMinutes()}`.padStart(2, '0');
        return (addColon) ? `${h}:${m}` : `${h}${m}`;
    }

    /**
     * Convert `dateIn` into 'HHMM' or 'HH:MM' (UTC time zone).
     * `new Date()` is used if `dateIn` is null.
     *
     * @param {Date|string|null} dateIn
     * @param {Boolean} addColon
     * @returns {string}
     */
    stampTimeUTC(dateIn = null, addColon = false) {
        /** @type {Date} */
        const date = (dateIn) ?
            (dateIn instanceof Date) ? dateIn : new Date(dateIn) :
            new Date();
        const h = `${date.getUTCHours()}`.padStart(2, '0');
        const m = `${date.getUTCMinutes()}`.padStart(2, '0');
        return (addColon) ? `${h}:${m}` : `${h}${m}`;
    }

    /**
     * Convert datestamp to UTC date.
     *
     * @param {string} formatted 'YYYYMMDD'
     * @param {string} time 'HHMM' | 'HH:MM'
     * @return {Date}
     */
    unformatDate(formatted, time = null) {
        const result = new Date();
        const y = Number.parseInt(formatted.substring(0, 4));
        const m = Number.parseInt(formatted.substring(4, 6));
        const d = Number.parseInt(formatted.substring(6, 8));
        result.setUTCFullYear(y, m - 1, d);

        let hour = 12;
        let min = 0;
        if (time && (time.length === 4)) {
            hour = Number.parseInt(time.substring(0, 2));
            min = Number.parseInt(time.substring(2, 4));
        }
        result.setUTCHours(hour, min, 0, 0);
        return result;
    }
}
