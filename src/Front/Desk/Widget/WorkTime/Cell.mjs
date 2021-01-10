const EVENT_NEXT = 'actionNext';

const template = `
<div :class="cssClass">
    <div class="wt_cell_date">{{item.date}}</div>
    <div class="wt_cell_empl" v-show="item.employeeId">{{employee}}</div>
    <div class="wt_cell_time" v-show="item.employeeId">{{timeFrom}}-{{timeTo}}</div>
</div>
`;

function Fl32_Leana_Front_Desk_Widget_WorkTime_Cell(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];  // singleton instance
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec['Fl32_Leana_Shared_Util_DateTime$']; // singleton instance

    return {
        name: 'WorkTimeCell',
        template,
        emits: [],
        props: {
            /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item} */
            item: {},
        },
        computed: {
            cssClass() {
                let result = 'grid_cell';
                /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item} */
                const item = this.item;
                if (item.employeeId === DEF.USER_ID_LENA) result += ' user_lena';
                if (item.employeeId === DEF.USER_ID_NATA) result += ' user_nata';
                if (item.disabled) result += ' disabled';
                if (!item.typeIsDate) result += ' week';
                return result;
            },
            employee() {
                let result = '';
                if (this.item && this.item.employeeId) {
                    result = (this.item.employeeId === DEF.USER_ID_NATA) ? 'N' : 'L';
                }
                return result;
            },
            timeFrom() {
                let result = '';
                /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item} */
                const item = this.item;
                if ((item.timeFrom) && (item.timeFrom instanceof Date)) {
                    result = utilDate.stampTime(item.timeFrom, true);
                }
                return result;
            },
            timeTo() {
                let result = '';
                /** @type {Fl32_Leana_Front_Desk_Widget_WorkTime_Api_Item} */
                const item = this.item;
                if (
                    (item.timeTo) && (item.timeTo instanceof Date)
                ) result = utilDate.stampTime(item.timeTo, true);
                return result;
            },
        },
        methods: {
            actionNext() {
                this.$emit(EVENT_NEXT);
            },
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_WorkTime_Cell;
