var RelatorioAPI = (function (pnp) {
    pnp.setup({headers: {"Accept": "application/json; odata=verbose"}});

    function Util(){
        function generateData() {        
            return pnp.sp.web.lists.getByTitle('PDI').items.orderBy("ID").top(4500).get().then(function (d) {
                console.log('Total de items: ', d.length)
                d.map(function (current, index) {
                    setTimeout(function(current, index){
                        console.log('Item ', current.Title)
                        add(0, 4, index, pnp.sp.web.lists.getByTitle('Metas'), { Title: `Meta ${index}`, PDIId: current.Id }, pnp.sp.createBatch())
                        add(0, 1, index, pnp.sp.web.lists.getByTitle('Revisoes'), { Title: `Revisao ${index}`, PDIId: current.Id }, pnp.sp.createBatch())
                    }.bind(null, current, index), (index * 1000))
                })
            })
        }
        function add(start, limit, index, list, d, batch){
            while (start <= limit) {
                list.items.add(d)
                start++
            }
        }
        function cleanList(Title){
            pnp.sp.web.lists.getByTitle(Title).items.top(5000).get().then(function(response){
                response.forEach(function(current){
                    pnp.sp.web.lists.getByTitle(Title).items.getById(current.Id).delete()
                })
            })
        }
    }
    function getData(top){
        return new Promise(function(resolve, reject){
            var promises = [];
            promises.push(pnp.sp.web.lists.getByTitle('PDI').items.top(top).get())
            promises.push(pnp.sp.web.lists.getByTitle('Metas').items.top(top).get())
            promises.push(pnp.sp.web.lists.getByTitle('Revisoes').items.top(top).get())        
            Promise.all(promises).then(function(response){
                resolve({PDIs:response[0], Metas:response[1], Revisoes:response[2]})
            })
        })
    }
    function mapData(responses){
        return responses.PDIs.map(function(current){
            current.Revisoes = responses.Revisoes.filter(findPdiItem.bind(null, current))
            current.Metas = responses.Metas.filter(findPdiItem.bind(null, current))
            return current;
        })
    }
    function findPdiItem(current, item){
        return item.PDIId === current.Id
    }
    return {
        Util: Util,
        getData: getData,
        mapData: mapData
    }
})($pnp);

(function(Vue, RelatorioAPI){
    new Vue({
        el: '#app',
        data:function(){
            return {
                RelatorioAPI: RelatorioAPI,
                loading:true,
                data:[]
            }
        },
        created:function(){
            this.RelatorioAPI
                .getData(5000)
                .then(this.RelatorioAPI.mapData)
                .then(this.setData)
        },
        methods:{
            setData:function(pdis){
                Vue.set(this, 'data', pdis)
                Vue.set(this, 'loading', false)
            }
        },
        template:`
            <h4>Relatorio de PDI</h4>
            <div v-if="loading">Loading...</div>
            <table v-if="!loading">
                <tr v-if="data.length === 0">
                    <td colspan="3">Nenhum item encontrado</td>
                </tr>
                <tr v-for="item in data">
                    <td>PDI {{item.Id}}</td>
                    <td>
                        <table>
                            <tr v-for="meta in item.Metas">
                                <td>Meta do PDI {{meta.PDIId}}</td>
                            </tr>
                        </table>
                    </td>
                    <td>
                         <table>
                            <tr v-for="revisao in item.Revisoes">
                                <td>Revisao do PDI {{revisao.PDIId}}</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        `
    })

})(Vue, RelatorioAPI);