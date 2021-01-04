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
    /** @type {TeqFw_Di_Container} */
    _container
    /** @type {TeqFw_Core_App_Config} */
    _config
    /** @type {TeqFw_Core_App_Logger} */
    _logger
    /** @type {Fl32_Teq_Acl_App_Server_Permissions} */
    _mwAcl
    /** @type {TeqFw_Core_App_Server_Log} */
    _mwLog
    /** @type {Fl32_Teq_User_App_Server_Session} */
    _mwSession
    /** @type {Fl32_Leana_Server_Route_Static} */
    _routeStatic
    /** @type {TeqFw_Core_App_Server_HandlerFactory} */
    _handlerFactory

    _server = $express();


    constructor(spec) {
        this._config = spec.TeqFw_Core_App_Config$;
        this._container = spec.TeqFw_Di_Container$;
        this._handlerFactory = spec.TeqFw_Core_App_Server_HandlerFactory$;
        this._logger = spec.TeqFw_Core_App_Logger$;
        this._mwAcl = spec.Fl32_Teq_Acl_App_Server_Permissions$;
        this._mwLog = spec.TeqFw_Core_App_Server_Log$;
        this._mwSession = spec.Fl32_Teq_User_App_Server_Session$;
        this._routeStatic = spec.Fl32_Leana_Server_Route_Static$;
    }

    async addApiRoute(route, dependencyId) {
        const handler = await this._container.get(dependencyId);
        this._server.all(route, handler.handle);
    }

    async init() {
        const me = this;
        // setup order is important
        this._server.use($cookieParser());
        this._server.use($express.json({limit: '50mb'}));
        this._server.use(me._mwLog.handle);
        this._server.use(me._mwSession.handle);
        this._server.use(me._mwAcl.handle);
        // API routes
        await this.addApiRoute('/api/app/config/get', 'Fl32_Leana_Back_Service_App_Config_Get$');
        await this.addApiRoute('/api/app/sw/files_to_cache/desk', 'Fl32_Leana_Back_Service_App_Sw_FilesToCache_Desk$');
        await this.addApiRoute('/api/app/sw/files_to_cache/pub', 'Fl32_Leana_Back_Service_App_Sw_FilesToCache_Pub$');
        // new style
        await this._handlerFactory.registerService(this._server, '', 'Fl32_Leana_Back_Service_Employee_List$');
        await this._handlerFactory.registerService(this._server, '', 'Fl32_Leana_Back_Service_Employee_TimeWork_List$');
        await this._handlerFactory.registerService(this._server, '', 'Fl32_Leana_Back_Service_Service_List$');
        await this._handlerFactory.registerService(this._server, '', 'Fl32_Leana_Back_Service_Task_OnDate$');
        await this._handlerFactory.registerService(this._server, '', 'Fl32_Leana_Back_Service_Task_Remove$');
        await this._handlerFactory.registerService(this._server, '', 'Fl32_Leana_Back_Service_Task_Save$');
        await this._handlerFactory.registerService(this._server, 'user', 'Fl32_Teq_User_Back_Service_Current$');
        await this._handlerFactory.registerService(this._server, 'user', 'Fl32_Teq_User_Back_Service_List$');
        await this._handlerFactory.registerService(this._server, 'user', 'Fl32_Teq_User_Back_Service_SignIn$');
        await this._handlerFactory.registerService(this._server, 'user', 'Fl32_Teq_User_Back_Service_SignOut$');
        await this._handlerFactory.registerService(this._server, 'user', 'Fl32_Teq_User_Back_Service_SignUp$');

        // static resources in project
        const pathRoot = this._config.get('path/root');
        const pathPub = $path.join(pathRoot, 'node_modules/@flancer32/pwa_leana_app/web');
        this._server.use($serveStatic(pathPub));
        // static resources in modules
        this._server.get('*', this._routeStatic.handle);
        // default route
        this._server.all('*', function (req, res) {
            me._logger.debug(`${req.method} ${req.url}`);
            // COMPOSE RESULT
            res.status(404);
            res.setHeader('Content-Type', 'text/plain');
            res.end(`The route '${req.url}' is not found on the server.`);
        });
    }

    /**
     * Run web server.
     *
     * @param {number} port
     * @param {Function} callable
     */
    async listen(port, callable) {
        await this._server.listen(port, callable);
    }

}
