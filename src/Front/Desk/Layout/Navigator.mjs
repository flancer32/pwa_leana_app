const i18next = self.teqfw.i18next;

i18next.addResources('lv', 'navig', {
    calendar: 'Saraksts',
    profile: 'Profils',
    services: 'Pakalpojumi',
    settings: 'Iestatījumi',
    signOut: 'Izrakstīties',
    title: 'Leana Frizētava',
    users: 'Lietotāji',
    workTime: 'Darba laiks',
});
i18next.addResources('ru', 'navig', {
    calendar: 'Расписание',
    profile: 'Профиль',
    services: 'Услуги',
    settings: 'Настройки',
    signOut: 'Выход',
    title: 'Leana Frizētava',
    users: 'Пользователи',
    workTime: 'Рабочее время',
});

const template = `
<div class="navigator" v-on:click="controlMenus">
    <div class="nav_left">
        <loader></loader>
    </div>
    <div class="nav_center">
        <div>{{$t('navig:title')}}</div>
    </div>
    <div class="nav_right">
        <i class="fas fa-bars fa-2x filter-darkest"></i>
        <div class="nav_menu" v-show="menuOpened">
            <div>
                <router-link to="/calendar">{{$t("navig:calendar")}}</router-link>
            </div>
            <div>
                <router-link to="/workTime">{{$t("navig:workTime")}}</router-link>
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
function Fl32_Leana_Front_Desk_Layout_Navigator(spec) {
    /** @type {Fl32_Leana_Front_Shared_Widget_Loader} */
    const loader = spec['Fl32_Leana_Front_Shared_Widget_Loader$'];  // singleton component

    const CSS_BAR = '.nav_right';
    const CSS_MENU = '.nav_menu';
    return {
        name: 'Navigator',
        template,
        components: {loader},
        data: function () {
            return {
                menuOpened: false,
            };
        },
        computed: {},
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
