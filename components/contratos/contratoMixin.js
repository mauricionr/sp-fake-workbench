
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
                pnp.sp.web.lists.getByTitle('Contratos').filter('Title eq ' + $(this.contratoTitle).val()).get().then(function (response) {
                    if (response.length > 0) {
                        Vue.set(this, 'folderAlredyExist', true)
                    } else {
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