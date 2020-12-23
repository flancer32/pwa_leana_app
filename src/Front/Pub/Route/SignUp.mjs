const i18next = self.teqfw.i18next;

const template = `
<div>
    <user-sign-up v-show="showForm"
        :data="signUp"
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
        computed: {
            signUp() {
                const result = new SignUpProps();
                result.email = 'alex@flancer64.com';
                result.login = 'alex';
                result.name = 'Alex Gusev';
                result.password = 'LetMeIn';
                result.phone = '29181801';
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
                this.message = this.$t('New user "{{user}}" is registered.', {user: data.login});
                this.reset();
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
