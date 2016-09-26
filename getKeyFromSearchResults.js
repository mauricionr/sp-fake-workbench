function getKeyFromSearchResults(key, retorno, current) {
    if (current.Key === key) {
        retorno = current.Value || '';
    }
    return retorno;
}



//ex:

/**
 * 
 * var valor = Cell.results.reduce(getKeyFromSearchResults.bind(null, 'Title'))
 */