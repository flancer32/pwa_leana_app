const i18next = self.teqfw.i18next;
const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'routeSignIn', {
    message: 'Izveidota jauna sesija: {{sessionId}}.',
});
i18next.addResources('ru', 'routeSignIn', {
    message: 'Новая сессия установлена: "{{sessionId}}".',
});

i18next.addResourceBundle('lv', 'teqUserSignIn', {
    password: 'Parole',
    submit: 'Nosūtīt',
    user: 'Lietotājs',
}, true);

i18next.addResourceBundle('ru', 'teqUserSignIn', {
    password: 'Пароль',
    submit: 'Отправить',
    user: 'Пользователь',
}, true);


const template = `
<div>
    <user-sign-in v-show="showForm"
        :data="signIn"
        @onSuccess="onSuccess($event)"
        @onFailure="onFailure($event)"
    ></user-sign-in>
    <div class="id-message" v-show="!showForm">
        {{message}}
    </div>
</div>
`;

export default function Fl32_Leana_Front_Desk_Route_User_SignIn(spec) {
    const userSignIn = spec.Fl32_Teq_User_Front_Widget_SignIn$;
    /** @type {typeof Fl32_Teq_User_Front_Widget_SignIn_Props} */
    const SignInProps = spec['Fl32_Teq_User_Front_Widget_SignIn#Props'];
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];

    return {
        name: 'RouteUserSignIn',
        template,
        components: {userSignIn},
        data: function () {
            return {
                message: null,
                showForm: true,
            };
        },
        computed: {
            signIn() {
                /** @type {Fl32_Teq_User_Front_Widget_SignIn_Props} */
                const result = new SignInProps();
                result.password = '';
                result.user = '';
                return result;
            },
            ...mapState({
                userAcl: state => state.acl.userAcl,
            })
        },
        methods: {
            /**
             * @param {String} data
             */
            onFailure(data) {
                this.showForm = false;
                this.message = String(data);
                this.reset();
            },
            async onSuccess() {
                // get permissions from server then redirect user to the saved route
                await session.init();
                const path = session.getRouteToRedirect();
                await this.$router.push(path);
            },
            reset() {
                setTimeout(() => {
                    this.message = '';
                    this.showForm = true;
                }, 2000);
            },
            ...mapActions({
                loadUserAcl: 'acl/loadUserAcl',
            }),
        },
    };
}
