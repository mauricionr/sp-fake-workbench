(function ($) {
    debugger
    $.soap({
        url: 'https://192.168.134.27:91/ws/',//'http://192.168.134.27:91/ws/SCS00W02/'
        method: 'LISTALL',
        data: {
            CFILEMP: '',
        },
        success: function (soapResponse) {
            console.log(soapResponse)
        },
        error: function (SOAPResponse) {
            console.log(SOAPResponse)
        }
    });
})(jQuery)
