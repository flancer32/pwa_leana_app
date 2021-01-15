const i18next = self.teqfw.i18next;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'wgWorkTime', {});
i18next.addResources('ru', 'wgWorkTime', {
    wdMon: 'Пн.',
    wdTue: 'Вт.',
    wdWed: 'Ср.',
    wdThu: 'Чт.',
    wdFri: 'Пт.',
    wdSat: 'Сб.',
    wdSun: 'Вс.',
});

const template = `
<div class="work_time_widget">
    <div class="grid_head">&nbsp;</div>
    <div class="grid_head">{{$t('wgWorkTime:wdMon')}}</div>
    <div class="grid_head">{{$t('wgWorkTime:wdTue')}}</div>
    <div class="grid_head">{{$t('wgWorkTime:wdWed')}}</div>
    <div class="grid_head">{{$t('wgWorkTime:wdThu')}}</div>
    <div class="grid_head">{{$t('wgWorkTime:wdFri')}}</div>
    <div class="grid_head">{{$t('wgWorkTime:wdSat')}}</div>
    <div class="grid_head">{{$t('wgWorkTime:wdSun')}}</div>
    <template v-for="cell in cells">
        <cell :item="cell"></cell>
    </template>
</div>
`;

function Fl32_Leana_Front_Desk_Widget_WorkTime(spec) {
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$']; // singleton instance
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item} */
    const Item = spec['Fl32_Leana_Front_Desk_Widget_WorkTime_Api#Item']; // class constructor
    /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Cell} */
    const cell = spec['Fl32_Leana_Front_Desk_Widget_WorkTime_Cell$']; // singleton instance

    return {
        template,
        components: {cell},
        data: function () {
            return {};
        },
        props: {},
        computed: {
            cells() {
                // DEFINE INNER FUNCTIONS
                /**
                 *
                 * @param {Fl32_Leana_Shared_Service_Data_Employee_WorkTime[]} dbItems
                 * @return {Object.<String, Fl32_Leana_Shared_Service_Data_Employee_WorkTime>}
                 */
                function prepareEmlpoyees(dbItems) {
                    const result = {};
                    if (Array.isArray(dbItems)) {
                        dbItems.forEach(
                            /** @param {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} one */
                            (one) => {
                                const start = new Date(one.start);
                                const ds = utilDate.formatDate(start);
                                result[ds] = one;
                            });
                    }
                    return result;
                }

                // MAIN FUNCTIONALITY
                const result = [];
                const month = this.stateWorkTimeMonthCurrent;
                if (typeof month.getTime === 'function') {
                    // get year and week number for start of month
                    let {week, dateFirst: date} = utilDate.getMonthWidgetData(month);
                    // get employee's work time
                    const items = prepareEmlpoyees(this.stateWorkTimeDbItems);
                    // compose result set
                    const monthCur = month.getUTCMonth();
                    for (let i = 1; i <= 48; i++) {
                        const cell = new Item();
                        if ((i % 8) === 1) {
                            cell.typeIsDate = false;
                            cell.date = week;
                            week = (week >= 53) ? 1 : week + 1;
                        } else {
                            cell.typeIsDate = true;
                            cell.date = date.getUTCDate();
                            const ds = utilDate.formatDate(date);
                            if (items[ds]) {
                                /** @type {Fl32_Leana_Shared_Service_Data_Employee_WorkTime} */
                                const wt = items[ds];
                                cell.employeeId = wt.employeeRef;
                                cell.timeFrom = new Date(wt.start.getTime());
                                cell.timeTo = new Date(wt.start.getTime());
                                cell.timeTo.setUTCMinutes(cell.timeTo.getMinutes() + wt.duration);
                            }
                            cell.disabled = (date.getUTCMonth() !== monthCur);
                            date.setUTCDate(date.getUTCDate() + 1);
                        }
                        result.push(cell);
                    }
                }
                return result;
            },
            ...mapState({
                stateWorkTimeMonthCurrent: state => state.workTime.monthCurrent,
                stateWorkTimeDbItems: state => state.workTime.dbItems,
            })
        },
        methods: {},
        mounted() {
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_WorkTime;
