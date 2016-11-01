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
            setAditivoTitle:function(){
                Vue.set(this, 'Title', $(this.aditivoTitle).val())
            },
            initializeNewForm: function () {
                var contratoID = $(this.contratoSeletor).val();
                if (contratoID !== '0') {
                    this.setContratoId(null, contratoID).then(function () {
                        this.setAditivoTitle();
                        this.checkAditivoFolder(null, this.Title)
                    }.bind(this))
                }
                $(this.aditivoTitle).on('blur', this.checkAditivoFolder.bind(this))
                $(this.contratoSeletor).on('change', this.setContratoId.bind(this))
                $(this.numContratoSeletor).on('change', this.setContratoId.bind(this))
                $(this.fakeBtnSave).on('click', this.saveAditivo.bind(this))
            },
            saveAditivo: function (event) {
                if (this.createdNow) this.originalSave();
                if (this.folderAlredyExist) {
                    return this.originalSave();
                } else {
                    if (!this.Title) return
                    this.ContratoStore
                        .createAditivoFolder(this.contrato.Title, this.Title)
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
            setContratoId: function (event, id) {
                event = !event ? { target: { value: null } } : event
                if (event.target.value === '0') return
                Vue.set(this, 'contratoID', event.target.value || id);
                return pnp.sp
                    .web
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
            checkAditivoFolder: function (event, title) {
                event = !event ? { target: { value: (title || null) } } : event
                if (!event.target.value) return
                this.setAditivoTitle()
                this.ContratoStore.checkContratoFolderExist('/' + this.contrato.Title + '/' + this.Title)
                    .then(this.setFolderAlredyExist.bind(this))
                    .catch(this.notExistFolder.bind(this))
            }
        }
    })
})(Vue, jQuery, $pnp, ContratoStore, ContratoMixins);