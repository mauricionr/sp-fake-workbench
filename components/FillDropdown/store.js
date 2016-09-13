var Store = (function (Vue, $) {
    "use strict"
    return {
        options:{
            paises:null
        },
        wsUrl: "http://dev-pna-crm.simbiox.com.br/_vti_bin/PNA.CRM.Components/Data.svc/GetJson",
        Parameters: function (options) {
            var Parameters = [
                { Name: "NOME", Value: "%%" },
                { Name: "RowspPage", Value: options.rowLimit || 50 },
                { Name: "PageNumber", Value: options.page || 1 }
            ]
            if (options.params) {
                Parameters = [].concat(Parameters, options.params);
            }
            return {
                "Name": options.methodName,
                "Parameters":
                JSON.stringify(Parameters)
            };
        },
        callCRMWs: function (options, key) {
                var dfd = $.ajax({
                    type: "GET",
                    url: this.wsUrl,
                    dataType: 'json',
                    data: this.Parameters(options),
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response){
                    this.options[key] = response
                }.bind(this))
                .fail(function (data) {
                    Utils.threatError(data);
                });
            return dfd.promise();
        }
    };
})(Vue, jQuery)
