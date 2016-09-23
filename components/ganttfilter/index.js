(function (Vue, $) {
    'use strict'
    Vue.config.devtools = true
    var GanttFilterTemplate = [
        '<div id="gantt-filter">',
        '<h1>Filtrar por:</h1>',
        '<div class="fieldsToAdd">',
        '<select v-model="fieldstoFilter" multiple v-on:change="updateFiltersToFilter()">',
        '<option v-for="field in listProperties">{{field}}</option>',
        '</select>',
        '</div>',
        '<div class="filter">',
        '<select v-for="field in fields" v-model="filters[field]">',
        '<option v-for="item in items">{{item[field].Title || item[field]}}</option>',
        '</select>',
        '<input type="button" value="Filtrar" v-on:click="applyFilter()"/>',
        '</div>',
        '</div>'
    ].join('');

    var GanttFilter = Vue.extend({
        props: ['list', 'fields'],
        data: function () {
            return {
                items: [],
                listProperties: this.fields,
                queryString: decodeURIComponent(window.location.search).split('&'),
                filterFields: [],
                othersParams: [],
                FilterField: 'FilterField',
                FilterValue: 'FilterValue',
                fieldstoFilter: []
            }
        },
        created: function () {
            this.removeStartQueryString()
            this.filterFieldsOrValue = this.queryString.filter(this.filterFilterField.bind(this))
            this.othersParams = this.queryString.filter(this.filterOthersParams.bind(this))
            if (this.filterFieldsOrValue.length) {
                this.applyIntoFilters()
            }
            this.getItems()
        },
        methods: {
            getRequest: function (url) {
                return $.ajax({
                    headers: { "Content-Type": "application/json; odata=verbose", "Accept": "application/json; odata=verbose" },
                    url: url
                })
            },
            updateFiltersToFilter: function () {
                this.$set('filters', this.fields.reduce(function (retorno, current) {
                    if (this.fieldstoFilter.indexOf(current) === -1) {
                        delete this.filters[current]
                    }
                    return retorno;
                }.bind(this), this.filters))
            },
            applyIntoFilters: function () {
                this.filters = this.filterFieldsOrValue.reduce(function (retorno, current, index, array) {
                    this.fieldstoFilter.push(current.split('=')[1])
                    retorno[current.split('=')[1]] = array[index + 1].split('=')[1]
                    array.splice(index, 1)
                    return retorno;
                }.bind(this), {})
            },
            removeStartQueryString: function () {
                this.queryString = this.queryString.map(function (current) {
                    if (current.indexOf('?') > -1) {
                        current = current.slice(1)
                    }
                    return current;
                })
            },
            filterFilterField: function (current, index, array) {
                if ((current.indexOf(this.FilterField) > -1 || current.indexOf(this.FilterValue) > -1) && current) {
                    return current;
                }
            },
            filterOthersParams: function (current, index, array) {
                if ((current.indexOf(this.FilterField) === -1 && current.indexOf(this.FilterValue) === -1) && current) {
                    return current;
                }
            },
            applyFilter: function () {
                var index = 1;
                this.queryString = [];
                for (var key in this.filters) {
                    this.queryString.push(this.FilterField + index + '=' + key)
                    this.queryString.push(this.FilterValue + index + '=' + this.filters[key]);
                    index++
                }
                return window.location.search = this.queryString.join('&') + '&' + this.othersParams.join('&')
            },
            getItems: function () {
                this.getRequest(
                    _spPageContextInfo.webAbsoluteUrl +
                    "/_api/web/lists/getbytitle('" +
                    this.list +
                    "')/items?$select=*,Editor/Title,Author/Title&$expand=Editor/Title,Author/Title")

                    .done(function (response) {
                        this.$set('items', response.d.results)
                    }.bind(this))
            }
        },
        template: GanttFilterTemplate
    })

    Vue.component('sx-gantt-filter', GanttFilter)

    new Vue({
        el: '#sxGanttApp',
        components: {
            'sx-gantt-filter': GanttFilter
        }
    })
})(Vue, jQuery)