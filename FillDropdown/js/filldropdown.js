var ddComponent = (function (Vue, jQuery) {
    "use strict"
    var ddComponent = {
        template:
        '<select v-model="model[property]">\
            <option v-for="option in Store.options[storeKey]" :value="option.ID">\
                {{ option.NOME }}\
            </option>\
        </select>',
        methods: {
            applyResponse: function (data) {
                
            },
            loadData: function(){
                this.Store.callCRMWs({
                methodName: this.methodName,
                rowLimit: '500',
                params: this.params,
                key: this.storeKey
            })
            .done(this.applyResponse.bind(this));
            }
        },
        data: function () {
            var _data = {
                selected: '-1',
                Store: Store
            };
            return _data;
        },
        created: function () {
            this.loadData();
        },
        props: {
            methodName:{ type : String}, 
            storeKey:{ type : String},
            model:{ type : Object},
            property:{ type : String},
            params:{ type : Object},
            pais:{ type : String}
        },
        watch: {
            'pais': function (val, oldVal) {
                this.loadData();
            }
        }
    }
    return ddComponent;
})(Vue, jQuery, Store)