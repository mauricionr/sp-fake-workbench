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
                debugger
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