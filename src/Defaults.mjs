/**
 * Hardcoded configuration for this application (head module).
 */
export default class Fl32_Leana_Defaults {

    ACL_IS_CUSTOMER = 'is_customer';
    ACL_IS_DEVELOPER = 'is_developer';
    ACL_IS_EMPLOYEE = 'is_employee';
    DAY_END_HOUR_UTC = 18;  // end of the working day
    DAY_START_HOUR_UTC = 7; // start of the working day
    DI_SESSION = 'appSession';  // DI container
    E_TASK_STATE_ACTIVE = 'active'; // state for Task entity
    E_TASK_STATE_CANCELLED = 'cancelled';   // state for Task entity
    SCHEDULE_FORECAST_MONTHS = 3; // time pickers
    TIME_STEP_MINUTES = 15; // time pickers
    USER_ID_LENA = 2;
    USER_ID_NATA = 3;

    constructor() {
        Object.freeze(this);
    }
}
