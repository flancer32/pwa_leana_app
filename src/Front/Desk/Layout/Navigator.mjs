const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'navig', {
    calendar: 'Расписание',
    profile: 'Профиль',
    services: 'Услуги',
    settings: 'Настройки',
    signOut: 'Выход',
    timeWork: 'Рабочее время',
    title: 'Leana Frizētava',
    users: 'Пользователи',
});
i18next.addResources('ru', 'navig', {
    calendar: 'Расписание',
    profile: 'Профиль',
    services: 'Услуги',
    settings: 'Настройки',
    signOut: 'Выход',
    timeWork: 'Рабочее время',
    title: 'Leana Frizētava',
    users: 'Пользователи',
});

const template = `
<div class="navigator" v-on:click="controlMenus">
    <div class="nav_left">
        <div>{{$t('navig:title')}}</div>
    </div>
    <div class="nav_right">
        <i class="fas fa-bars fa-2x filter-top-fg"></i>
        <div class="nav_menu" v-show="menuOpened">
            <div>
                <router-link to="/calendar">{{$t("navig:calendar")}}</router-link>
            </div>
            <div>
                <router-link to="/timeWork">{{$t("navig:timeWork")}}</router-link>
            </div>
            <div>
                <router-link to="/users">{{$t("navig:users")}}</router-link>
            </div>
            <div>
                <router-link to="/services">{{$t("navig:services")}}</router-link>
            </div>
            <div>
                <router-link to="/profile">{{$t("navig:profile")}}</router-link>
            </div>
            <div>
                <router-link to="/settings">{{$t("navig:settings")}}</router-link>
            </div>
            <div>
                <router-link to="/user/signOut">{{$t("navig:signOut")}}</router-link>
            </div>
        </div>  
    </div>
</div>
`;

/**
 * Right side navigator (main).
 */
function Fl32_Leana_Front_Desk_Layout_Navigator() {
    const CSS_BAR = '.nav_right';
    const CSS_MENU = '.nav_menu';
    return {
        name: 'Navigator',
        template,
        data: function () {
            return {
                menuOpened: false,
            };
        },
        computed: {
            isAuthenticated() {
                return true;
            }
        },
        methods: {
            controlMenus(evt) {
                const path = evt.path || (evt.composedPath && evt.composedPath());
                const elBar = document.querySelector(CSS_BAR);
                const elMenu = document.querySelector(CSS_MENU);
                if (path.includes(elMenu) || path.includes(elBar)) {
                    this.menuOpened = !this.menuOpened;
                } else {
                    this.menuOpened = false;
                }
            }
        },
    };
}

export default Fl32_Leana_Front_Desk_Layout_Navigator;
