var RelatorioAPI = (function (Vue, pnp) {
    pnp.setup({
        headers: {
            "Accept": "application/json; odata=verbose"
        }
    });
    function generateData() {
        var metas = pnp.sp.web.lists.getByTitle('Metas');
        var revisoes = pnp.sp.web.lists.getByTitle('Revisoes');        
        return pnp.sp.web.lists.getByTitle('PDI').items.orderBy("ID").top(1).getPaged().then(function (d) {
            debugger
            console.log('Total de items: ', d.length)
            return d.forEach(function (current, index, array) {
                console.log('Item ', current.Title)
                add(0, 4, index, metas, { Title: `Meta ${index}`, PDIId: current.Id }, pnp.sp.createBatch())
                add(0, 1, index, revisoes, { Title: `Revisao ${index}`, PDIId: current.Id }, pnp.sp.createBatch())
            })
        })
    }
    function add(start, limit, index, list, d, batch){
        if(limit > 24) throw Error('Limit cannot be greater than 24')
        while (start <= limit) {
            list.items.inBatch(batch).add(d)
            start++
        }
        console.log('Executing batch: ', Title, ' ', d.PDIId)
        return batch.execute();
    }
    function cleanList(Title){
        pnp.sp.web.lists.getByTitle(Title).items.top(4999).get().then(function(response){
            response.forEach(function(current){
                pnp.sp.web.lists.getByTitle(Title).items.getById(current.Id).delete()
            })
        })
    }
    return {
        generateData:generateData,
        cleanList:cleanList
    }
})(Vue, $pnp);