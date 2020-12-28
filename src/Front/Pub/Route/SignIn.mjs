const i18next = self.teqfw.i18next;

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
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec.Fl32_Leana_Defaults$;
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
                result.password = 'LetMeIn';
                result.user = 'alex';
                return result;
            }
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
            /**
             * @param {Fl32_Teq_User_Shared_Service_Data_User} data
             */
            onSuccess(data) {
                this.showForm = false;
                this.message = this.$t('routeSignIn:message', {sessionId: data});
                this.reset();
            },
            reset() {
                setTimeout(() => {
                    this.message = '';
                    this.showForm = true;
                }, 5000);
            }
        },
        mounted() {
            const acl = [];
            if (Array.isArray(acl)) {
                if (!acl.includes(DEF.ACL_IS_CUSTOMER)) {
                    // throw not authorized exception
                }
            }
        }
    };
}
