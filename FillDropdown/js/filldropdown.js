"use strict"

var ddComponent = {
    template:
    '<select>\
        <option v-for="option in options" v-bind:value="option.value">\
        {{ option.text }}\
        </option>\
    </select>',
    data: function(){
        var _data = {
            selected: '-1',
            options: [
                { text: 'Selecione', value: '-1' }
            ]
        };
        return _data;
    },
    ready: function(){
        var component = this;

        store.callCRMWs({
            methodName : component.methodName,
            rowLimit : '500'
        })
        .done(function(data){
            var parsedJson = JSON.parse(data);
            
            if(!parsedJson.Data.Error){
                var rows = parsedJson.Data.rows.row;
                for(var i = 0; i < rows.length; i++){
                    component.options.push({
                        text: rows[i].NOME,
                        value:rows[i].ID
                    });
                }   
            }
            else{
                Utils.threatError(data);
            }
        });
    },
    props: ['method-name']
}

Vue.component("filled-dropdown",ddComponent);