class Fl32_Leana_Front_Desk_Widget_Action_Api_Item {
    /** @type {String} action code (for devs only) */
    code;
    /** @type {Boolean} */
    disabled;
    /** @type {Function} */
    func;
    /** @type {String} "far fa-calendar-plus" */
    icon;
}

class Fl32_Leana_Front_Desk_Widget_Action_Api_Bar {
    /** @type {Object.<String, Fl32_Leana_Front_Desk_Widget_Action_Api_Item>} */
    items;
}

export {
    Fl32_Leana_Front_Desk_Widget_Action_Api_Bar as Bar,
    Fl32_Leana_Front_Desk_Widget_Action_Api_Item as Item,
};
