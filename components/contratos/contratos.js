var ContratoStore = (function (pnp) {
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

var ContratoMixins = (function (Vue, $) {
    return {
        methods: {
            originalSave: function (response) {
                Vue.set(this, 'createdNow', true)
                $(this.originalBtnSave).click()
            },
            notExistFolder: function (error) {
                Vue.set(this, 'folderAlredyExist', false)
            },
            setFolderAlredyExist: function (response) {
                Vue.set(this, 'folderAlredyExist', true)
            }
        },
        created: function () {
            $(this.initializeNewForm.bind(this))
        },
    }
})(Vue, jQuery)

var ContratosAPI = (function (Vue, $, pnp, ContratoStore, ContratoMixins) {
    pnp.setup({ headers: { "Accept": "application/json; odata=verbose" } });
    return new Vue({
        el: '#contratos-new-form-app',
        mixins: [ContratoMixins],
        data: function () {
            return {
                contratoTitle: '#contrato-title input',
                contratos: ContratoStore,
                fakeBtnSave: '#fakeBtnSave input',
                originalBtnSave: '#originalBtnSave input'
            }
        },
        methods: {
            getFolderPath: function (path) {
                return '/ContratosAditivos/' + path
            },
            initializeNewForm: function () {
                $(this.fakeBtnSave).on('click', this.saveContrato.bind(this))
                $(this.contratoTitle).on('blur', this.contratoBlur.bind(this))
            },
            saveContrato: function () {
                if (this.createdNow) this.originalSave();

                if (this.folderAlredyExist) {
                    alert('Um contrato com este Titulo ja existe')
                    return false
                } else {
                    if (!this.ContratoTitle) return
                    this.contratos
                        .createContratoFolder(this.ContratoTitle)
                        .then(this.originalSave)
                }
            },
            contratoBlur: function (event) {
                if (!event.target.value) return
                Vue.set(this, 'ContratoTitle', event.target.value)
                this.contratos
                    .checkContratoFolderExist(this.getFolderPath(event.target.value))
                    .then(this.setFolderAlredyExist.bind(this))
                    .catch(this.notExistFolder.bind(this))
            },

        }
    })
})(Vue, jQuery, $pnp, ContratoStore, ContratoMixins);

var AditivosAPI = (function (Vue, $, pnp, ContratoStore, ContratoMixins) {
    return new Vue({
        el: '#aditivos-new-form-app',
        mixins: [ContratoMixins],
        data: function () {
            return {
                ContratoStore: ContratoStore,
                contratoSeletor: '#aditivo-titulo-contrato select',
                numContratoSeletor: '#aditivo-numero-contrato select',
                aditivoTitle: '#aditivo-title input',
                fakeBtnSave: '#fakeBtnSave input',
                originalBtnSave: '#originalBtnSave input'
            }
        },
        methods: {
            initializeNewForm: function () {
                $(this.aditivoTitle).on('blur', this.checkAditivoFolder.bind(this))
                $(this.contratoSeletor).on('change', this.setContratoId.bind(this))
                $(this.numContratoSeletor).on('change', this.setContratoId.bind(this))
                $(this.fakeBtnSave).on('click', this.saveAditivo.bind(this))
            },
            saveAditivo: function (event) {
                debugger
                if (this.createdNow) this.originalSave();
                if (this.folderAlredyExist) {
                    return this.originalSave();
                } else {
                    if (!this.aditivoTitle) return
                    this.ContratoStore
                        .createAditivoFolder(this.contrato.Title, this.aditivoTitle)
                        .then(this.originalSave)
                }
            },
            setContratoId: function (event) {
                if (event.target.value === '0') return
                Vue.set(this, 'contratoID', event.target.value);
                pnp.sp.web.lists.getByTitle('Contratos').items.getById(this.contratoID).get().then(function (response) {
                    Vue.set(this, 'contrato', response);
                }.bind(this))
            },
            checkAditivoFolder: function (event) {
                if (!event.target.value) return
                Vue.set(this, 'aditivoTitle', event.target.value)
                this.ContratoStore.checkContratoFolderExist('/' + this.contrato.Title + '/' + event.target.value)
                    .then(this.setFolderAlredyExist.bind(this))
                    .catch(this.notExistFolder.bind(this))
            }
        }
    })
})(Vue, jQuery, $pnp, ContratoStore, ContratoMixins);

