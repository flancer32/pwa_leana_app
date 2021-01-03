const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
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

export default function Fl32_Leana_Front_Pub_Route_SignIn(spec) {
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec.Fl32_Teq_User_Defaults$;
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];
    const userSignIn = spec.Fl32_Teq_User_Front_Widget_SignIn$;
    /** @type {typeof Fl32_Teq_User_Front_Widget_SignIn_Props} */
    const SignInProps = spec['Fl32_Teq_User_Front_Widget_SignIn#Props'];

    return {
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
                result.user = 'cust';
                return result;
            },
            ...mapState({
                userAuthenticated: state => state.user.authenticated,
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
                const user = session.getUser();
                this.setUserAuthenticated(user);
                // redirect to booking
                await this.$router.push('/book');
            },
            reset() {
                setTimeout(() => {
                    this.message = '';
                    this.showForm = true;
                }, 2000);
            },
            ...mapMutations({
                setUserAuthenticated: 'user/setAuthenticated'
            }),
        },
    };
}
