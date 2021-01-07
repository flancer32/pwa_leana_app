/**
 * Class to generate options for selectors.
 */
class Fl32_Leana_Front_Desk_Util_Options {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
        /** @type {Fl32_Leana_Shared_Util_DateTime} */
        const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$']; // singleton instance

        /**
         * Generate values for task duration.
         * @return {Array.<Object.<Number, String>>} sample: [{10: '0:10'}]
         */
        this.getDurationValues = function () {
            const result = [];
            for (let i = DEF.TIME_STEP_MINUTES; i <= 240; i += DEF.TIME_STEP_MINUTES) {
                result.push({id: i, value: utilDate.convertMinsToHrsMins(i)});
            }
            return result;
        };
    }


}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Util_Options;
