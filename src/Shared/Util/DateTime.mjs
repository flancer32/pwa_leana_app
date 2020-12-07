/**
 * Shared functions to process date-time values (are used on front and back).
 */


// MODULE'S EXPORT
export default class Fl32_Leana_Shared_Util_DateTime {
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
     *
     * @param {string} formatted 'YYYYMMDD'
     * @param {string} time 'HHMM' | 'HH:MM'
     */
    unformatDate(formatted, time = null) {
        const result = new Date();
        const y = formatted.substring(0, 4);
        const m = formatted.substring(4, 6);
        const d = formatted.substring(6, 8);
        let msec = Date.parse(`${y}/${m}/${d} 12:00:00`);
        if (time) {
            if (time.length === 4) {
                const hour = time.substring(0, 2);
                const min = time.substring(2, 4);
                msec = Date.parse(`${y}/${m}/${d} ${hour}:${min}:00`);
            } else {
                msec = Date.parse(`${y}/${m}/${d} ${time}`);
            }
        }
        result.setTime(msec);
        return result;
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
}
