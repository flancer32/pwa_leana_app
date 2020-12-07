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

export default function Fl32_Leana_Realm_Pub_Widget_DatePicker() {

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
                        this.$emit('selected', inst.dateSelected);
                    }
                });
            }
        },
        mounted() {
            this.createPicker();
        }
    };
}
