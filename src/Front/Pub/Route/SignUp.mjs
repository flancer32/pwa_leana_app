const i18next = self.teqfw.i18next;

const template = `
<div>
    <user-sign-up :data="signUp"></user-sign-up>
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
            return {};
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
        created() {
        }
    };
}
