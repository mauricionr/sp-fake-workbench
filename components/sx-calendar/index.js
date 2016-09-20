(function (Vue) {
    'use strict'

    var Calendar = {
        data: function () {
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var dates = ['sun', 'mon','tue','wed','thu','fri','sat'];
            return {
                cache: {},
                label: months[new Date().getMonth()] + ' ' + new Date().getFullYear(),
                months: months,
                dates: dates,
                calendar: [],
            }
        },
        methods: {
            switchMonth: function switchMonth(next, month, year) {
                var curr = this.label.split(" "), calendar, tempYear = parseInt(curr[1], 10);
                month = month || ((next) ? ((curr[0] === "December") ? 0 : this.months.indexOf(curr[0]) + 1) : ((curr[0] === "January") ? 11 : this.months.indexOf(curr[0]) - 1));
                year = year || ((next && month === 0) ? tempYear + 1 : (!next && month === 11) ? tempYear - 1 : tempYear);

                if (!month) {
                    if (next) {
                        if (curr[0] === "December") {
                            month = 0;
                        } else {
                            month = this.months.indexOf(curr[0]) + 1;
                        }
                    } else {
                        if (curr[0] === "January") {
                            month = 11;
                        } else {
                            month = this.months.indexOf(curr[0]) - 1;
                        }
                    }
                }
                if (!year) {
                    if (next && month === 0) {
                        year = tempYear + 1;
                    } else if (!next && month === 11) {
                        year = tempYear - 1;
                    } else {
                        year = tempYear;
                    }
                }

                calendar = this.createCal(year, month);
                calendar.month = month;
                calendar.year = year;
                Vue.set(this._data, 'calendar', calendar)
                Vue.set(this._data, 'label', calendar.label)
            },
            createCal: function createCal(year, month) {
                var day = 1, i, j, haveDays = true,
                    startDay = new Date(year, month, day).getDay(),
                    daysInMonths = [31, (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
                    calendar = [];

                if (this.cache[year]) {
                    if (this.cache[year][month]) {
                        return this.cache[year][month];
                    }
                } else {
                    this.cache[year] = {};
                }

                i = 0;

                while (haveDays) {
                    calendar[i] = [];
                    for (j = 0; j < 7; j++) {
                        if (i === 0) {
                            if (j === startDay) {
                                calendar[i][j] = day++;
                                startDay++;
                            }
                        } else if (day <= daysInMonths[month]) {
                            calendar[i][j] = day++;
                        } else {
                            calendar[i][j] = "";
                            haveDays = false;
                        }
                        if (day > daysInMonths[month]) {
                            haveDays = false;
                        }
                    }
                    i++;
                }

                this.cache[year][month] = {
                    data: calendar,
                    calendar: function () {
                        return calendar.clone()
                    },
                    label: this.months[month] + " " + year
                };
                return this.cache[year][month];
            }
        },
        ready: function () {
            this.switchMonth(null, new Date().getMonth(), new Date().getFullYear());
        }
    };

    var CalendarComponent = Vue.extend({
        mixins: [Calendar],
        data: function () {
            return {
                Calendar: Calendar
            }
        },
        template: ['<div id="cal">',
                        '<div class="header">',
                            '<span class="left button" id="prev" v-on:click="switchMonth(false);"> &lang; </span>',
                            '<span class="left hook"></span>',
                            '<span class="month-year" id="label"> {{label}} </span>',
                            '<span class="right hook"></span>',
                            '<span class="right button" id="next" v-on:click="switchMonth(true);"> &rang; </span>',
                        '</div>',
                        '<table id="days">',
                            '<thead>',
                                '<td v-for="date in dates">{{date}}</td>',
                            '</thead>',
                        '</table>  ',
                        '<div id="cal-frame">',
                            '<table class="curr">',
                                '<tbody>',
                                    '<tr v-for="semana in calendar.data">',
                                        '<td v-for="dia in semana" class="{{!dia ? \'nil\': \'\'}}{{dia === new Date().getDate() && new Date().getMonth() === calendar.month ? \'today\' : \'\'}}">',
                                        '{{dia}}',
                                        '</td>',
                                    '</tr>',
                                '</tbody>',
                            '</table>',
                        '</div>',
                    '</div>'].join('')
    })

    new Vue({
        el: '#sxCalendarApp',
        components:{
            'sx-calendar':CalendarComponent
        }
    });

})(Vue)