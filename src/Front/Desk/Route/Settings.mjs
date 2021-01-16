const i18next = self.teqfw.i18next;
const mapMutations = self.teqfw.lib.Vuex.mapMutations;
const mapState = self.teqfw.lib.Vuex.mapState;

i18next.addResources('lv', 'routeSettings', {
    btnExecute: 'Izpildīt',
    lang: 'Vāloda',
    msgCacheCleanFailed: 'Kešatmiņa tīrīšana neizdevās.',
    msgCacheCleanSuccess: 'Kešatmiņa ir notīrīta.',
    sectionLang: 'Valodas izvēle',
    sectionSw: 'Service Worker iestatījumi',
    swCacheClean: 'Kešatmiņa tīrīšana',
    swCacheState: 'Kešatmiņas stāvoklis',
    swCacheStateDisabled: 'Atspējots',
    swCacheStateEnabled: 'Iespējots',
});
i18next.addResources('ru', 'routeSettings', {
    btnExecute: 'Выполнить',
    lang: 'Язык',
    msgCacheCleanFailed: 'Ошибка при очистке кэша.',
    msgCacheCleanSuccess: 'Кэш очищен.',
    sectionLang: 'Выбор языка',
    sectionSw: 'Настройки Service Worker\'а',
    swCacheClean: 'Очистка кэша',
    swCacheState: 'Состояние кэша',
    swCacheStateDisabled: 'Отключен',
    swCacheStateEnabled: 'Включен',
});


const template = `
<div class="wgSettings">
    <div class="layout_centered">
        <div>
            <form class="edit" onsubmit="return false">
            
                <div class="id-lang section">
                    <div>{{ $t('routeSettings:sectionLang') }}</div>
                </div>        
    
                <div class="id-lang row">
                    <div class="label">
                        <span>{{ $t('routeSettings:lang') }}:</span>
                    </div>
                    <div class="field fieldRadio">
                        <div class="radioLine">
                            <input  type="radio" id="setLangLv" value="lv-LV" 
                                v-model="lang" v-on:click="langSetLv">
                            <label for="setLangLv">LV</label>
                        </div>
                        <div class="radioLine">
                            <input type="radio" id="setLangRu" value="ru-RU" 
                                v-model="lang" v-on:click="langSetRu">
                            <label for="setLangRu">RU</label>
                        </div>
                    </div>
                </div>       
                
                <div class="id-sw section">
                    <div>{{ $t('routeSettings:sectionSw') }}</div>
                </div>                  
    
                <div class="id-cacheState row">
                    <div class="label">
                        <span>{{ $t('routeSettings:swCacheState') }}:</span>
                    </div>
                    <div class="field fieldRadio">
                        <div class="radioLine" >
                            <input  type="radio" id="setSwCacheStateOn" value="true" 
                                v-model="cacheState" v-on:click="swCacheEnable">
                            <label for="setSwCacheStateOn">{{$t('routeSettings:swCacheStateEnabled')}}</label>
                        </div>
                        <div class="radioLine">
                            <input type="radio" id="setSwCacheStateOff" value="false" 
                                v-model="cacheState" v-on:click="swCacheDisable">
                            <label for="setSwCacheStateOff">{{$t('routeSettings:swCacheStateDisabled')}}</label>
                        </div>
                    </div>
                </div>                  
    
                <div class="id-cacheClean row">
                    <div class="label">
                        <span>{{ $t('routeSettings:swCacheClean') }}:</span>
                    </div>
                    <div class="field">
                        <div class="message" v-show="showMessage">{{ message }}</div>
                        <button v-on:click="swCacheClean">{{$t('routeSettings:btnExecute')}}</button>
                    </div>
                </div>
            
            </form>
        </div>
    </div>
</div>
`;

function Fl32_Leana_Front_Desk_Route_Settings(spec) {
    /** @type {Fl32_Leana_Defaults} */
    const DEF = spec['Fl32_Leana_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_User_Defaults} */
    const DEF_USER = spec['Fl32_Teq_User_Defaults$'];   // singleton instance
    /** @type {Fl32_Teq_Acl_Front_App_Session} */
    const session = spec[DEF_USER.DI_SESSION];  // named singleton
    /** @type {Fl32_Leana_Front_Gate_Sw_Cache_Clean} */
    const gateCacheClean = spec['Fl32_Leana_Front_Gate_Sw_Cache_Clean$'];   // singleton instance
    /** @type {Fl32_Leana_Front_Gate_Sw_Cache_Disable} */
    const gateCacheDisable = spec['Fl32_Leana_Front_Gate_Sw_Cache_Disable$'];   // singleton instance
    /** @type {Fl32_Leana_Front_Gate_Sw_Cache_Enable} */
    const gateCacheEnable = spec['Fl32_Leana_Front_Gate_Sw_Cache_Enable$'];   // singleton instance
    /** @type {Fl32_Leana_Front_Gate_Sw_Cache_State} */
    const gateCacheState = spec['Fl32_Leana_Front_Gate_Sw_Cache_State$'];   // singleton instance
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Sw_Cache_Clean_Request} */
    const CacheCleanReq = spec['Fl32_Leana_Shared_Service_Route_Sw_Cache_Clean#Request'];   // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Sw_Cache_Disable_Request} */
    const CacheDisableReq = spec['Fl32_Leana_Shared_Service_Route_Sw_Cache_Disable#Request'];   // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Sw_Cache_Enable_Request} */
    const CacheEnableReq = spec['Fl32_Leana_Shared_Service_Route_Sw_Cache_Enable#Request'];   // class constructor
    /** @type {typeof Fl32_Leana_Shared_Service_Route_Sw_Cache_State_Request} */
    const CacheStateReq = spec['Fl32_Leana_Shared_Service_Route_Sw_Cache_State#Request'];   // class constructor


    return {
        name: 'RouteSettings',
        template,
        data() {
            return {
                lang: null,
                message: null,
                showMessage: false,
                cacheState: null,
            };
        },
        computed: {
            ...mapState({
                stateAppLang: state => state.app.lang,
            }),
        },
        methods: {
            hideMessage() {
                setTimeout(() => {
                    this.message = '';
                    this.showMessage = false;
                }, 2000);
            },
            async langSetLv() {
                await i18next.changeLanguage('lv-LV');
                this.setStateAppLang('lv-LV');  // refresh navigator
            },
            async langSetRu() {
                await i18next.changeLanguage('ru-RU');
                this.setStateAppLang('ru-RU');  // refresh navigator
            },
            async swCacheClean() {
                /** @type {Fl32_Leana_Shared_Service_Route_Sw_Cache_Clean_Response} */
                const res = await gateCacheClean(new CacheCleanReq());
                if (res.success) {
                    this.message = this.$t('routeSettings:msgCacheCleanSuccess');
                    this.swCacheState();    // async
                } else {
                    this.message = this.$t('routeSettings:msgCacheCleanFailed');
                }
                this.showMessage = true;
                this.hideMessage();
            },
            async swCacheDisable() {
                /** @type {Fl32_Leana_Shared_Service_Route_Sw_Cache_Disable_Response} */
                const res = await gateCacheDisable(new CacheDisableReq());
                if (res.success) this.cacheState = false;
            },
            async swCacheEnable() {
                /** @type {Fl32_Leana_Shared_Service_Route_Sw_Cache_Enable_Response} */
                const res = await gateCacheEnable(new CacheEnableReq());
                if (res.success) this.cacheState = true;
            },
            async swCacheState() {
                /** @type {Fl32_Leana_Shared_Service_Route_Sw_Cache_State_Response} */
                const res = await gateCacheState(new CacheStateReq());
                this.cacheState = res.state;
            },
            ...mapMutations({
                setStateAppLang: 'app/setLang'
            }),
        },
        async mounted() {
            if (await session.isAccessGranted(this.$router, DEF.ACL_IS_EMPLOYEE)) {
                this.lang = (i18next.language === 'ru-RU') ? 'ru-RU' : 'lv-LV';
                await this.swCacheState();
            }
        }
    };
}

// We should place function separately to allow JSDoc & IDEA hints & navigation.
export default Fl32_Leana_Front_Desk_Route_Settings;
