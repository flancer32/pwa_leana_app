/**
 * Wrap original service to register new user ("/user/signUp") and add ACL binding for new user.
 */
export default class Fl32_Leana_Back_Service_User_SignUp {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Teq_User_Back_Service_SignUp} */
        const srvUserSignUp = spec['Fl32_Teq_User_Back_Service_SignUp$'];   // singleton instance
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Role} */
        const eRole = spec['Fl32_Teq_Acl_Store_RDb_Schema_Role$'];  // singleton instance
        /** @type {Fl32_Teq_Acl_Store_RDb_Schema_Role_User} */
        const eRoleUser = spec['Fl32_Teq_Acl_Store_RDb_Schema_Role_User$']; // singleton instance
        /** @type {typeof TeqFw_Core_App_Front_Gate_Response_Error} */
        const GateError = spec['TeqFw_Core_App_Front_Gate_Response_Error#'];    // class constructor
        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = srvUserSignUp.getRoute;

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = srvUserSignUp.createParser;

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            const fnOrig = srvUserSignUp.createProcessor();
            const Fl32_Leana_Back_Service_User_SignUp$process = async function (apiReq) {
                // DEFINE INNER FUNCTIONS
                async function selectRoleId(trx, code) {
                    const query = trx.from(eRole.ENTITY);
                    query.select([eRole.A_ID]);
                    query.where(eRole.A_CODE, code);
                    const [first] = await query;
                    return first[eRole.A_ID];
                }

                async function insertLink(trx, userId, roleId) {
                    await trx(eRoleUser.ENTITY)
                        .insert({
                            [eRoleUser.A_USER_REF]: userId,
                            [eRoleUser.A_ROLE_REF]: roleId,
                        });
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Teq_User_Shared_Service_Route_SignUp_Response} */
                const result = await fnOrig(apiReq);
                if (!(result instanceof GateError)) {
                    const trx = await rdb.startTransaction();
                    try {
                        const userId = result.user.id;
                        const roleId = await selectRoleId(trx, DEF.ACL_ROLE_CUSTOMER);
                        await insertLink(trx, userId, roleId);
                        await trx.commit();
                    } catch (error) {
                        await trx.rollback();
                        throw error;
                    }
                }
                return result;
            };
            return Fl32_Leana_Back_Service_User_SignUp$process;
        };
    }
}
