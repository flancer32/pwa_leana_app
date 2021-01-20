/**
 * Save one field of user profile ("/user/profile/saveField").
 */
export default class Fl32_Leana_Back_Service_User_Profile_SaveField {

    constructor(spec) {
        /** @type {Fl32_Leana_Defaults} */
        const DEF = spec['Fl32_Leana_Defaults$']; // singleton instance
        /** @type {Fl32_Teq_User_Defaults} */
        const DEF_USER = spec['Fl32_Teq_User_Defaults$'];  // singleton instance
        /** @type {TeqFw_Core_App_Db_Connector} */
        const rdb = spec['TeqFw_Core_App_Db_Connector$'];  // singleton instance
        /** @type {Fl32_Teq_User_App_Cache_Session} */
        const cacheUser = spec['Fl32_Teq_User_App_Cache_Session$']; // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Email} */
        const eIdEmail = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Email$'];  // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Id_Phone} */
        const eIdPhone = spec['Fl32_Teq_User_Store_RDb_Schema_Id_Phone$'];  // singleton instance
        /** @type {Fl32_Teq_User_Store_RDb_Schema_Profile} */
        const eUserProfile = spec['Fl32_Teq_User_Store_RDb_Schema_Profile$'];   // singleton instance
        /** @type {typeof Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Request} */
        const Request = spec['Fl32_Leana_Shared_Service_Route_User_Profile_SaveField#Request'];  // class constructor
        /** @type {typeof Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Response} */
        const Response = spec['Fl32_Leana_Shared_Service_Route_User_Profile_SaveField#Response'];  // class constructor
        /** @type {typeof Fl32_Teq_Acl_Shared_Service_Data_UserAcl} */
        const DUser = spec['Fl32_Teq_Acl_Shared_Service_Data_UserAcl#'];  // class constructor

        // DEFINE THIS INSTANCE METHODS (NOT IN PROTOTYPE)

        /**
         * Get backend route to service inside module or application namespace.
         *  - 'path/to/service': application route (w/o module) starts w/o slash;
         *  - '/path/to/service': module route starts with slash;
         * @return {string}
         */
        this.getRoute = function () {
            return DEF.API_ROUTE_USER_PROFILE_SAVE_FIELD;
        };

        /**
         * Factory to create function to validate and to structure incoming data.
         * @return {Function}
         */
        this.createParser = function () {
            /**
             * @param {IncomingMessage} httpReq
             * @return {Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Request}
             * @exports Fl32_Leana_Back_Service_User_Profile_SaveField$parse
             */
            function Fl32_Leana_Back_Service_User_Profile_SaveField$parse(httpReq) {
                const body = httpReq.body;
                // clone HTTP body into API request object
                const result = Object.assign(new Request(), body.data);
                if (result.date) result.date = new Date(result.date);
                return result;
            }

            return Fl32_Leana_Back_Service_User_Profile_SaveField$parse;
        };

        /**
         * Factory to create function to perform requested operation.
         * @return {Function}
         */
        this.createProcessor = function () {
            /**
             * @param {Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Request} apiReq
             * @param {IncomingMessage} httpReq
             * @return {Promise<Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Response>}
             * @exports Fl32_Leana_Back_Service_User_Profile_SaveField$process
             */
            async function Fl32_Leana_Back_Service_User_Profile_SaveField$process(apiReq, httpReq) {
                // DEFINE INNER FUNCTIONS
                async function saveEmail(trx, userId, value) {
                    // DEFINE INNER FUNCTIONS

                    async function exists(trx, userId) {
                        const query = trx.from(eIdEmail.ENTITY);
                        query.select([eIdEmail.A_USER_REF]);
                        query.where(eIdEmail.A_USER_REF, userId);
                        const rs = await query;
                        return (rs.length === 1);
                    }

                    async function insert(trx, userId, value) {
                        const query = await trx(eIdEmail.ENTITY)
                            .insert({
                                [eIdEmail.A_USER_REF]: userId,
                                [eIdEmail.A_EMAIL]: value,
                            });
                        const inserted = await query;
                        return Array.isArray(inserted) && (inserted.lenght === 1);
                    }

                    async function update(trx, userId, value) {
                        const query = trx(eIdEmail.ENTITY)
                            .update({
                                [eIdEmail.A_EMAIL]: value,
                            })
                            .where({[eIdEmail.A_USER_REF]: userId});
                        const updated = await query;
                        return (updated === 1);
                    }

                    // MAIN FUNCTIONALITY
                    let result = false;
                    const found = await exists(trx, userId);
                    if (found) {
                        result = await update(trx, userId, value);
                    } else {
                        result = await insert(trx, userId, value);
                    }
                    return result;
                }

                async function savePhone(trx, userId, value) {
                    // DEFINE INNER FUNCTIONS

                    async function exists(trx, userId) {
                        const query = trx.from(eIdPhone.ENTITY);
                        query.select([eIdPhone.A_USER_REF]);
                        query.where(eIdPhone.A_USER_REF, userId);
                        const rs = await query;
                        return (rs.length === 1);
                    }

                    async function insert(trx, userId, value) {
                        const query = await trx(eIdPhone.ENTITY)
                            .insert({
                                [eIdPhone.A_USER_REF]: userId,
                                [eIdPhone.A_PHONE]: value,
                            });
                        const inserted = await query;
                        return Array.isArray(inserted) && (inserted.lenght === 1);
                    }

                    async function update(trx, userId, value) {
                        const query = trx(eIdPhone.ENTITY)
                            .update({
                                [eIdPhone.A_PHONE]: value,
                            })
                            .where({[eIdPhone.A_USER_REF]: userId});
                        const updated = await query;
                        return (updated === 1);
                    }

                    // MAIN FUNCTIONALITY
                    let result = false;
                    const found = await exists(trx, userId);
                    if (found) {
                        result = await update(trx, userId, value);
                    } else {
                        result = await insert(trx, userId, value);
                    }
                    return result;
                }

                async function saveName(trx, userId, value) {
                    const query = trx(eUserProfile.ENTITY)
                        .update({
                            [eUserProfile.A_NAME]: value,
                        })
                        .where({[eUserProfile.A_USER_REF]: userId});
                    const updated = await query;
                    return (updated === 1);
                }

                // MAIN FUNCTIONALITY
                /** @type {Fl32_Leana_Shared_Service_Route_User_Profile_SaveField_Response} */
                const result = new Response();
                const trx = await rdb.startTransaction();
                try {
                    /** @type {Fl32_Teq_Acl_Shared_Service_Data_UserAcl} */
                    const user = httpReq[DEF_USER.HTTP_REQ_USER];
                    const userId = (user && (user instanceof DUser)) ? user.id : null;
                    if (userId && apiReq.value) {
                        const value = apiReq.value.trim();
                        if (apiReq.type === Request.TYPE_NAME) {
                            result.success = await saveName(trx, userId, value);
                        } else if (apiReq.type === Request.TYPE_EMAIL) {
                            result.success = await saveEmail(trx, userId, value);
                        } else if (apiReq.type === Request.TYPE_PHONE) {
                            result.success = await savePhone(trx, userId, value);
                        }
                        if (result.success) {
                            // clean up cached profile
                            const sessId = httpReq[DEF_USER.HTTP_REQ_SESSION_ID];
                            cacheUser.delete(sessId);
                        }
                    }
                    await trx.commit();
                } catch (error) {
                    await trx.rollback();
                    throw error;
                }
                return result;
            }

            // We should place function separately to allow JSDoc & IDEA hints & navigation.
            return Fl32_Leana_Back_Service_User_Profile_SaveField$process;
        };
    }
}
