/**
 * Hardcoded configuration for this application (head module).
 */
export default class Fl32_Leana_Defaults {
    ACL_IS_CUSTOMER = 'is_customer';
    ACL_IS_DEVELOPER = 'is_developer';
    ACL_IS_EMPLOYEE = 'is_employee';
    API_ROUTE_USER_PROFILE_SAVE_FIELD = 'user/profile/saveField';
    DAY_END_HOUR_UTC = 18;  // end of the working day
    DAY_END_HOUR_UTC_SAT = 16;  // end of the working day for Saturday
    DAY_START_HOUR_UTC = 7; // start of the working day
    DI_CONFIG = 'config';  // DI key
    DI_SESSION = 'appSession';  // DI key
    DI_STORE = 'vuex';  // DI key
    E_TASK_STATE_ACTIVE = 'active'; // state for Task entity
    E_TASK_STATE_CANCELLED = 'cancelled';   // state for Task entity
    SCHEDULE_FORECAST_MONTHS = 3; // time pickers
    TIME_STEP_MINUTES = 15; // time pickers
    TIMEOUT_DEFFERED = 1000; // time out for deferred requests (on user input in a forms)
    USER_ID_LENA = 2;
    USER_ID_NATA = 3;

    constructor() {
        Object.freeze(this);
    }
}
