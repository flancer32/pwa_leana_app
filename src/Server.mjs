/**
 * Application's web server.
 */
// NODE.JS IMPORTS
import $cookieParser from 'cookie-parser';
import $express from 'express';
import $path from 'path';
import $serveStatic from 'serve-static';

// MODULE'S EXPORT
export default class Fl32_Leana_Server {

    constructor(spec) {
        /** @type {TeqFw_Core_App_Config} */
        const config = spec['TeqFw_Core_App_Config$'];  // singleton instance
        /** @type {TeqFw_Di_Container} */
        const container = spec['TeqFw_Di_Container$'];  // singleton instance
        /** @type {TeqFw_Core_App_Server_HandlerFactory} */
        const handlerFactory = spec['TeqFw_Core_App_Server_HandlerFactory$'];   // singleton instance
        /** @type {TeqFw_Core_App_Logger} */
        const logger = spec['TeqFw_Core_App_Logger$'];  // singleton instance
        /** @type {Fl32_Teq_Acl_App_Server_Permissions} */
        const mwAcl = spec['Fl32_Teq_Acl_App_Server_Permissions$']; // singleton instance
        /** @type {TeqFw_Core_App_Server_Log} */
        const mwLog = spec['TeqFw_Core_App_Server_Log$'];   // singleton instance
        /** @type {Fl32_Teq_User_App_Server_Session} */
        const mwSession = spec['Fl32_Teq_User_App_Server_Session$'];    // singleton instance
        /** @type {Fl32_Leana_Server_Route_Static} */
        const routeStatic = spec['Fl32_Leana_Server_Route_Static$'];    // singleton instance

        const server = $express();

        this.addApiRoute = async function (route, dependencyId) {
            const handler = await container.get(dependencyId);
            server.all(route, handler.handle);
        };

        this.init = async function () {
            // setup order is important
            server.use($cookieParser());
            server.use($express.json({limit: '50mb'}));
            server.use(mwLog.handle);
            server.use(mwSession.handle);
            server.use(mwAcl.handle);
            // API routes
            await this.addApiRoute('/api/app/config/get', 'Fl32_Leana_Back_Service_App_Config_Get$');
            await this.addApiRoute('/api/app/sw/files_to_cache/desk', 'Fl32_Leana_Back_Service_App_Sw_FilesToCache_Desk$');
            await this.addApiRoute('/api/app/sw/files_to_cache/pub', 'Fl32_Leana_Back_Service_App_Sw_FilesToCache_Pub$');
            // new style
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Employee_List$');
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Employee_WorkTime_Generate$');
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Employee_WorkTime_List$');
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Service_List$');
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Task_Cancel$');
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Task_OnDate$');
            await handlerFactory.registerService(server, '', 'Fl32_Leana_Back_Service_Task_Save$');
            await handlerFactory.registerService(server, 'user', 'Fl32_Teq_User_Back_Service_Current$');
            await handlerFactory.registerService(server, 'user', 'Fl32_Teq_User_Back_Service_List$');
            await handlerFactory.registerService(server, 'user', 'Fl32_Teq_User_Back_Service_SignIn$');
            await handlerFactory.registerService(server, 'user', 'Fl32_Teq_User_Back_Service_SignOut$');
            await handlerFactory.registerService(server, 'user', 'Fl32_Teq_User_Back_Service_SignUp$');

            // static resources in project
            const pathRoot = config.get('path/root');
            const pathPub = $path.join(pathRoot, 'node_modules/@flancer32/pwa_leana_app/web');
            server.use($serveStatic(pathPub));
            // static resources in modules
            server.get('*', routeStatic.handle);
            // default route
            server.all('*', function (req, res) {
                logger.debug(`${req.method} ${req.url}`);
                // COMPOSE RESULT
                res.status(404);
                res.setHeader('Content-Type', 'text/plain');
                res.end(`The route '${req.url}' is not found on the server.`);
            });
        };


        /**
         * Run web server.
         *
         * @param {number} port
         * @param {Function} callable
         */
        this.listen = async function (port, callable) {
            await server.listen(port, callable);
        };
    }
}
