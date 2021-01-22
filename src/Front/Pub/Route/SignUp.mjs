const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeSignUp', {
    registered: 'Jauns lietotājs "{{user}}" ir reģistrēts.',
    title: 'Pierakstīties',
});
i18next.addResources('ru', 'routeSignUp', {
    registered: 'Новый пользователь "{{user}}" зарегистрирован.',
    title: 'Регистрация',
});

const I18N_BUNDLE_USER_LV = {
    email: 'E-pasts',
    errEmailExists: 'E-pasts eksistē.',
    errLoginExists: 'Lietotājs eksistē.',
    errPasswordDiffs: 'Paroles ir atšķirīgas.',
    errPhoneExists: 'Tālrunispasts eksistē.',
    errUnknownRefCode: 'Nezināms кeģistrācijas kods.',
    login: 'Lietotājs',
    name: 'Vārds',
    password2: 'Paroles atkārtojums',
    password: 'Parole',
    phone: 'Tālrunis',
    refCode: 'Reģistrācijas kods',
    submit: 'Nosūtīt',
};
const I18N_BUNDLE_USER_RU = {
    email: 'Почта',
    errEmailExists: 'Такая почта существует.',
    errLoginExists: 'Такой login существует.',
    errPasswordDiffs: 'Пароли отличаются.',
    errPhoneExists: 'Такой телефон существует.',
    errUnknownRefCode: 'Неизвестный реферальный код.',
    login: 'Login',
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
    /** @type {Fl32_Teq_User_Front_Widget_SignUp} */
    const userSignUp = spec['Fl32_Teq_User_Front_Widget_SignUp$'];  // singleton instance
    /** @type {typeof Fl32_Teq_User_Front_Widget_SignUp_Props} */
    const SignUpProps = spec['Fl32_Teq_User_Front_Widget_SignUp#Props'];    // class constructor

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
                this.message = this.$t('routeSignUp:registered', {user: data.login});
                this.reset();
                this.$router.push('/signIn');
            },
            reset() {
                setTimeout(() => {
                    this.message = '';
                    this.showForm = true;
                }, 5000);
            },
            ...mapMutations({
                setStateAppTitle: 'app/setTitle',
            }),
        },
        mounted() {
            this.setStateAppTitle(this.$t('routeSignUp:title'));
        }
    };
}
