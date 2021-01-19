const i18next = self.teqfw.i18next;

i18next.addResources('lv', 'routeSignIn', {
    about: 'Jauns lietotājs "{{user}}" ir reģistrēts.',
});
i18next.addResources('ru', 'routeSignIn', {
    registered: 'Новый пользователь "{{user}}" зарегистрирован.',
});

const I18N_BUNDLE_USER_LV = {
    email: 'E-pasts',
    login: 'Login',
    msgErrUnknownRefCode: 'Unknown referral code.',
    name: 'Vārds',
    password2: 'Paroles atkārtojums',
    password: 'Parole',
    phone: 'Tālrunis',
    refCode: 'Reģistrācijas kods',
    submit: 'Nosūtīt',
};
const I18N_BUNDLE_USER_RU = {
    email: 'Почта',
    login: 'Login',
    msgErrUnknownRefCode: 'Unknown referral code.',
    name: 'Имя',
    password2: 'Повтор пароля',
    password: 'Пароль',
    phone: 'Телефон',
    refCode: 'Код регистрации',
    submit: 'Отправить',
};

i18next.addResources('lv', 'teqUser', I18N_BUNDLE_USER_LV);
i18next.addResources('ru', 'teqUser', I18N_BUNDLE_USER_RU);

const template = `
<div>
    <user-sign-up v-show="showForm"
        :input="signUp"
        @onSuccess="onSuccess($event)"
        @onFailure="onFailure($event)"
    ></user-sign-up>
    <div class="id-message" v-show="!showForm">
        {{message}}
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_SignUp(spec) {
    const userSignUp = spec.Fl32_Teq_User_Front_Widget_SignUp$;
    /** @type {typeof Fl32_Teq_User_Front_Widget_SignUp_Props} */
    const SignUpProps = spec['Fl32_Teq_User_Front_Widget_SignUp#Props'];

    return {
        template,
        components: {userSignUp},
        data: function () {
            return {
                message: null,
                showForm: true,
            };
        },
        props: {
            refCode: String, // "/signUp/:refCode" - referral code to compose users tree
        },
        computed: {
            signUp() {
                const result = new SignUpProps();
                result.refCode = this.refCode;
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
                this.message = this.$t('routeSignIn:registered', {user: data.login});
                this.reset();
                this.$router.push('/signIn');
            },
            reset() {
                setTimeout(() => {
                    this.message = '';
                    this.showForm = true;
                }, 5000);
            }
        }
    };
}
