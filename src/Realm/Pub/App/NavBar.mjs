const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'app-navBar', {
    about: 'Par mums',
    book: 'Pierakstīties',
    contacts: 'Kontakti',
    lv: 'LV',
    ru: 'RU',
    services: 'Pakalpojumi un cenas',
});
i18next.addResources('ru', 'app-navBar', {
    about: 'О нас',
    book: 'Записаться',
    contacts: 'Контакты',
    lv: 'LV',
    ru: 'RU',
    services: 'Услуги и цены',
});

const template = `
<div id="nav_bar" v-on:click="controlMenus">
    <div id="nav_bar_left">
        <span class="icon i-list-s filter-top-fg "></span>
        <div id="menu_left" v-show="menuLeftOpened">
            <div>
                <router-link to="/about">{{$t("app-navBar:about")}}</router-link>
            </div>
            <div>
                <router-link to="/contacts">{{$t("app-navBar:contacts")}}</router-link>
            </div>
            <div>
                <router-link to="/services">{{$t("app-navBar:services")}}</router-link>
            </div>
            <div>
                <router-link to="/book">{{$t("app-navBar:book")}}</router-link>
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
                <span v-on:click="changeLang('lv-LV')">{{$t("app-navBar:lv")}}</span>
            </div>
            <div>
                <span v-on:click="changeLang('ru-RU')">{{$t("app-navBar:ru")}}</span>
            </div>
        </div>
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Pub_App_NavBar() {
    return {
        template,
        data: function () {
            return {
                lang: 'lv',
                menuLeftOpened: false,
                menuRightOpened: false,
            };
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
