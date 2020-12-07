const i18next = self.teqfw.i18next;
i18next.addResourceBundle('lv', 'widget_timePicker', {
    noEntries: 'Tukšs',
    timePicker: 'Izvēlieties laiku',
}, true);
i18next.addResourceBundle('ru', 'widget_timePicker', {
    noEntries: 'Пусто',
    timePicker: 'Выберите время',
}, true);

const template = `
<div class="timepicker">
    <div class="inputs">
        <div>
            <button v-on:click="showEntries = !showEntries">...</button>
        </div>
        <div>
            <input type="text" name="timePicker" v-model="interval" disabled
                   :placeholder="$t('widget_timePicker:timePicker')">
        </div>
    </div>
    <div v-show="showEntries">
        <div class="entries">
            <time-picker-entry
                    v-for="one in entriesGrouped"
                    :key="one.id"
                    :id="one.id"
                    :label="one.label"
                    @selected="entryIsSelected"
            ></time-picker-entry>
        </div>
        <div v-show="entries.length===0">{{ $t('widget_timePicker:noEntries') }}</div>
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Pub_Widget_TimePicker(spec) {
    /** @type {Fl32_Leana_Realm_Pub_Widget_TimePicker_Entry} */
    const entry = spec.Fl32_Leana_Realm_Pub_Widget_TimePicker_Entry$;
    return {
        template,
        components: {
            timePickerEntry: entry
        },
        props: {
            entries: Array
        },
        emits: ['selected'],
        data: function () {
            return {
                idSelected: null,
                showEntries: false,
            };
        },
        computed: {
            entriesGrouped() {
                const result = [];
                if (Array.isArray(this.entries)) {
                    const leftColumn = [];
                    const rightColumn = [];
                    const total = this.entries.length;
                    const median = (total / 2) + (total % 2); // (5/2+1) = 3 or (6/2+0)=3
                    let i = 0;
                    for (const ndx in this.entries) {
                        (i++ < median) ? leftColumn.push(this.entries[ndx]) : rightColumn.push(this.entries[ndx]);
                    }
                    let left, right;
                    do {
                        left = leftColumn.shift();
                        right = rightColumn.shift();
                        if (left) result.push(left);
                        if (right) result.push(right);
                    } while (left || right);
                }
                return result;
            },
            interval() {
                let result = '';
                if (this.idSelected) {
                    const found = this.entries.find((one) => one.id === this.idSelected);
                    if (found) result = found.label;
                }
                return result;
            }
        },
        methods: {
            entryIsSelected(id) {
                this.$emit('selected', id);
                this.idSelected = id;
                this.showEntries = false;
            }
        }
    };
}
