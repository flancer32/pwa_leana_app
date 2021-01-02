const i18next = self.teqfw.i18next;

i18next.addResources('lv', 'routeSignOut', {
    message: 'Gaida sesijas beigas.',
});
i18next.addResources('ru', 'routeSignOut', {
    message: 'Ожидание завершения сессии.',
});


const template = `
<div>
    <div class="id-message">
        {{$t('message')}}
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_SignOut(spec) {
    /** @type {Fl32_Teq_User_Front_App_Session} */
    const session = spec.Fl32_Teq_User_Front_App_Session$;

    return {
        template,
        async mounted() {
            await session.close();
            await this.$router.push('/');
        }
    };
}
