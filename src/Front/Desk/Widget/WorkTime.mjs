const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

const template = `
<div class="work_time_widget">
    <div>TOP (weekdays)</div>
    <div>[53][1][2][3][4][5][6][7]</div>
    <div>[01][1][2][3][4][5][6][7]</div>
    <div>[02][1][2][3][4][5][6][7]</div>
    <div>[03][1][2][3][4][5][6][7]</div>
    <div>[04][1][2][3][4][5][6][7]</div>
    <div>[05][1][2][3][4][5][6][7]</div>
</div>
`;

function Fl32_Leana_Front_Desk_Widget_WorkTime(spec) {

    return {
        template,
        data: function () {
            return {};
        },
        props: {},
        computed: {
            ...mapState({
                dateSelected: state => state.calendar.dateSelected,
            })
        },
        methods: {
            ...mapMutations({
                saveDateSelected: 'calendar/setDateSelected',
            }),
        },
        mounted() {
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_WorkTime;
