const router = self.teqfw.router;
const i18next = self.teqfw.i18next;
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
        <div id="layer_overlay">
<!--            <app_display_image></app_display_image>-->
        </div>
        <div id="layer_notification">
<!--            <app_notification></app_notification>-->
        </div>
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Pub_App(spec) {
    const appNavBar = spec.Fl32_Leana_Realm_Pub_App_NavBar$;
    const routeAbout = spec.Fl32_Leana_Realm_Pub_Route_About$;
    const routeBook = spec.Fl32_Leana_Realm_Pub_Route_Book$;
    const routeContacts = spec.Fl32_Leana_Realm_Pub_Route_Contacts$;
    const routeServices = spec.Fl32_Leana_Realm_Pub_Route_Services$;

    router.addRoute({path: '/', component: routeAbout});
    router.addRoute({path: '/about', component: routeAbout});
    router.addRoute({path: '/book', component: routeBook});
    router.addRoute({path: '/contacts', component: routeContacts});
    router.addRoute({path: '/services', component: routeServices});

    // mount router here to enable routing on the first load of the page
    self.teqfw.app.use(router);

    return {
        template,
        components: {
            'AppNavBar': appNavBar
        }
    };
}
