const template = `
<div class="action_bar_item">
    <div v-on:click="onClick">
        <i :class="item.icon + ' fa-2x filter-top-fg'" :title="item.title"></i>  
    </div>
</div>
`;

export default function Fl32_Leana_Realm_Desk_Widget_Action_Item(spec) {
    const Item = spec['Fl32_Leana_Realm_Desk_Widget_Action_Api#Item'];

    return {
        template,
        props: {
            /** @type {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
            params: Item
        },
        computed: {
            /** @return {Fl32_Leana_Realm_Desk_Widget_Action_Api_Item} */
            item() {
                return this.params;
            }
        },
        methods: {
            onClick() {
                if (!this.item.disabled) {
                    this.item.func();
                }
            }
        },
    };
}
