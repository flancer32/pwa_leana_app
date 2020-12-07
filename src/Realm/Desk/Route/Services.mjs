const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'route-about', {});
i18next.addResources('ru', 'route-about', {
    id: 'ID',
    code: 'Код',
    duration: 'Продолжительность',
});

const template = `

<div>
    <div class="table">
        <div class="table-actions">
            <div>[Add]</div>
            <div>[Edit]</div>
            <div>[Clear]</div>
        </div>
        <div class="table-filters">Filters</div>
        <div class="table-head" :style="colspan">
            <div v-for="col in columns" class="table-head-column">{{ $t('route-about:' + col) }}</div>
        </div>
        <div class="table-body">
            <div v-for="item in items" class="table-row" :style="colspan">
                <div v-for="col in columns" class="table-cell">
                    {{ item[col] }}
                </div>
            </div>
        </div>
    </div>
</div>`;

export default function Fl32_Leana_Realm_Desk_Route_Services() {

    return {
        template,
        data: function () {
            return {
                columns: ['id', 'code', 'duration'],
                items: [
                    {id: 1, code: 'haircut_man', duration: 30},
                    {id: 2, code: 'haircut_women', duration: 60},
                    {id: 3, code: 'haircut_child', duration: 90},
                    {id: 4, code: 'color_simple', duration: 120},
                    {id: 5, code: 'color_complex', duration: 150},
                ],
                colspan: 'grid-template-columns: 1fr 4fr 2fr;',
            };
        },
    };
}
