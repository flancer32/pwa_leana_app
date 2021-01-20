const app = self.teqfw.app;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;
const router = self.teqfw.router;

const template = `
<div>
    <div id='app'>
        <div id='layer_base'>
            <main>
                <router-view :key="langChange"></router-view>
            </main>
        </div>
        <div id="layer_nav_bar">
            <navigator :key="langChange"></navigator>
        </div>
        <div id="layer_overlay"></div>
        <div id="layer_notification"></div>
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_App(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    const navigator = spec['Fl32_Leana_Front_Pub_Layout_Navigator$']; // singleton component
    const routeAbout = spec['Fl32_Leana_Front_Pub_Route_About$'];   // singleton component
    const routeBook = spec['Fl32_Leana_Front_Pub_Route_Book$']; // singleton component
    const routeContacts = spec['Fl32_Leana_Front_Pub_Route_Contacts$']; // singleton component
    const routeHistory = spec['Fl32_Leana_Front_Pub_Route_History$'];   // singleton component
    const routeServices = spec['Fl32_Leana_Front_Pub_Route_Services$']; // singleton component
    const routeSignIn = spec['Fl32_Leana_Front_Pub_Route_SignIn$']; // singleton component
    const routeSignOut = spec['Fl32_Leana_Front_Pub_Route_SignOut$'];   // singleton component
    const routeSignUp = spec['Fl32_Leana_Front_Pub_Route_SignUp$']; // singleton component

    // add frontend routes and bound components
    router.addRoute({path: '/', component: routeAbout});
    router.addRoute({path: '/about', component: routeAbout});
    router.addRoute({path: '/book', component: routeBook});
    router.addRoute({path: '/contacts', component: routeContacts});
    router.addRoute({path: '/history', component: routeHistory});
    router.addRoute({path: '/services', component: routeServices});
    router.addRoute({path: '/signIn', component: routeSignIn});
    router.addRoute({path: '/signOut', component: routeSignOut});
    router.addRoute({path: '/signUp/:refCode?', component: routeSignUp, props: true});

    // mount router here to enable routing on the first load of the page
    app.use(router);

    return {
        name: 'PubApp',
        template,
        components: {navigator},
        data: function () {
            return {
                langChange: 0,
            };
        },
        computed: {
            ...mapState({
                stateAppLang: state => state.app.lang,
            }),
        },
        methods: {
            ...mapMutations({
                setUserAuthenticated: 'user/setAuthenticated'
            }),
        },
        watch: {
            stateAppLang() {
                this.langChange++;
            }
        },
        mounted() {
            const user = session.getUser();
            this.setUserAuthenticated(user);
        }
    };
}
