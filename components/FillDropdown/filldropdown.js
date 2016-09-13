var ddComponent = (function (Vue, jQuery) {
    "use strict"

    var ddComponent = {
        template:
        '<select v-model="model[property]">\
            <option v-for="option in options" v-bind:value="option.value">\
            {{ option.text }}\
            </option>\
        </select>',
        methods: {
            applyResponse: function (data) {
                debugger;
                var parsedJson = JSON.parse(data);
                if (!parsedJson.Data.Error) {
                    var rows = parsedJson.Data.rows.row;
                    for (var i = 0; i < rows.length; i++) {
                        this.options.push({
                            text: rows[i].NOME,
                            value: rows[i].ID
                        });
                    }
                }
                else {
                    Utils.threatError(data);
                }
            }
        },
        data: function () {
            var _data = {
                selected: '-1',
                options: [
                    { text: 'Selecione', value: '-1' }
                ],
                Store: Store
            };
            return _data;
        },
        created: function () {
            this.Store.callCRMWs({
                methodName: this.methodName,
                rowLimit: '500',
                params:this.parameters,
                key:this.storeKey
            })
            .done(this.applyResponse.bind(this));
        },
        props: ['method-name', 'storeKey', 'model', 'property', 'parameters']
    }

    Vue.component("filled-dropdown", ddComponent);

    return ddComponent;
})(Vue, jQuery, Store)