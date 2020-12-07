/**
 * Widget to add/edit task in desk realm.
 */
const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;

i18next.addResources('lv', 'taskPreview', {});
i18next.addResources('ru', 'taskPreview', {
    customer: 'Клиент',
    email: 'Email',
    employee: 'Мастер',
    notes: 'Заметки',
    phone: 'Телефон',
    service: 'Задача',
    task: 'Задача',
    time: 'Время',
    title: 'Новая запись',
});

const template = `
<div class="">
    <actions></actions>
    <h1>{{$t('taskPreview:title')}}</h1>
    <form class="edit" onsubmit="return false">
    
        <div class="row">
            <div class="label">
                <span>{{ $t('taskPreview:customer') }}:</span>
            </div>
            <div class="field">
                 <input>
            </div>
        </div>    
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskPreview:email') }}:</span>
            </div>
            <div class="field">
                 <input>
            </div>
        </div>   
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskPreview:phone') }}:</span>
            </div>
            <div class="field">
                 <input>
            </div>
        </div>
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskPreview:time') }}:</span>
            </div>
            <div class="field">
                 <input>
            </div>
        </div>
        
        <div class="row">
            <div class="label">
                <span>{{ $t('taskPreview:employee') }}:</span>
            </div>
            <div class="field">
                 <input>
            </div>
        </div>
        
    </form>
</div>
`;
/**
 * Widget to add/edit task in desk realm.
 */
export default function Fl32_Leana_Realm_Desk_Widget_Task_Edit(spec) {
    const wgActions = spec.Fl32_Leana_Realm_Desk_Widget_Task_Edit_Actions$;
    const Task = spec['Fl32_Leana_Realm_Desk_Widget_Api_Task#'];
    return {
        template,
        components: {actions: wgActions},
        props: {
            /** @type {Fl32_Leana_Realm_Desk_Widget_Api_Task} */
            params: new Task()
        },
        computed: {},
        methods: {
            actionClose() {
                this.resetOverlay();
            },
            ...mapMutations({
                resetOverlay: 'app/resetOverlay',
            }),
        }
    };
}
