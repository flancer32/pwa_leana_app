const app = self.teqfw.app;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;
const router = self.teqfw.router;

const template = `
<div class="app">
    <component :is="activeLayout"></component>
</div>
`;

function Fl32_Leana_Front_Desk_App(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Front_Desk_State} */
    const state = spec['Fl32_Leana_Front_Desk_State$']; // singleton object
    /** @type {Fl32_Leana_Front_Desk_Layout_Main} */
    const layoutMain = spec['Fl32_Leana_Front_Desk_Layout_Main$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Layout_Centered} */
    const layoutCentered = spec['Fl32_Leana_Front_Desk_Layout_Centered$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Layout_Overlay} */
    const layoutOverlay = spec['Fl32_Leana_Front_Desk_Layout_Overlay$'];    // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Calendar} */
    const routeCalendar = spec['Fl32_Leana_Front_Desk_Route_Calendar$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Clients} */
    const routeClients = spec['Fl32_Leana_Front_Desk_Route_Clients$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Dev} */
    const routeDev = spec['Fl32_Leana_Front_Desk_Route_Dev$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Employees} */
    const routeEmployees = spec['Fl32_Leana_Front_Desk_Route_Employees$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Services} */
    const routeServices = spec['Fl32_Leana_Front_Desk_Route_Services$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_User_SignIn} */
    const routeUserSignIn = spec['Fl32_Leana_Front_Desk_Route_User_SignIn$'];  // singleton component
    /** @type {Fl32_Leana_Front_Desk_Widget_Task_Preview} */
    const widgetTaskPreview = spec['Fl32_Leana_Front_Desk_Widget_Task_Preview$'];  // singleton component


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
    app.component('layoutMain', layoutMain);
    app.component('layoutCentered', layoutCentered);
    app.component('taskPreview', widgetTaskPreview);

    return {
        name: 'DeskApp',
        template,
        computed: {
            /**
             * Calculate name for active layout widget (main or centered).
             *
             * @return {string}
             */
            activeLayout() {
                let isAuthenticated = false;
                if (this.stateUserAuthenticated) {
                    isAuthenticated = session.hasPermission(DEF.ACL_IS_EMPLOYEE);
                }
                return isAuthenticated ? 'layoutMain' : 'layoutCentered';
            },
            ...mapState({
                stateUserAuthenticated: state => state.user.authenticated,
            })
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

export default Fl32_Leana_Front_Desk_App;
