/**
 * Task data.
 */
export default class Fl32_Leana_Shared_Service_Data_Task {
    static A_CUSTOMER_EMAIL = 'customerEmail';
    static A_CUSTOMER_NAME = 'customerName';
    static A_CUSTOMER_PHONE = 'customerPhone';
    static A_DATE_BOOK = 'dateBook';
    static A_DATE_CREATED = 'dateCreated';
    static A_DURATION = 'duration';
    static A_EMPLOYEE_REF = 'employeeRef';
    static A_ID = 'id';
    static A_LOCALE = 'locale';
    static A_MADE_ON_FRONT = 'madeOnFront';
    static A_NOTE = 'note';
    static A_SERVICE_REF = 'serviceRef';
    static A_USER_REF = 'userRef';

    /**
     *  @type {String}
     */
    customerEmail;
    /**
     *  @type {String}
     */
    customerName;
    /**
     *  @type {String}
     */
    customerPhone;
    /**
     * UTC date for task beginning.
     *  @type {Date}
     */
    dateBook;
    /**
     * UTC date when task was created.
     *  @type {Date}
     */
    dateCreated;
    /**
     * Task duration in minutes.
     *  @type {Number}
     */
    duration;
    /**
     *  @type {Number}
     */
    employeeRef;
    /**
     * Internal id.
     *
     * @type {Number}
     */
    id;
    /**
     *  @type {String}
     */
    locale;
    /**
     * 'true' if task is scheduled from the front by customer.
     *  @type {Boolean}
     */
    madeOnFront;
    /**
     *  @type {String}
     */
    note;
    /**
     *  @type {Number}
     */
    serviceRef;
    /**
     *  @type {Number}
     */
    userRef;

}
