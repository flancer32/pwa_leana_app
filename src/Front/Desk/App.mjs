const app = self.teqfw.app;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const router = self.teqfw.router;

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

export default function Fl32_Leana_Front_Desk_App(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    const layoutOverlay = spec.Fl32_Leana_Front_Desk_Layout_Overlay$;
    const layoutStatusBar = spec.Fl32_Leana_Front_Desk_Layout_StatusBar$;
    const routeCalendar = spec.Fl32_Leana_Front_Desk_Route_Calendar$;
    const routeClients = spec.Fl32_Leana_Front_Desk_Route_Clients$;
    const routeDev = spec.Fl32_Leana_Front_Desk_Route_Dev$;
    const routeEmployees = spec.Fl32_Leana_Front_Desk_Route_Employees$;
    const routeServices = spec.Fl32_Leana_Front_Desk_Route_Services$;
    const routeUserSignIn = spec.Fl32_Leana_Front_Desk_Route_User_SignIn$;
    const widgetTaskPreview = spec.Fl32_Leana_Front_Desk_Widget_Task_Preview$;
    const state = spec.Fl32_Leana_Front_Desk_State$;

    // add frontend routes and bound components
    router.addRoute({path: '/', component: routeCalendar});
    router.addRoute({path: '/calendar', component: routeCalendar});
    router.addRoute({path: '/clients', component: routeClients});
    router.addRoute({path: '/dev', component: routeDev});
    router.addRoute({path: '/employees', component: routeEmployees});
    router.addRoute({path: '/services', component: routeServices});
    router.addRoute({path: '/user/signIn', component: routeUserSignIn});

    // mount router here to enable routing on the first load of the page
    app.use(router);

    // setup Vuex store and place it into DI container.
    const store = self.Vuex.createStore(state);
    app.use(store);

    // add globally used components (accessible from other components)
    app.component('appOverlay', layoutOverlay);
    app.component('taskPreview', widgetTaskPreview);

    return {
        name: 'DeskApp',
        template,
        components: {   // locally used components
            appStatusBar: layoutStatusBar,
        },
        methods: {
            ...mapMutations({
                setUserAuthenticated: 'user/setAuthenticated'
            }),
        },
        mounted() {
            const user = session.getUser();
            this.setUserAuthenticated(user);
        }
    };
}
