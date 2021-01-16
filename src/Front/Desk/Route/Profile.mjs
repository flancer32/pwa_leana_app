const i18next = self.teqfw.i18next;

i18next.addResources('lv', 'routeProfile', {
    created: 'Izveidots',
    email: 'E-pasts',
    loggedIn: 'Pēdējā ieeja',
    msgNewPassChanged: 'Jaunā parole ir iestatīta.',
    msgNewPassDiff: 'Atkārtotā parole is atšķirīga.',
    msgNewPassFailed: 'Jauna parole nav iestatīta',
    parentName: 'Mecenāts',
    passwordCurrent: 'Pašreizējā parole',
    passwordNew: 'Jaunā parole',
    passwordRepeat: 'Paroles atkārtojums',
    phone: 'Tālrunis',
    refCode: 'Reģistrācijas kods',
    sectionAuth: 'Autentifikācija',
    sectionContact: 'Kontakti',
    sectionPwd: 'Parole',
    sectionUser: 'Lietotās',
    sectionUserTree: 'Reģistrācija',
    userId: 'ID',
    userLogin: 'Login',
    userName: 'Vārds',
});
i18next.addResources('ru', 'routeProfile', {
    created: 'Создан',
    email: 'Почта',
    loggedIn: 'Последний вход',
    msgNewPassChanged: 'Новый пароль установлен.',
    msgNewPassDiff: 'Повторный пароль отличается.',
    msgNewPassFailed: 'Новый пароль не установлен.',
    parentName: 'Патрон',
    passwordCurrent: 'Текущий пароль',
    passwordNew: 'Новый пароль',
    passwordRepeat: 'Повтор пароля',
    phone: 'Телефон',
    refCode: 'Код регистрации',
    sectionAuth: 'Аутентификация',
    sectionContact: 'Контакты',
    sectionPwd: 'Пароль',
    sectionUser: 'Пользователь',
    sectionUserTree: 'Регистрация',
    userId: 'ID',
    userLogin: 'Login',
    userName: 'Имя',
});

const template = `
<div>
    <actions
            @actionSave="onSave"
    ></actions>
    <div class="layout_centered">
        <form class="edit" onsubmit="return false">

            <div class="id-user section">
                <div>{{ $t('routeProfile:sectionUser') }}</div>
            </div>

            <div class="id-userId row">
                <div class="label">
                    <span>{{ $t('routeProfile:userId') }}:</span>
                </div>
                <div class="field">
                    {{ userId }}
                </div>
            </div>

            <div class="id-dateCreated row">
                <div class="label">
                    <span>{{ $t('routeProfile:created') }}:</span>
                </div>
                <div class="field">
                    {{ dateCreatedUi }}
                </div>
            </div>

            <div class="id-userName row">
                <div class="label">
                    <span>{{ $t('routeProfile:userName') }}:</span>
                </div>
                <div class="field">
                    <input v-model="userName">
                </div>
            </div>

            <div class="id-auth section">
                <div>{{ $t('routeProfile:sectionAuth') }}</div>
            </div>

            <div class="id-dateLoggedIn row">
                <div class="label">
                    <span>{{ $t('routeProfile:loggedIn') }}:</span>
                </div>
                <div class="field">
                    {{ dateLoggedInUi }}
                </div>
            </div>

            <div class="id-parentName row">
                <div class="label">
                    <span>{{ $t('routeProfile:parentName') }}:</span>
                </div>
                <div class="field">
                    {{ parentName }}
                </div>
            </div>

            <div class="id-userLogin row">
                <div class="label">
                    <span>{{ $t('routeProfile:userLogin') }}:</span>
                </div>
                <div class="field">
                    <input v-model="userLogin" autocomplete="username" disabled>
                </div>
            </div>

            <div class="id-refCode row">
                <div class="label">
                    <span>{{ $t('routeProfile:refCode') }}:</span>
                </div>
                <div class="field">
                    {{ refCode }}
                </div>
            </div>

            <div class="id-auth section">
                <div>{{ $t('routeProfile:sectionContact') }}</div>
            </div>

            <div class="id-email row">
                <div class="label">
                    <span>{{ $t('routeProfile:email') }}:</span>
                </div>
                <div class="field">
                    <input v-model="email">
                </div>
            </div>

            <div class="id-phone row">
                <div class="label">
                    <span>{{ $t('routeProfile:phone') }}:</span>
                </div>
                <div class="field">
                    <input v-model="phone">
                </div>
            </div>

            <div class="id-password section">
                <div>{{ $t('routeProfile:sectionPwd') }}</div>
            </div>

            <div class="id-passwordCurrent row">
                <div class="label">
                    <span>{{ $t('routeProfile:passwordCurrent') }}:</span>
                </div>
                <div class="field">
                    <input type="password" autocomplete="current-password" v-model="passwordCurrent">
                </div>
            </div>

            <div class="id-passwordNew row">
                <div class="label">
                    <span>{{ $t('routeProfile:passwordNew') }}:</span>
                </div>
                <div class="field">
                    <input type="password" autocomplete="new-password" v-model="passwordNew">
                </div>
            </div>

            <div class="id-passwordRepeat row">
                <div class="label">
                    <span>{{ $t('routeProfile:passwordRepeat') }}:</span>
                </div>
                <div class="field editable">
                    <div class="message" v-show="showMessage">{{ message }}</div>
                    <div class="value">
                        <input type="password" autocomplete="new-password" v-model="passwordRepeat">
                    </div>
                    <div class="action">
                        <button v-on:click="actionChangePassword" :disabled="disabledChangePassword">...</button>
                    </div>
                </div>
            </div>

        </form>
    </div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_Profile(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$']; // singleton instance
    /** @type {Fl32_Leana_Front_Desk_Widget_Profile_Actions} */
    const actions = spec['Fl32_Leana_Front_Desk_Widget_Profile_Actions$']; // singleton instance
    /** @type {Fl32_Leana_Front_Gate_Employee_Profile_Save} */
    const gateProfileSave = spec['Fl32_Leana_Front_Gate_Employee_Profile_Save$'];   // singleton function
    /** @type {Fl32_Teq_User_Front_Gate_Current} */
    const gateUserCurrent = spec['Fl32_Teq_User_Front_Gate_Current$']; // singleton function
    /** @type {Fl32_Teq_User_Front_Gate_ChangePassword} */
    const gateUserSetPwd = spec['Fl32_Teq_User_Front_Gate_ChangePassword$'];    // singleton function
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_Profile_Save_Request} */
    const ProfileSaveReq = spec['Fl32_Leana_Shared_Service_Route_Employee_Profile_Save#Request']; // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Employee_Profile_Save_Response} */
    const ProfileSaveRes = spec['Fl32_Leana_Shared_Service_Route_Employee_Profile_Save#Response']; // class constructor
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_Current_Request} */
    const UserCurrentReq = spec['Fl32_Teq_User_Shared_Service_Route_Current#Request']; // class constructor
    /** @type {typeof Fl32_Teq_User_Shared_Service_Route_ChangePassword_Request} */
    const UserSetPws = spec['Fl32_Teq_User_Shared_Service_Route_ChangePassword#Request'];   // class constructor
    /** @type {typeof Fl32_Teq_User_Shared_Service_Data_User} */
    const DProfile = spec['Fl32_Teq_User_Shared_Service_Data_User#'];   // class constructor

    return {
        name: 'RouteProfile',
        template,
        components: {actions},
        data() {
            return {
                dateCreated: null,
                dateLoggedIn: null,
                email: null,
                message: null,
                parentName: null,
                passwordCurrent: null,
                passwordNew: null,
                passwordRepeat: null,
                phone: null,
                refCode: null,
                showMessage: false,
                userId: null,
                userLogin: null,
                userName: null,
            };
        },
        computed: {
            dateCreatedUi() {
                return utilDate.formatDateTime(this.dateCreated);
            },
            dateLoggedInUi() {
                return utilDate.formatDateTime(this.dateLoggedIn);
            },
            disabledChangePassword() {
                return !(this.passwordCurrent && this.passwordNew && this.passwordRepeat);
            }
        },
        methods: {
            async actionChangePassword() {
                this.showMessage = false;
                if (this.passwordNew !== this.passwordRepeat) {
                    this.showMessage = true;
                    this.message = this.$t('routeProfile:msgNewPassDiff');
                } else {
                    const req = new UserSetPws();
                    req.passwordCurrent = this.passwordCurrent;
                    req.passwordNew = this.passwordNew;
                    /** @type {Fl32_Teq_User_Shared_Service_Route_ChangePassword_Response} */
                    const res = await gateUserSetPwd(req);
                    if (res.success === true) {
                        this.message = this.$t('routeProfile:msgNewPassChanged');
                        this.passwordCurrent = null;
                        this.passwordNew = null;
                        this.passwordRepeat = null;
                    } else {
                        this.message = this.$t('routeProfile:msgNewPassFailed');
                    }
                    this.showMessage = true;
                }
                this.hideMessage();
            },
            hideMessage() {
                setTimeout(() => {
                    this.message = '';
                    this.showMessage = false;
                }, 2000);
            },
            async loadUser() {
                const req = new UserCurrentReq();
                /** @type {Fl32_Teq_User_Shared_Service_Route_Current_Response} */
                const res = await gateUserCurrent(req);
                this.dateCreated = res.user.dateCreated;
                this.dateLoggedIn = res.user.dateLoggedIn;
                this.email = (res.user.emails && res.user.emails[0]) ? res.user.emails[0] : ''; // one only value is used
                this.parentName = res.user.parentName;
                this.phone = (res.user.phones && res.user.phones[0]) ? res.user.phones[0] : ''; // one only value is used
                this.refCode = res.user.refCode;
                this.userId = res.user.id;
                this.userLogin = res.user.login;
                this.userName = res.user.name;
            },
            async onSave() {
                const user = new DProfile();
                user.id = this.userId;
                user.name = this.userName;
                user.emails = [this.email];
                user.phones = [this.phone];
                const req = new ProfileSaveReq();
                req.user = user;
                const res = await gateProfileSave(req);
                if (res instanceof ProfileSaveRes) {
                    // this is normal answer, not error
                    await this.loadUser();
                } else {
                    console.log('Some error is occurred on profile save.');
                }
            },
        },
        async mounted() {
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                await this.loadUser();
            }
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_Profile;
