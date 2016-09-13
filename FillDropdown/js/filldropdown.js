var ddComponent = (function (Vue, jQuery) {
    "use strict"
    var ddComponent = {
        template:
        '<select v-model="{{model[property]}}">\
            <option v-for="option in Store.options[storeKey]" v-bind:value="option.ID">\
                {{ option.NOME }}\
            </option>\
        </select>',
        methods: {
            applyResponse: function (data) {
                
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
        props: ['method-name', 'store-key', 'model', 'property', 'parameters']
    }
    return ddComponent;
})(Vue, jQuery, Store)