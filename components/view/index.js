(function(Vue, pnp){
    pnp.setup({ headers: { "Accept": "application/json" } });
    new Vue({
        el:'#view-item',
        data:function(){
            return {
                loading:true
            }
        },
        methods:{
            getItem:function(id){
                return pnp.sp.web.lists.getByTitle('Batch').items.getById(id).get()
            }
        },
        created:function(){
            this.getItem(10).then(function(response){
                Vue.set(this, 'item', response)
                Vue.set(this, 'loading', false)
            }.bind(this))
        }
    })
})(Vue, $pnp)