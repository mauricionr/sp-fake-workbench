(function(Vue, $, R) {
    Vue.config.devtools = true;
    var RelatorioStore = {
        serviceUrl: _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/PNA.Aprimoramento.Services/DataService.svc/',
        possibleMethods: {
            GetCurso: 'GetCursoJSON?CursoID=',
            GetTurma: 'GetTurmaJSON?TurmaID='
        },
        filter:null,
        data:[],
        turmas:[],
        curso:'FixCurso',
        percentual:'Percentual',
        status:'Status',
        loading:false,
    }

    RelatorioStore.fields = [
        'Sigla', 'Nome completo', 'Desc. Área', 
        'Desc. Cat.', 'Curso', 'Comparecimento', 'Convidado/Convocado', 
        'Aprovação', 'Isenção', 'Justificativa'
    ]

    RelatorioStore.keys = [
        'ColaboradorSigla', 'ColaboradorNome', 'ColaboradorArea',
        'ColaboradorCategoria', 'FixCurso', 'Percentual', 'Candidatado',
        'Status', 'Isento', 'Justificativa'
    ]

    RelatorioStore.method = null;    
    RelatorioStore.ids = null;

    var RelatorioMixins = {
        data:function(){
            return RelatorioStore
        },
        methods:{
            generateReport:function(){
                this.method = this.getHashValue('method');
                this.ids = this.getHashValue('ids');
                if(this.ids){
                    this[this.method](this.ids.split(';'));
                    this[this.method + 's']()
                }
            },
            get: function(endPoint, key) {
                this.setLoading()
                return $.ajax({
                    url: endPoint,
                    headers: {
                        'Accept': 'application/json; odata=verbose',
                        'Content-Type': 'application/json; odata=verbose'
                    }
                })
                .then(this.parse)
                .then(this.setData.bind(this, key))
                .then(this.setLoading.bind(this))
            },
            parse:function(json){
                if(typeof json === 'string'){
                    json = JSON.parse(json);
                }
                return json;
            },
            setData: function(key, jsonParsed) {
                Vue.set(this, key, jsonParsed);
                return jsonParsed
            },
            setLoading:function(bool){
                Vue.set(this, 'loading', !this.loading)
            },
            getTurmas:function(){
                return this.get(_spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('Turmas')/items", 'turmas')
            },
            getCurso: function(ids) {
                return this.get(this.serviceUrl + this.possibleMethods.GetCurso + ids.join(';'), 'data')
            },
            getTurma: function(ids) {
                return this.get(this.serviceUrl + this.possibleMethods.GetTurma + ids.join(';'), 'data')
            },
            getHashValue: function (key) {
                var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
                return matches ? matches[1] : null;
            },
            setNewHashData:function(key, ids){
                var hashs = location.hash.split('&');
                hashs = hashs.map(function(current){
                    if(current.indexOf(key) !== -1){
                        current = current.split('=');
                        current[1] = ids;
                        current = current.join('=')
                    }
                    return current
                })
                window.location.hash = hashs.join('&')
            }
        }
    }
    
    var RelatorioComponent = Vue.extend({   
        props:['data', 'fields', 'keys', 'filters', 'report', 'current'],
        mixins:[RelatorioMixins],
        ready:function(){
            $(function(){
                $(this.$el).find('input[type="search"]').autocomplete({
                    source: function (request, response) {
                        response(this.turmas.d.results.filter(function(request, current){
                            if(current.Title.toLowerCase().indexOf(request.term.toLowerCase()) !== -1){
                                current.label = current.Title
                                current.id = current.ID;
                                return current
                            }  
                        }.bind(this, request)))
                    }.bind(this),
                    minLength: 3,
                    select: function(event, ui){
                        Vue.set(this, 'filter', ui.item.ID)
                    }.bind(this)
                })
            }.bind(this))
        },
        methods:{
            showFields:function(key){
                return key !== this.curso && key !== this.percentual && key !== this.status;
            },
            showPercentual:function(key){
                return key === this.percentual;
            },
            showCurso:function(key){
                return key === this.curso
            },
            showStatus:function(key){
                return key === this.status
            },
            getStatusLabel:function(inscrito){
                if(inscrito.Status.indexOf('5') !== -1){
                    return 'Aprovado'
                }else{
                    return 'Reprovado'
                } 
            },
            filterPresenca:function(inscrito){
                return inscrito.Presencas.Presenca.reduce(function(retorno, current){
                    if(current.Presenca.indexOf('Sim') !== -1){
                        retorno = retorno + 1;
                    }
                    return retorno;
                }, 0)
            }
        },
        template: [
            '<section id="relatorio-root">',
                '<div class="relatorio-filter">',
                '<input type="search" ref="tinput" v-model="searchTerm" id="search" placeholder="Insira uma turma" class="ui-autocomplete-input" autocomplete="off" />',
                '<input type="button" value="Gerar relatório" v-on:click="report()" />',
                '</div>',
                '<table class="relatorio-table">',
                    '<thead>',
                        '<tr>',
                            '<th v-for="field in fields">',
                                '{{field}}',
                            '</th>',
                        '</tr>',
                    '</thead>',
                    '<tbody>',
                        '<tr v-for="inscrito in data.Turma.Inscritos.Inscrito">',
                            '<td v-for="key in keys">',
                                '<p v-if="showFields(key)">{{inscrito[key]}}</p>',
                                '<p v-if="showCurso(key)">{{data.Turma.FixCurso}}</p>',
                                '<p v-if="showPercentual(key)">{{filterPresenca(inscrito)}} de {{data.Turma.Aulas.Aula.length}} ({{inscrito[key]}}%)</p>',
                                '<p v-if="showStatus(key)">{{getStatusLabel(inscrito)}}</p>',
                            '</td>',
                        '</tr>',
                    '</tbody>',
                '</table>',
            '</section>'
        ].join('')
    })

    new Vue({
        el: '#RelatorioAprimoramentoApp',
        mixins:[RelatorioMixins],
        data: function() { 
            return RelatorioStore
        },
        created: function() {
            this.filter = this.getHashValue('ids')       
            this.generateReport()
        },
        methods:{
            newReport:function(){
                if(this.filter){
                    this.setNewHashData('ids', this.filter);
                    this.generateReport();
                }
            },
        },
        components:{
            'relatorio-component': RelatorioComponent
        },
        template:[
            '<section id="root">',
                '<p v-if="loading">Loading...</p>',
                '<relatorio-component v-if="!loading" :current="filter" :report="newReport" :filters="turmas" :keys="keys" :fields="fields" v-for="item in data" :data="item"></relatorio-component>'
            ,'</section>'
        ].join('')
    })

})(Vue, jQuery, R)