"use strict"

var store = {
    wsUrl : "/_vti_bin/PNA.CRM.Components/Data.svc/GetJson",
    callCRMWs : function(options){
         var wsData = 
         { 
            "Name": options.methodName, 
            "Parameters": 
            JSON.stringify([
                {Name:"NOME",Value:"%%"},
                {Name:"RowspPage",Value: options.rowLimit || 50},
                {Name:"PageNumber", Value: options.page || 1}
            ])
        } ;
         
         var dfd = $.ajax({ 
              type: "GET", 
              url: store.wsUrl, 
              dataType: 'json', 
              data: wsData, 
              contentType: "application/json; charset=utf-8"
         })
         .fail(function(data){
             Utils.threatError(data);
         });
         return dfd.promise();
    }    
};

