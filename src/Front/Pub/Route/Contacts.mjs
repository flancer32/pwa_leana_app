const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'routeContacts', {
    title: 'Kontakti',
});
i18next.addResources('ru', 'routeContacts', {
    title: 'Контакты',
});

const template = `
<div>
    <div v-html="content"></div>
</div>
`;

export default function Fl32_Leana_Front_Pub_Route_Contacts() {

    return {
        template,
        data: function () {
            return {
                content: ''
            };
        },
        methods: {
            ...mapMutations({
                setStateAppTitle: 'app/setTitle',
            }),
        },
        mounted() {
            const me = this;

            async function loadContent(lang) {
                const code = lang.substring(0, 2);
                const res = await fetch(`/static/app/block/md/contacts.${code}.md`);
                return await res.text();
            }

            // subscribe to 'change language' event
            // i18next.on('languageChanged', async function (lang) {
            //     me.content = await loadContent(lang);
            // });

            const lang = i18next.language;
            loadContent(lang).then(res => me.content = res);
            this.setStateAppTitle(this.$t('routeContacts:title'));
        }
    };
}
