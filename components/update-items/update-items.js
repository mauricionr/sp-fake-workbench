
/**
 * Criar um batch para popular o campo DataPublicacao da lista Noticias com a data de 21/09/2016

http://www.bmalaw.com.br/Lists/Noticias/AllItems.aspx﻿

bmasite\sp_admin

adm$p@bma
 */


'use strict';

$pnp.setup({
    headers: {
        "Accept": "application/json; odata=verbose"
    }
});

const NoticiasList = 'Notícias e Publicações'

const updateItems = () => {
    let promises = []
    $pnp.sp.web.lists.getByTitle(NoticiasList).items.top(4000).get().then(response => {
        promises = response.reduce((retorno, current) => {
            retorno.push($pnp.sp.web.lists.getByTitle(NoticiasList).items.getById(current.Id).update({
                DataPublicacao: new Date(2016, 8, 21).toISOString()
            }))
            return retorno;
        }, promises)

        Promise.all(promises)
            .then(response => console.log(response.d.ID))
            .catch(error => console.log(Error(error)))
    })
}