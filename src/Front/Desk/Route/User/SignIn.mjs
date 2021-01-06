const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeSignIn', {
    message: 'Izveidota jauna sesija: {{sessionId}}.',
    title: 'Leana Hairdresser Salon',
});
i18next.addResources('ru', 'routeSignIn', {
    message: 'Новая сессия установлена: "{{sessionId}}".',
    title: 'Leana Hairdresser Salon',
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
<div class="route_sign_in">
    <h1>{{$t('routeSignIn:title')}}</h1>
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

function Fl32_Leana_Front_Desk_Route_User_SignIn(spec) {
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
                // session is initiated in 'Fl32_Teq_User_Front_Widget_SignIn' before @success event.
                const user = session.getUser();
                this.setStateUserAuthenticated(user);
                //get route been saved before redirect to sign in form
                const path = session.getRouteToRedirect();
                await this.$router.push(path);
            },
            reset() {
                setTimeout(() => {
                    this.message = '';
                    this.showForm = true;
                }, 2000);
            },
            ...mapMutations({
                setStateUserAuthenticated: 'user/setAuthenticated'
            }),
        },
    };
}

export default Fl32_Leana_Front_Desk_Route_User_SignIn;
