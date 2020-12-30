const app = self.teqfw.app;
const router = self.teqfw.router;
const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'app', {});
i18next.addResources('ru', 'app', {});

const template = `
<div>
    <div id='app'>
        <div id='layer_base'>
            <main>
                <router-view></router-view>
            </main>
        </div>
        <div id="layer_nav_bar">
            <app-nav-bar></app-nav-bar>
        </div>
        <div id="layer_overlay"></div>
        <div id="layer_notification"></div>
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_App(spec) {
    const appNavBar = spec.Fl32_Leana_Front_Pub_App_NavBar$;
    const routeAbout = spec.Fl32_Leana_Front_Pub_Route_About$;
    const routeBook = spec.Fl32_Leana_Front_Pub_Route_Book$;
    const routeContacts = spec.Fl32_Leana_Front_Pub_Route_Contacts$;
    const routeServices = spec.Fl32_Leana_Front_Pub_Route_Services$;
    const routeSignIn = spec.Fl32_Leana_Front_Pub_Route_SignIn$;
    const routeSignUp = spec.Fl32_Leana_Front_Pub_Route_SignUp$;
    const state = spec.Fl32_Leana_Front_Pub_State$;
    /** @type {typeof Fl32_Teq_Acl_Shared_Service_Route_User_Get_Request} */
    const AclGetRequest = spec['Fl32_Teq_Acl_Shared_Service_Route_User_Get#Request'];


    router.addRoute({path: '/', component: routeAbout});
    router.addRoute({path: '/about', component: routeAbout});
    router.addRoute({path: '/book', component: routeBook});
    router.addRoute({path: '/contacts', component: routeContacts});
    router.addRoute({path: '/services', component: routeServices});
    router.addRoute({path: '/signIn', component: routeSignIn});
    router.addRoute({path: '/signUp', component: routeSignUp});

    // mount router here to enable routing on the first load of the page
    app.use(router);

    // setup Vuex store
    const store = self.Vuex.createStore(state);
    app.use(store);

    return {
        template,
        components: {
            'AppNavBar': appNavBar
        },
        computed: {
            ...mapState({
                userAcl: state => state.acl.userAcl,
            }),
        },
        methods: {
            ...mapActions({
                loadUserAcl: 'acl/loadUserAcl',
            }),
        },
        mounted() {
            // get permissions from server
            const req = new AclGetRequest();
            this.loadUserAcl(req)
                .catch((e) => {
                    console.error('Cannot get user ACL: ' + e.toString());
                });
        }
    };
}
