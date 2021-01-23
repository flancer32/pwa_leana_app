/**
 * Hardcoded configuration for this application (head module).
 */
export default class Fl32_Leana_Defaults {
    ACL_IS_CUSTOMER = 'is_customer';
    ACL_IS_DEVELOPER = 'is_developer';
    ACL_IS_EMPLOYEE = 'is_employee';
    ACL_ROLE_CUSTOMER = 'customer';
    ACL_ROLE_EMPLOYEE = 'employee';
    API_ROUTE_EMPL_LIST = 'employee/list';
    API_ROUTE_EMPL_PROFILE_SAVE = 'employee/profile/save';
    API_ROUTE_EMPL_WTIME_GENERATE = 'employee/workTime/generate';
    API_ROUTE_EMPL_WTIME_LIST = 'employee/workTime/list';
    API_ROUTE_EMPL_WTIME_SAVE = 'employee/workTime/save';
    API_ROUTE_SRV_LIST = 'service/list';
    API_ROUTE_TASK_CANCEL = 'task/cancel';
    API_ROUTE_TASK_LIST_OWN = 'task/list/own';
    API_ROUTE_TASK_ONDATE = 'task/onDate';
    API_ROUTE_TASK_SAVE = 'task/save';
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
    SW_ROUTE_CACHE_CLEAN = 'cache/clean';
    SW_ROUTE_CACHE_DISABLE = 'cache/disable';
    SW_ROUTE_CACHE_ENABLE = 'cache/enable';
    SW_ROUTE_CACHE_STATE = 'cache/state';
    TIME_STEP_MINUTES = 15; // time pickers
    TIMEOUT_DEFFERED = 1000; // time out for deferred requests (on user input in a forms)
    USER_ID_LENA = 2;
    USER_ID_NATA = 3;

    constructor() {
        Object.freeze(this);
    }
}
