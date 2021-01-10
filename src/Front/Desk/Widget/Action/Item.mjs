const template = `
<div class="action_bar_item">
    <div v-on:click="onClick">
        <i :class="item.icon + ' fa-2x filter-top-fg'"></i>  
    </div>
</div>
`;

function Fl32_Leana_Front_Desk_Widget_Action_Item(spec) {
    /** @type {typeof Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
    const Item = spec['Fl32_Leana_Front_Desk_Widget_Action_Api#Item'];  // class constructor

    return {
        template,
        props: {
            /** @type {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
            params: Item
        },
        computed: {
            /** @return {Fl32_Leana_Front_Desk_Widget_Action_Api_Item} */
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

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Widget_Action_Item;
