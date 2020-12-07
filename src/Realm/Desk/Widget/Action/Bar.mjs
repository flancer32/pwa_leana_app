const template = `
<div class="action_bar">
    <action 
        v-for="one in Object.values(actions)"
        :params="one"
    ></action>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Widget_Action_Bar(spec) {
    /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Item} */
    const action = spec.Fl32_Leana_Realm_Desk_Widget_Action_Item$;   // singleton
    const Bar = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Bar']; // class

    return {
        template,
        props: {
            /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Bar} */
            params: Bar
        },
        components: {
            action
        },
        computed: {
            actions() {
                return this.bar.items || {};
            },
            /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Bar} */
            bar() {
                return this.params || {};
            }
        }
    };
}
