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
    /** @type {Fl32_Leana_Front_Desk_Layout_Main} */
    const layoutMain = spec['Fl32_Leana_Front_Desk_Layout_Main$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Layout_Centered} */
    const layoutCentered = spec['Fl32_Leana_Front_Desk_Layout_Centered$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Layout_Overlay} */
    const layoutOverlay = spec['Fl32_Leana_Front_Desk_Layout_Overlay$'];    // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Calendar} */
    const routeCalendar = spec['Fl32_Leana_Front_Desk_Route_Calendar$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Dev} */
    const routeDev = spec['Fl32_Leana_Front_Desk_Route_Dev$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Employees} */
    const routeEmployees = spec['Fl32_Leana_Front_Desk_Route_Employees$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Profile} */
    const routeProfile = spec['Fl32_Leana_Front_Desk_Route_Profile$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Services} */
    const routeServices = spec['Fl32_Leana_Front_Desk_Route_Services$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Settings} */
    const routeSettings = spec['Fl32_Leana_Front_Desk_Route_Settings$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_WorkTime} */
    const routeWorkTime = spec['Fl32_Leana_Front_Desk_Route_WorkTime$'];   // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_Users} */
    const routeUsers = spec['Fl32_Leana_Front_Desk_Route_Users$']; // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_User_SignIn} */
    const routeUserSignIn = spec['Fl32_Leana_Front_Desk_Route_User_SignIn$'];  // singleton component
    /** @type {Fl32_Leana_Front_Desk_Route_User_SignOut} */
    const routeUserSignOut = spec['Fl32_Leana_Front_Desk_Route_User_SignOut$'];  // singleton component
    /** @type {Fl32_Leana_Front_Desk_Widget_Task_Preview} */
    const widgetTaskPreview = spec['Fl32_Leana_Front_Desk_Widget_Task_Preview$'];  // singleton component

    // add frontend routes and bound components
    router.addRoute({path: '/', component: routeCalendar});
    router.addRoute({path: '/calendar', component: routeCalendar});
    router.addRoute({path: '/dev', component: routeDev});
    router.addRoute({path: '/employees', component: routeEmployees});
    router.addRoute({path: '/profile', component: routeProfile});
    router.addRoute({path: '/services', component: routeServices});
    router.addRoute({path: '/settings', component: routeSettings});
    router.addRoute({path: '/workTime', component: routeWorkTime});
    router.addRoute({path: '/user/signIn', component: routeUserSignIn});
    router.addRoute({path: '/user/signOut', component: routeUserSignOut});
    router.addRoute({path: '/users', component: routeUsers});

    // mount router here to enable routing on the first load of the page
    app.use(router);

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
