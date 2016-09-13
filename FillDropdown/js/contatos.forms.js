(function (Vue, jQuery) {
    new Vue({
        el: '#contato',
        components: { "filled-dropdown" : ddComponent },
        data: { Store : Store }
    });
})(Vue, jQuery)