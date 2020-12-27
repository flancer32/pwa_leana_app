/**
 * Convert Service API data structures to Widgets UI data structures.
 */
export default class Fl32_Leana_Front_Desk_Util_Convert_Api2Ui {
    ApiTask
    UiCustomer
    UiEmployee
    UiService
    UiTask
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    utilDate

    /**
     * @param (TeqFw_Di_SpecProxy) spec
     */
    constructor(spec) {
        this.ApiTask = spec['Fl32_Leana_Shared_Api_Data_Task#'];
        this.UiCustomer = spec['Fl32_Leana_Front_Desk_Widget_Api_Customer#'];
        this.UiEmployee = spec['Fl32_Leana_Front_Desk_Widget_Api_Employee#'];
        this.UiService = spec['Fl32_Leana_Front_Desk_Widget_Api_Service#'];
        this.UiTask = spec['Fl32_Leana_Front_Desk_Widget_Api_Task#'];
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        this.utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
        Object.freeze(this);
    }

    /**
     *
     * @param {Fl32_Leana_Shared_Api_Data_Task} apiTask
     * @param {Object.<Number, Fl32_Leana_Shared_Api_Data_Employee>} apiEmployees
     * @param {Object.<Number, Fl32_Leana_Shared_Service_Data_Service>} apiServices
     * @return {Fl32_Leana_Front_Desk_Widget_Api_Task}
     */
    taskApi2Ui(apiTask, apiEmployees, apiServices) {
        /** @type {Fl32_Leana_Front_Desk_Widget_Api_Task} */
        const result = new this.UiTask;
        result.id = apiTask.id;
        result.dateBook = new Date(apiTask.dateBook);
        result.dateCreated = new Date(apiTask.dateCreated);
        result.duration = apiTask.duration;
        result.locale = apiTask.locale;
        result.madeOnFront = apiTask.madeOnFront;
        result.note = apiTask.note;
        /** @type {Fl32_Leana_Front_Desk_Widget_Api_Customer} */
        const customer = new this.UiCustomer();
        customer.name = apiTask.customerName;
        customer.email = apiTask.customerEmail;
        customer.phone = apiTask.customerPhone;
        result.customer = customer;
        if (apiServices && apiServices[apiTask.serviceRef]) {
            /** @type {Fl32_Leana_Shared_Service_Data_Service} */
            const serviceApi = apiServices[apiTask.serviceRef];
            /** @type {Fl32_Leana_Front_Desk_Widget_Api_Service} */
            const service = new this.UiService();
            service.code = serviceApi.code;
            service.duration = serviceApi.duration;
            service.id = serviceApi.id;
            service.name = serviceApi.name;
            service.isPublic = serviceApi.public;
            result.service = service;
        }
        if (apiEmployees && apiEmployees[apiTask.employeeRef]) {
            /** @type {Fl32_Leana_Shared_Api_Data_Employee} */
            const employeeApi = apiEmployees[apiTask.employeeRef];
            /** @type {Fl32_Leana_Front_Desk_Widget_Api_Employee} */
            const employee = new this.UiEmployee();
            employee.id = employeeApi.id;
            employee.code = employeeApi.code;
            employee.name = employeeApi.name;
            result.employee = employee;
        }
        return result;
    }

}
