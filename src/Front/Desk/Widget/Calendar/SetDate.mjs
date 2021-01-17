const mapActions = self.teqfw.lib.Vuex.mapActions;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const i18next = self.teqfw.i18next;
i18next.addResources('lv', 'calendarSetDate', {
    actionSave: 'Saglabāt',
});
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
 * @param {TeqFw_Di_SpecProxy} spec
 */
export default function Fl32_Leana_Front_Desk_Widget_Calendar_SetDate(spec) {
    const TaskOnDateRequest = spec['Fl32_Leana_Shared_Service_Route_Task_OnDate#Request']; // class constructor
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
                /** @type {Date} */
                const d = this.dateSelected;
                const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
                this.saveDateSelected(utc);
                this.setTitle(this.dateSelected);
                /** @type {Fl32_Leana_Shared_Service_Route_Task_OnDate_Request} */
                const req = new TaskOnDateRequest();
                req.date = utc;
                this.loadTasksOnDate(req);
                this.resetOverlay();
            },
            setTitle(date) {
                const y = `${date.getFullYear()}`;
                const m = `${(date.getMonth() + 1)}`.padStart(2, '0');
                const d = `${(date.getDate())}`.padStart(2, '0');
                // don't use '/' in title (HTML safe transformation will be applied)
                const formatted = `${y}-${m}-${d}`;
                this.setStateAppTitle(this.$t('routeSchedule:title', {date: formatted}));
            },
            ...mapMutations({
                resetOverlay: 'app/resetOverlay',
                saveDateSelected: 'calendar/setDateSelected',
                setStateAppTitle: 'app/setTitle',
            }),
            ...mapActions({
                loadTasksOnDate: 'calendar/loadTasksOnDate',
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
