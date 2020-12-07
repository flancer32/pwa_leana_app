const template = `
<div class="teq_ui_dtp">
    <div class="teq_ui_dtp_actions">
        <div v-on:click="actionCancel()">
            <i class="far fa-times-circle fa-2x filter-top-fg"></i>
        </div>
        <div v-on:click="actionDateSelected()">
            <i class="far fa-check-circle fa-2x filter-top-fg"></i>
        </div>
    </div>
    <div class="teq_ui_dtp_content">
        <scroller :items="getYears" :initValue="getInitYear" @selected="yearIsSelected"></scroller>
        <div>/</div>
        <scroller :items="getMonths" :initValue="getInitMonth" @selected="monthIsSelected"></scroller>
        <div>/</div>
        <scroller :items="getDays" :initValue="getInitDay" @selected="dayIsSelected"></scroller>
        <div>&nbsp;&nbsp;</div>
        <scroller :items="getHours" :initValue="getInitHour" @selected="hourIsSelected"></scroller>
        <div>:</div>
        <scroller :items="getMins" :initValue="getInitMinute" @selected="minIsSelected"></scroller>
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Shared_Widget_DateTimePicker(spec) {
    const wgScrollerV = spec.Fl32_Leana_Realm_Shared_Widget_Scroller_Vertical$;    // singleton

    return {
        template,
        components: {
            scroller: wgScrollerV
        },
        props: {
            hourMax: Number,    // HH: 20
            hourMin: Number,    // HH: 9
            initDate: Date,     // initial date-time
            minsStep: Number,   // 1, 5, 15, 30
            yearMax: Number,    // YYYY: 9999
            yearMin: Number,    // YYYY: 2020
        },
        emits: ['cancelled', 'selected'],
        data: function () {
            return {
                scrolled: {
                    year: null,
                    month: null,
                    day: null,
                    hour: null,
                    min: null,
                }
            };
        },
        computed: {
            getDays() {
                const result = [];
                let maxDay = 31;
                const y = this.scrolled.year;
                const m = this.scrolled.month;
                if (y && m) {
                    // Jan in Date() is 0 but we use Jan as 1, so 'new Date(2020, 1 , 0)' means the last day of Jan
                    const date = new Date(y, m, 0);
                    maxDay = date.getDate();
                }
                for (let i = 1; i <= maxDay; i++)
                    result.push({key: i, value: String(i).padStart(2, '0')});
                return result;
            },
            getHours() {
                const result = [];
                if (this.hourMin && this.hourMax) {
                    for (let i = this.hourMin; i <= this.hourMax; i++)
                        result.push({key: i, value: String(i).padStart(2, '0')});
                }
                return result;
            },
            getMins() {
                const result = [];
                let step = 1;
                if (this.minsStep) {
                    const num = Number.parseInt(this.minsStep);
                    if ((num === 5) || (num === 10) || (num === 15) || (num === 30)) {
                        step = num;
                    }
                }
                for (let i = 0; i <= 59; i = i + step)
                    result.push({key: i, value: String(i).padStart(2, '0')});
                return result;
            },
            getMonths() {
                const result = [];
                for (let i = 1; i <= 12; i++)
                    result.push({key: i, value: String(i).padStart(2, '0')});
                return result;
            },
            getYears() {
                const result = [];
                if (this.yearMin && this.yearMax) {
                    for (let i = this.yearMin; i <= this.yearMax; i++)
                        result.push({key: i, value: i});
                }
                return result;
            },
            /**
             * Get initial date from properties or now.
             * @return {Date}
             */
            getInitDate() {
                if (this.initDate instanceof Date) {
                    return this.initDate;
                } else {
                    return new Date();
                }
            },
            getInitDay() {
                return String(this.getInitDate.getDate());
            },
            getInitHour() {
                return String(this.getInitDate.getHours());
            },
            getInitMinute() {
                return String(this.getInitDate.getMinutes());
            },
            getInitMonth() {
                return String(this.getInitDate.getMonth() + 1);
            },
            getInitYear() {
                return String(this.getInitDate.getFullYear());
            },
        },
        methods: {
            actionCancel() {
                this.$emit('cancelled');
            },
            actionDateSelected() {
                const dt = this.scrolled;
                const source = `${dt.year}-${dt.month}-${dt.day} ${dt.hour}:${dt.min}`;
                const result = new Date(source);
                this.$emit('selected', result);
            },
            dayIsSelected(key) {
                this.scrolled.day = key;
            },
            hourIsSelected(key) {
                this.scrolled.hour = key;
            },
            minIsSelected(key) {
                this.scrolled.min = key;
            },
            monthIsSelected(key) {
                this.scrolled.month = key;
            },
            yearIsSelected(key) {
                this.scrolled.year = key;
            },
        },
    };
}
