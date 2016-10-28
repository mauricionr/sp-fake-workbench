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
        data: function () {
            return {
                disabledFields: '.disabled *',
            }
        },
        methods: {
            setDisableFields: function () {
                // $(this.disabledFields)
                //     .attr('disabled', true)
                //     .attr('contenteditable', false)
            },
            originalSave: function (response) {
                Vue.set(this, 'createdNow', true)
                $(this.originalBtnSave).click()
            },
            notExistFolder: function (error) {
                Vue.set(this, 'folderAlredyExist', false)
            },
            setFolderAlredyExist: function (response) {
                pnp.sp.web.lists.getByTitle('Contratos').filter('Title eq '+ $(this.contratoTitle).val()).get().then(function(response){
                    if(response.length > 0){
                        Vue.set(this, 'folderAlredyExist', true)
                    }else{
                        Vue.set(this, 'folderAlredyExist', false)
                    }
                    
                })
            },
            checkIEndDatefIsLessThanStartDate: function (startDate, lastDate) {
                startDate = this.getDateArray(startDate);
                lastDate = this.getDateArray(lastDate);
                return moment([lastDate[2], lastDate[1], lastDate[0]]).diff(moment([startDate[2], startDate[1], startDate[0]]), 'days') < 0 ? true : false
            },
            checkDataLiberacaoEaprovacao: function (startDate, lastDate, dataLiberacao, dataAprovacao) {
                startDate = this.getDateArray(startDate);
                startDate = moment([startDate[2], startDate[1], startDate[0]])
                lastDate = this.getDateArray(lastDate);
                lastDate = moment([lastDate[2], lastDate[1], lastDate[0]])

                dataLiberacao = this.getDateArray(dataLiberacao);
                dataLiberacao = moment([dataLiberacao[2], dataLiberacao[1], dataLiberacao[0]])
                dataAprovacao = this.getDateArray(dataAprovacao);
                dataAprovacao = moment([dataAprovacao[2], dataAprovacao[1], dataAprovacao[0]])

                return ((dataLiberacao.diff(startDate, 'days') >= 0) || (dataLiberacao.diff(lastDate, 'days') <= 0) || (dataAprovacao.diff(startDate, 'days') >= 0) || (dataAprovacao.diff(lastDate, 'days') <= 0)) ? true : false
            },
            getDateArray: function (dateString) {
                return dateString.split('/');
            },
        },
        created: function () {
            $(this.initializeNewForm.bind(this))
            $(this.setDisableFields.bind(this))
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
                originalBtnSave: '#originalBtnSave input',
                dataInicioContrato: '[title^="Data de Início"]',
                dataTerminoContrato: '[title^="Data de Término"]',
                dataLiberacao: '[title^="Data da Liberação"]',
                dataAprovacao: '[title^="Data da Aprovação"]'
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
                var dataInicio = document.querySelector(this.dataInicioContrato).value;
                var dataFim = document.querySelector(this.dataTerminoContrato).value;
                var dataLiberacao = document.querySelector(this.dataLiberacao).value;
                var dataAprovacao = document.querySelector(this.dataAprovacao).value;
                if (this.checkIEndDatefIsLessThanStartDate(dataInicio, dataFim)) {
                    alert('Data de término do contrato não pode ser inferior que a data de ínicio do contrato')
                    return
                }
                if (!this.checkDataLiberacaoEaprovacao(dataInicio, dataFim, dataLiberacao, dataAprovacao)) {
                    alert('O campo "Data Liberação" e "Data Aprovação" inferior a data do campo "Data de Inicio do Contrato" e superior a data do campo "Data de Término do Contrato"')
                    return
                }
                if (this.createdNow) {
                    this.originalSave();
                }
                if (this.folderAlredyExist) {
                    alert('Um contrato com este Titulo ja existe')
                    return
                } else {
                    if (!this.ContratoTitle) {
                        return
                    }
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
                originalBtnSave: '#originalBtnSave input',
                contratoInfosSeletor: {
                    'Title': this.getField('#aditivo-titulo-contrato select', 'lookup'),
                    'NumeroContrato': this.getField('#aditivo-numero-contrato input', 'text'),
                    'SolicitanteId': this.getField('#solicitante-contrato', 'person'),
                    'GestorAreaId': this.getField('#gestor-area', 'person'),
                    'GestorContratoId': this.getField('#gestor-contrato', 'person'),
                    'DataInicio': this.getField('#data-inicio input', 'date'),
                    'DataTermino': this.getField('#data-termino input', 'date'),
                    'Empresa': this.getField('#contrato-empresa input', 'text'),
                    'OrigemNecessidade': this.getField('#origem-necessidade input', 'text'),
                    'EstabEntrega': this.getField('#entrega input', 'text'),
                    'EstabCobranca': this.getField('#cobranca input', 'text'),
                    'EstabFaturamento': this.getField('#faturamento input', 'text')
                },
                selectContrato: '*,GestorContrato/Name,GestorContrato/Title,GestorContrato/ID,Solicitante/Name,Solicitante/Title,Solicitante/ID,GestorArea/Name,GestorArea/Title,GestorArea/ID,TipoDespesa/Title,TipoDespesa/ID,CentroCusto/Title,CentroCusto/ID',
                expandContrato: 'GestorContrato/Name,GestorContrato/Title,GestorContrato/ID,Solicitante/Name,Solicitante/Title,Solicitante/ID,GestorArea/Name,GestorArea/Title,GestorArea/ID,TipoDespesa/Title,TipoDespesa/ID,CentroCusto/Title,CentroCusto/ID'
            }
        },
        methods: {
            getField: function (seletor, type) {
                return { seletor: seletor, type: type }
            },
            initializeNewForm: function () {
                $.getScript('/_layouts/15/clientpeoplepicker.js', function () {
                    $(this.aditivoTitle).on('blur', this.checkAditivoFolder.bind(this))
                    $(this.contratoSeletor).on('change', this.setContratoId.bind(this))
                    $(this.numContratoSeletor).on('change', this.setContratoId.bind(this))
                    $(this.fakeBtnSave).on('click', this.saveAditivo.bind(this))
                }.bind(this))
            },
            saveAditivo: function (event) {
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
            setContratoVals: function () {
                for (var key in this.contratoInfosSeletor) {
                    var obj = this.contratoInfosSeletor[key]
                    var value = '';
                    switch (obj.type) {
                        case 'text':
                            value = this.contrato[key]
                            break;
                        case 'date':
                            value = this.contrato[key].split('T')[0].split('-').reverse().join('/')
                            break;
                        case 'person':
                            value = this.contrato[key.replace('Id', '')].Name;
                            $(obj.seletor + ' [id$="containerCell"] div, ' + obj.seletor + ' [id$="containerCell"] textarea').text(value);
                            $(obj.seletor + ' a[id$="checkNames"]').click()
                            break
                        case 'lookup':
                            value = this.contrato.Id
                            break;
                    }
                    var input = $(obj.seletor);
                    if (input && obj.type !== 'person') {
                        input.val(value || '')
                    }
                }
            },
            setContratoId: function (event) {
                if (event.target.value === '0') return
                Vue.set(this, 'contratoID', event.target.value);
                pnp.sp.web
                    .lists
                    .getByTitle('Contratos')
                    .items
                    .getById(this.contratoID)
                    .select(this.selectContrato)
                    .expand(this.expandContrato)
                    .get()
                    .then(function (response) {
                        Vue.set(this, 'contrato', response);
                        this.setContratoVals()
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