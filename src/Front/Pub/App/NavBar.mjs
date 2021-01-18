const i18next = self.teqfw.i18next;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'navBar', {
    about: 'Par mums',
    book: 'Pierakstīties',
    contacts: 'Kontakti',
    history: 'Mani ieraksti',
    lv: 'LV',
    profile: 'Profils',
    ru: 'RU',
    services: 'Pakalpojumi un cenas',
    signIn: 'Ielogoties',
    signOut: 'Izlogoties',
    signUp: 'Pierakstīties',
});
i18next.addResources('ru', 'navBar', {
    about: 'О нас',
    book: 'Записаться',
    contacts: 'Контакты',
    history: 'Мои записи',
    lv: 'LV',
    profile: 'Профиль',
    ru: 'RU',
    services: 'Услуги и цены',
    signIn: 'Вход',
    signOut: 'Выход',
    signUp: 'Регистрация',
});

const template = `
<div id="nav_bar" v-on:click="controlMenus">
    <div id="nav_bar_left">
        <span class="icon i-list-s filter-lightest "></span>
        <div id="menu_left" v-show="menuLeftOpened">
            <div>
                <router-link to="/about">{{$t("navBar:about")}}</router-link>
            </div>
            <div>
                <router-link to="/contacts">{{$t("navBar:contacts")}}</router-link>
            </div>
            <div>
                <router-link to="/services">{{$t("navBar:services")}}</router-link>
            </div>
            <div v-if="isAuthenticated">
                <router-link to="/book">{{$t("navBar:book")}}</router-link>
            </div>
            <div v-if="isAuthenticated">
                <router-link to="/history">{{$t("navBar:history")}}</router-link>
            </div>
            <div v-if="isAuthenticated">
                <router-link to="/profile">{{$t("navBar:profile")}}</router-link>
            </div>
            <div  v-if="!isAuthenticated">
                <router-link to="/signIn">{{$t("navBar:signIn")}}</router-link>
            </div>
            <div v-if="!isAuthenticated">
                <router-link to="/signUp">{{$t("navBar:signUp")}}</router-link>
            </div>
            <div v-if="isAuthenticated">
                <router-link to="/signOut">{{$t("navBar:signOut")}}</router-link>
            </div>
        </div>
    </div>
    <div id="nav_bar_center">
        <img alt="Beauty salon" width="100" src="../img/logo.png">
    </div>
    <div id="nav_bar_right">
        <span style="text-transform: uppercase">{{lang}}</span>
        <div id="menu_right" v-show="menuRightOpened">
            <div>
                <span v-on:click="changeLang('lv-LV')">{{$t("navBar:lv")}}</span>
            </div>
            <div>
                <span v-on:click="changeLang('ru-RU')">{{$t("navBar:ru")}}</span>
            </div>
        </div>
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_App_NavBar(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];

    return {
        template,
        data: function () {
            return {
                lang: 'lv',
                menuLeftOpened: false,
                menuRightOpened: false,
            };
        },
        computed: {
            isAuthenticated() {
                let result = false;
                if (this.userAuthenticated) {
                    result = session.hasPermission(DEF.ACL_IS_CUSTOMER);
                }
                return result;
            },
            ...mapState({
                userAuthenticated: state => state.user.authenticated,
            })
        },
        methods: {
            async changeLang(lang) {
                this.lang = lang.substr(0, 2);
                await i18next.changeLanguage(lang);
            },
            controlMenus(evt) {
                const path = evt.path || (evt.composedPath && evt.composedPath());
                const elLeftStart = document.querySelector('#nav_bar_left');
                const elLeftMenu = document.querySelector('#menu_left');
                if (path.includes(elLeftMenu) || path.includes(elLeftStart)) {
                    this.menuLeftOpened = !this.menuLeftOpened;
                } else {
                    this.menuLeftOpened = false;
                }
                const elRightStart = document.querySelector('#nav_bar_right');
                const elRightMenu = document.querySelector('#menu_right');
                if (path.includes(elRightMenu) || path.includes(elRightStart)) {
                    this.menuRightOpened = !this.menuRightOpened;
                } else {
                    this.menuRightOpened = false;
                }
            }
        },
        created() {
            const savedLang = i18next.language;
            this.lang = (savedLang.substring(0, 2) === 'ru') ? 'ru' : 'lv';
        },
    };
}
