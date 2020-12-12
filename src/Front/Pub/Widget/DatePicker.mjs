const i18next = self.teqfw.i18next;

i18next.addResourceBundle('lv', 'widget_datePicker', {
    datePicker: 'Izvēlieties datumu'
}, true);
i18next.addResourceBundle('ru', 'widget_datePicker', {
    datePicker: 'Выберите дату'
}, true);

const template = `
<div class="datepicker">
    <div><button v-on:click="showHide">...</button></div>
    <div>
        <input type="text" id="bookDate" name="datePicker" disabled :placeholder="$t('widget_datePicker:datePicker')">
    </div>
</div>
`;

export default function Fl32_Leana_Front_Pub_Widget_DatePicker() {

    // picker container should be a simple object (not vued as prop or data)
    let picker;

    return {
        template,
        components: {},
        props: {
            min: Date,
            max: Date,
            datesDisabled: Array
        },
        emits: ['selected'],
        data: function () {
            return {
                widgetPicker: null
            };
        },
        computed: {},
        watch: {
            /**
             *
             * @param {Array<Date>>} val
             */
            datesDisabled() {
                this.createPicker();
            }
        },
        methods: {
            showHide(event) {
                event.stopPropagation();
                const isHidden = picker.calendarContainer.classList.contains('qs-hidden');
                picker[isHidden ? 'show' : 'hide']();
            },
            cleanSelected() {
                const el = self.document.querySelector('#bookDate');
                el.value = '';
            },
            /**
             * (Re)create date picker widget after params were changed.
             */
            createPicker() {
                // https://github.com/qodesmith/datepicker
                if (picker && picker.remove) picker.remove();
                picker = self.datepicker('#bookDate', {
                    disabledDates: this.datesDisabled,
                    disableYearOverlay: true,
                    maxDate: this.max,
                    minDate: this.min,
                    showAllDates: false,
                    startDay: 1,
                    onSelect: (inst) => {
                        // convert local time to UTC (YYYY/MM/DD 00:00:00)
                        /** @type {Date} */
                        const ds = inst.dateSelected; // date selected
                        /** @type {Date} */
                        const dz = new Date(0); // date zero
                        dz.setUTCFullYear(ds.getFullYear(), ds.getMonth(), ds.getDate());
                        // pass date to parent component
                        this.$emit('selected', dz);
                        // print out date value in input field
                        if (typeof dz.toLocaleDateString === 'function') {
                            const locale = i18next.language;
                            const formatted = dz.toLocaleDateString(locale, {
                                weekday: 'short',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            });
                            const elInput = this.$el.querySelector('#bookDate');
                            elInput.value = formatted;
                        }
                    }
                });
            }
        },
        mounted() {
            this.createPicker();
        }
    };
}
