const i18next = self.teqfw.i18next;

const template = `
<div>
    <div v-html="content"></div>
</div>
`;

export default function Fl32_Leana_Realm_Pub_Route_Services() {

    return {
        template,
        data: function () {
            return {
                content: ''
            };
        },
        created() {
            const me = this;

            async function loadContent(lang) {
                const code = lang.substring(0, 2);
                const res = await fetch(`/static/mod/leana/block/md/services.${code}.md`);
                return await res.text();
            }

            // subscribe to 'change language' event
            i18next.on('languageChanged', async function (lang) {
                me.content = await loadContent(lang);
            });

            const lang = i18next.language;
            loadContent(lang).then(res => me.content = res);
        }
    };
}
