const i18next = self.teqfw.i18next;


i18next.addResourceBundle('lv', 'route-book', {
    action: {
        send: 'Nosūtīt'
    },
    email: 'Jūsu e-pasts',
    emailPH: 'e-pasts: user@domain.com',
    master: 'Meistars',
    masterLabel: {
        elena: 'Helena',
        natalie: 'Natalija',
    },
    masterSelect: 'Izvēlieties meistaru',
    name: 'Jūsu vārds',
    namePH: 'vārds: Līga Ozola',
    phone: 'Jūsu telefons',
    phonePH: 'telefons: 29101010',
    service: 'Pakalpojums',
    serviceLabel: {
        haircut_man: 'Vīriešu frizūra ({{time}})',
        haircut_women: 'Sieviešu frizūra ({{time}})',
        haircut_child: 'Bērnu frizūra ({{time}})',
        color_simple: 'Vienkārša krāsošana ({{time}})',
        color_complex: 'Kompleksa krāsošana ({{time}})',
        color_highlight: 'Izcelšana ({{time}})',
        perm: 'Perm ({{time}})',
    },
    serviceSelect: 'Izvēlieties pakalpojumu',
    title: 'Pierakstīties',
}, true);
i18next.addResourceBundle('ru', 'route-book', {
    action: {
        send: 'Отправить'
    },
    email: 'Ваш email',
    emailPH: 'email: user@domain.com',
    master: 'Мастер',
    masterLabel: {
        elena: 'Елена',
        natalie: 'Наталья',
    },
    masterSelect: 'Выберите мастера',
    name: 'Ваше имя',
    namePH: 'имя: Светлана Соколова',
    phone: 'Ваш телефон',
    phonePH: 'телефон: 29101010',
    service: 'Услуга',
    serviceLabel: {
        haircut_man: 'Стрижка мужская ({{time}})',
        haircut_women: 'Стрижка женская ({{time}})',
        haircut_child: 'Стрижка детская ({{time}})',
        color_simple: 'Окрашивание простое ({{time}})',
        color_complex: 'Окрашивание сложное ({{time}})',
        color_highlight: 'Мелирование ({{time}})',
        perm: 'Химическая завивка ({{time}})',
    },
    serviceSelect: 'Выберите услугу',
    title: 'Записаться',
}, true);

const template = `
<div>
    <h1>{{ $t('route-book:title') }}</h1>
    <form class="form_c1" onsubmit="return false">
        <div class="fld-name form_row">
            <div class="form_label">
                <span>{{ $t('route-book:name') }}:</span>
            </div>
            <div class="form_field">
                <input type="text" name="name" v-model="name" :placeholder="$t('route-book:namePH')">
            </div>
        </div>
        <div class="fld-phone form_row">
            <div class="form_label">
                <span>{{ $t('route-book:phone') }}:</span>
            </div>
            <div class="form_field">
                <input type="text" name="phone" v-model="phone" :placeholder="$t('route-book:phonePH')">
            </div>
        </div>
        <div class="fld-email form_row">
            <div class="form_label">
                <span>{{ $t('route-book:email') }}:</span>
            </div>
            <div class="form_field">
                <input type="text" name="email" v-model="email" :placeholder="$t('route-book:emailPH')">
            </div>
        </div>
        <div class="fld-service form_row">
            <div class="form_label">
                <span>{{ $t('route-book:service') }}:</span>
            </div>
            <div class="form_field">
                <select name="service" v-model="service">
                    <option disabled value="null">{{ $t('route-book:serviceSelect') }}</option>
                    <option v-for="(one) in serviceOptions" :value="one.id" :disabled="one.disabled">
                        {{ $t('route-book:serviceLabel.' + one.code, {time: one.duration}) }}
                    </option>
                </select>
            </div>
        </div>
        <div class="fld-master form_row" v-show="service && name && (phone || email)">
            <div class="form_label">
                <span>{{ $t('route-book:master') }}:</span>
            </div>
            <div class="form_field">
                <select name="master" v-model="master">
                    <option disabled value="null">{{ $t('route-book:masterSelect') }}</option>
                    <option v-for="(one) in masterOptions" :value="one.id" :disabled="one.disabled">
                        {{ $t('route-book:masterLabel.' + one.code) }}
                    </option>
                </select>
            </div>
        </div>
        <div class="fld-date form_row" v-show="master">
            <date-picker ref="datePicker"
                         :min="dpDateMin"
                         :max="dpDateMax"
                         :dates-disabled="dpDatesDisabled"
                         @selected="setDate"
            ></date-picker>
        </div>
        <div class="fld-time form_row" v-show="date">
            <div class="form_label">
                <span>{{ $t('route-book:time') }}:</span>
            </div>
            <div class="form_field">
                <time-picker ref="timePicker"
                             :entries="tpEntries"
                             @selected="setTime"
                ></time-picker>
            </div>
        </div>

        <div class="form_actions">
            <div>
                <button v-on:click="send" v-show="time">{{ $t('route-book:action.send') }}</button>
            </div>
        </div>
    </form>
</div>
`;

export default function Fl32_Leana_Realm_Pub_Route_Book(spec) {
    /** @type {TeqFw_Di_Container} */
    const container = spec.TeqFw_Di_Container$;
    /** @type {Fl32_Leana_Realm_Pub_Widget_DatePicker} */
    const datePicker = spec.Fl32_Leana_Realm_Pub_Widget_DatePicker$;
    /** @type {Fl32_Leana_Realm_Pub_Widget_TimePicker} */
    const timePicker = spec.Fl32_Leana_Realm_Pub_Widget_TimePicker$;
    /** @type {Fl32_Leana_Shared_Util_DateTime} */
    const utilDate = spec.Fl32_Leana_Shared_Util_DateTime$;
    /** @type {Fl32_Leana_Shared_Util_Mix} */
    const utilMix = spec.Fl32_Leana_Shared_Util_Mix$;

    return {
        template,
        components: {
            datePicker,
            timePicker
        },
        data: function () {
            return {
                date: null,
                email: null,
                master: null,
                name: null,
                phone: null,
                service: null,
                time: null,
                /** @type {Fl32_Leana_Shared_Api_Route_Book_State_Get_Response} */
                bookingState: null,
            };
        },
        computed: {
            masterOptions() {
                let result = [];
                if (this.bookingState && Array.isArray(this.bookingState.employees)) {
                    for (const one of this.bookingState.employees) {
                        if (Array.isArray(one.services) && one.services.includes(this.service)) {
                            result.push({id: one.id, code: one.code});
                        }
                    }
                }
                return result;
            },
            serviceOptions() {
                let result = [];
                if (this.bookingState && Array.isArray(this.bookingState.services)) {
                    for (const one of this.bookingState.services) {
                        const duration = utilDate.convertMinsToHrsMins(one.duration);
                        const option = {id: one.id, code: one.code, duration};
                        result.push(option);
                    }
                }
                return result;
            },
            dpDateMax() {
                return utilDate.forwardDate(21);
            },
            dpDateMin() {
                return new Date();
            },
            dpDatesDisabled() {
                const result = [];
                if (this.bookingState && Array.isArray(this.bookingState.employees)) {
                    const work = utilMix.getOptionPropById(this.bookingState.employees, this.master, 'workTime');
                    if (work) {
                        let date = this.dpDateMin;
                        let dateMax = this.dpDateMax;
                        while (date < dateMax) {
                            date = utilDate.forwardDate(1, date);
                            const formatted = utilDate.formatDate(date);
                            if (!work[formatted]) {
                                const disabled = utilDate.unformatDate(formatted);
                                result.push(disabled);
                            }
                        }
                    }
                }
                return result;
            },
            duration() {
                let result = null;
                if (this.service !== null) {
                    const option = utilMix.getOptionById(this.serviceOptions, this.service);
                    if (option && option.duration) {
                        result = utilDate.convertHrsMinsToMins(option.duration);
                    }
                }
                return result;
            },
            tpEntries() {
                /**
                 * Collect 'from' & 'to' times for booking intervals.
                 * @param {string} date YYYYMMDD
                 * @param {Fl32_Leana_Shared_Api_Data_Employee} employee
                 * @return {{booked: Object.<string, string>, bookedFroms: string[]}}
                 */
                function getBookedTime(date, employee) {
                    const booked = {};
                    const bookedTime = employee.bookedTime;
                    if (bookedTime[date]) {
                        for (const bookFromDb in bookedTime[date]) {
                            const bookToDb = bookedTime[date][bookFromDb].to;
                            const bookFrom = utilDate.convertDbHrsMinsToMins(bookFromDb);
                            const bookTo = utilDate.convertDbHrsMinsToMins(bookToDb);
                            booked[bookFrom] = bookTo;
                        }
                    }
                    const bookedFroms = Object.keys(booked).sort((a, b) => a - b);
                    return {booked, bookedFroms};
                }

                // MAIN FUNCTIONALITY
                const result = [];
                if (this.date && this.master && this.bookingState && Array.isArray(this.bookingState.employees)) {
                    const date = utilDate.formatDate(this.date);
                    const duration = this.duration;
                    /** @type {Fl32_Leana_Shared_Api_Data_Employee} */
                    const employee = utilMix.getOptionById(this.bookingState.employees, this.master);
                    const workTime = employee.workTime;
                    // employee has working hours for the date
                    if (workTime[date]) {
                        const {from: workFromDb, to: workToDb} = workTime[date];
                        // begin & end of the working day
                        let workFrom = utilDate.convertDbHrsMinsToMins(workFromDb);
                        const workTo = utilDate.convertDbHrsMinsToMins(workToDb);
                        const {booked, bookedFroms} = getBookedTime(date, employee);
                        let bookFrom = Number.parseInt(bookedFroms.shift());
                        while (workFrom < workTo) {
                            const intervalEnd = workFrom + duration;
                            if (bookFrom && (intervalEnd > bookFrom)) {
                                // planned interval overlays already booked interval,
                                // set workFrom to the end of booked interval
                                workFrom = Number.parseInt(booked[bookFrom]);
                                // shift booked interval
                                bookFrom = Number.parseInt(bookedFroms.shift());
                            } else {
                                // no booked interval or end of planned interval is less than start of booked interval
                                const id = workFrom;
                                const labelFrom = utilDate.convertMinsToHrsMins(workFrom);
                                const labelTo = utilDate.convertMinsToHrsMins(intervalEnd);
                                const label = `${labelFrom}-${labelTo}`;
                                result.push({id, label});
                                workFrom = intervalEnd;
                            }
                        }
                    }
                }
                return result;
            }
        },
        methods: {
            /**
             * Handler for datePicker's event.
             *
             * @param {Date} date
             */
            setDate(date) {
                this.date = date;
            },
            /**
             * Handler for timePicker's event.
             *
             * @param {number} id
             */
            setTime(id) {
                this.time = id;
            },
            async send() {
                // get local variable with 'date' value
                const date = new Date(this.date.getTime());
                const hm = utilDate.convertMinsToHrsMins(this.time);
                const [hours, minutes] = hm.split(':');
                date.setHours(Number.parseInt(hours), Number.parseInt(minutes));
                /** @type {Fl32_Leana_Shared_Api_Route_Book_Save_Request} */
                const data = await container.get('Fl32_Leana_Shared_Api_Route_Book_Save_Request$');
                data.date = date;
                data.duration = this.duration;
                data.email = this.email;
                data.lang = i18next.language;
                data.masterId = this.master;
                data.name = this.name;
                data.phone = this.phone;
                data.serviceId = this.service;
                const res = await fetch('../api/book/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({data})
                });
                const result = await res.json();
                // result in the response is the same data if succeed
                if (result.data.name === this.name) {
                    this.name = null;
                    this.email = null;
                    this.phone = null;
                    this.service = null;
                    this.master = null;
                    this.date = null;
                    this.time = null;
                }
            }
        },
        async mounted() {
            // DEFINE INNER FUNCTIONS
            async function _loadData() {
                const res = await fetch('../api/book/state/get', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return await res.json();
            }

            // MAIN FUNCTIONALITY
            const {data} = await _loadData();
            this.bookingState = data;
        }
    };
}
