const app = self.teqfw.app;
const router = self.teqfw.router;
const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'app', {});
i18next.addResources('ru', 'app', {});

const template = `
<div>
    <div id="app">
        <div id="layer_base">
            <main>
                <router-view></router-view>
            </main>
        </div>
        <div id="layer_status_bar">
            <app-status-bar></app-status-bar>
        </div>
        <div id="layer_side_bar"></div>
        <app-overlay></app-overlay>
        <div id="layer_notification"></div>
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Desk_App(spec) {
    /** @type {Fl32_Leana_Realm_Desk_Layout_StatusBar} */
    const compLayoutOverlay = spec.Fl32_Leana_Realm_Desk_Layout_Overlay$;
    const compLayoutStatusBar = spec.Fl32_Leana_Realm_Desk_Layout_StatusBar$;
    const compRouteCalendar = spec.Fl32_Leana_Realm_Desk_Route_Calendar$;
    const compRouteClients = spec.Fl32_Leana_Realm_Desk_Route_Clients$;
    const compRouteDev = spec.Fl32_Leana_Realm_Desk_Route_Dev$;
    const compRouteEmployees = spec.Fl32_Leana_Realm_Desk_Route_Employees$;
    const compRouteServices = spec.Fl32_Leana_Realm_Desk_Route_Services$;
    const compWidgetTaskPreview = spec.Fl32_Leana_Realm_Desk_Widget_Task_Preview$;
    const state = spec.Fl32_Leana_Realm_Desk_State$;
    // const stateCalendar = spec.Fl32_Leana_Realm_Desk_App_State_Calendar$;

    // router.addRoute({path: '/', component: routeAbout});
    router.addRoute({path: '/calendar', component: compRouteCalendar});
    router.addRoute({path: '/clients', component: compRouteClients});
    router.addRoute({path: '/dev', component: compRouteDev});
    router.addRoute({path: '/employees', component: compRouteEmployees});
    router.addRoute({path: '/services', component: compRouteServices});

    // mount router here to enable routing on the first load of the page
    app.use(router);

    // setup Vuex store
    const store = self.Vuex.createStore(state);
    app.use(store);

    // add globally used components (accessible from other components)
    app.component('appOverlay', compLayoutOverlay);
    app.component('taskPreview', compWidgetTaskPreview);

    return {
        template,
        components: {   // locally used components
            appStatusBar: compLayoutStatusBar,
        },
        created() {
        }
    };
}
