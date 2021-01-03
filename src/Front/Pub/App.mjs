const app = self.teqfw.app;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const router = self.teqfw.router;

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
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    const appNavBar = spec.Fl32_Leana_Front_Pub_App_NavBar$;
    const routeAbout = spec.Fl32_Leana_Front_Pub_Route_About$;
    const routeBook = spec.Fl32_Leana_Front_Pub_Route_Book$;
    const routeContacts = spec.Fl32_Leana_Front_Pub_Route_Contacts$;
    const routeServices = spec.Fl32_Leana_Front_Pub_Route_Services$;
    const routeSignIn = spec.Fl32_Leana_Front_Pub_Route_SignIn$;
    const routeSignOut = spec.Fl32_Leana_Front_Pub_Route_SignOut$;
    const routeSignUp = spec.Fl32_Leana_Front_Pub_Route_SignUp$;
    const state = spec.Fl32_Leana_Front_Pub_State$;

    // add frontend routes and bound components
    router.addRoute({path: '/', component: routeAbout});
    router.addRoute({path: '/about', component: routeAbout});
    router.addRoute({path: '/book', component: routeBook});
    router.addRoute({path: '/contacts', component: routeContacts});
    router.addRoute({path: '/services', component: routeServices});
    router.addRoute({path: '/signIn', component: routeSignIn});
    router.addRoute({path: '/signOut', component: routeSignOut});
    router.addRoute({path: '/signUp', component: routeSignUp});

    // mount router here to enable routing on the first load of the page
    app.use(router);

    // setup Vuex store
    const store = self.Vuex.createStore(state);
    app.use(store);

    return {
        name: 'PubApp',
        template,
        components: {
            appNavBar
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
