var ContratoStore = (function (pnp) {
    pnp.setup({ headers: { "Accept": "application/json; odata=verbose" } });
    return {
        root: 'ContratosAditivos',
        createContratoFolder: function (path) {
            return pnp.sp.web.folders.getByName(this.root).folders.add(path)
        },
        createAditivoFolder: function (ContratoTitle, path) {
            return pnp.sp.web.folders.getByName(this.root).folders.getByName(ContratoTitle).folders.add(path)
        },
        checkContratoFolderExist: function (path) {
            return pnp.sp.site.rootWeb.getFolderByServerRelativeUrl(_spPageContextInfo.webServerRelativeUrl + path).get()
        },
    }
})($pnp);