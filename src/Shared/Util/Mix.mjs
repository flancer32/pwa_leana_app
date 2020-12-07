/**
 * Mix of unclassified Shared functions.
 */
export default class Fl32_Leana_Shared_Util_Mix {
    /**
     * Lookup option in 'options' array where option[key] is integer and equals to 'id'.
     * Used in HTML selects.
     *
     * @param {Array} options
     * @param {string|number} id
     * @param {string} idKey
     * @return {*}
     */
    getOptionById(options, id, idKey = 'id') {
        const value = Number.parseInt(id);
        return options.find(function (o) {
            return Number.parseInt(o[idKey]) === value;
        });
    }

    /**
     * Lookup option in 'options' array then return option property with 'propKey' name.
     * @param {Array} options
     * @param {string|number} id
     * @param {string} propKey
     * @param {string} idKey
     * @return {*}
     */
    getOptionPropById(options, id, propKey, idKey = 'id') {
        let result = null;
        const found = this.getOptionById(options, id, idKey);
        if (found && found[propKey]) {
            result = found[propKey];
        }
        return result;
    }
}
