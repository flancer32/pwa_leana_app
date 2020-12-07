const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'calendarSetDate', {});
i18next.addResources('ru', 'calendarSetDate', {
    actionSave: 'Сохранить',
});

const template = `
<div class="calendar_date_picker">
    <div title="date picker widget">
        <input type="text" name="datePicker" disabled>
    </div>
</div>
`;
/**
 * Widget to set date for calendar in dashboard overlay.
 */
export default function Fl32_Leana_Realm_Desk_Widget_Calendar_SetDate(spec) {
    /** @type {Fl32_Leana_Shared_Const} */
    const cfgConst = spec.Fl32_Leana_Shared_Const$;
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;

    // picker container should be a simple object (not 'vued' as prop or data)
    let datePicker;

    return {
        template,
        data() {
            return {
                dateSelected: ''    // registry to place selected date before saving in vuex store
            };
        },
        computed: {
            ...mapState({
                dateSelectedCalendar: state => state.calendar.dateSelected,
            })
        },
        methods: {
            /**
             * (Re)create date picker widget after params were changed.
             */
            createPicker() {
                // https://github.com/qodesmith/datepicker
                if (datePicker && datePicker.remove) datePicker.remove();
                // prepare date picker configuration options
                // const maxDate = utilDate.forwardDate(cfgConst.calendar.maxDate);
                // const minDate = utilDate.forwardDate(cfgConst.calendar.minDate);
                // create calendar
                datePicker = self.datepicker('.calendar_date_picker INPUT', {
                    alwaysShow: true,
                    dateSelected: this.dateSelected,
                    disabledDates: this.datesDisabled,
                    disableYearOverlay: true,
                    // maxDate,
                    // minDate,
                    showAllDates: false,
                    startDay: 1,
                    onSelect: (inst) => {
                        this.dateSelected = inst.dateSelected;
                        this.save();
                    }
                });
            },
            save() {
                this.saveDateSelected(this.dateSelected);
                this.resetOverlay();
            },
            ...mapMutations({
                resetOverlay: 'app/resetOverlay',
                saveDateSelected: 'calendar/setDateSelected',
            }),
        },
        mounted() {
            if (typeof this.dateSelectedCalendar.getTime === 'function') {
                this.dateSelected = this.dateSelectedCalendar;
            }
            this.createPicker();
        },
    };
}
