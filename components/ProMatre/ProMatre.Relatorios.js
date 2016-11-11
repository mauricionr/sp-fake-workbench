;(function(Vue, $, accounting){
	accounting.settings = {
		currency: {
			symbol : "R$",   
			format: "%s %v", // controls output: %s = symbol, %v = value/number (can be object: see below)
			decimal : ".",  // decimal point separator
			thousand: ",",  // thousands separator
			precision : 2,   // decimal places
			PrintDiferent : true, // Defines if the print should be diferent of the parse method
			decimalPrint : "," ,  // Define that Decimal Print
			thousandPrint : '.'  // Define that thousand Print

		},
		number: {
			precision : 0,  // default precision on numbers is 0
			thousand: ",",
			decimal : "."
		}
	}

	var RelatorioMixins = {
		data:function(){
			return {
				meses:["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
				mesesShort:["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"],
				NaoEncontrato : 'Nenhum resultado encontrato de acordo com o critério especificado',
			}
		},
		methods:{
			getRequest:function(query, list, include){
				var clientContext = new SP.ClientContext.get_current();
				var list = clientContext.get_web().get_lists().getByTitle(list);
				var query = new SP.CamlQuery();				
				query.set_viewXml(queryText);
				var listItems = list.getItems(query);
				clientContext.load(listItems, include);
				
				return new Promise(function(resolve, reject){
					clientContext.executeQueryAsync(function(data){
						resolve({data:data, listItems: listItems})
					},function(error, args){
						reject({error:error, args:args})
					})
				})
			},
			getPropertiesForRequest:function(dataFim, dataInit, list, include, method, filters, viewFields){
				return {
					dataFim:dataFim,
					dataIni:dataInit,
					list:list,
					include:include,
					query:'<View> \
						<Method Name="'+method+'"> \
							'+filters+'\
						</Method> \
						<Query /> \
						<ViewFields> \
							'+viewFields+'\
						</ViewFields> \
					</View>'
				}
			},
			getVacinaDisMesValoresProperties:function(inicio, fim){
				return this.getPropertiesForRequest(
					inicio, 
					fim, 
					'SPRELATORIOVACINADIAPERIODOVALOR', 
					'Include(ID_VACINA, NOME_VACINA, QTD_DIA, VALOR_DIA, VALOR_PERIODO, QTD_PERIODO, SUM_QTD_DIA, SUM_VALOR_DIA, SUM_QTD_PERIODO, SUM_VALOR_PERIODO)',
					'SP_RELATORIO-VACINA_DIA-PERIODO-VALOR-Read-List',
					'<Filter Name="ID" Value="-1" /><Filter Name="DT_INI" Value="'+ inicio +'" /><Filter Name="DT_FIM" Value="'+ fim +'" /><Filter Name="PageNumber" Value="1" /><Filter Name="RowspPage" Value="1000" /> ',
					'<FieldRef Name="ID_VACINA" /><FieldRef Name="NOME_VACINA" /><FieldRef Name="QTD_DIA" /><FieldRef Name="QTD_PERIODO" /><FieldRef Name="VALOR_DIA" /><FieldRef Name="VALOR_PERIODO" /><FieldRef Name="SUM_QTD_DIA" /><FieldRef Name="SUM_VALOR_DIA" /><FieldRef Name="SUM_QTD_PERIODO" /><FieldRef Name="SUM_VALOR_PERIODO" /> '
				)
			},
			getVacinaMesQuantidadeProperties:function(inicio, fim){
				return this.getPropertiesForRequest(
					inicio, 
					fim, 
					'SPRELATORIOVACINADIAPERIODOQTD', 
					'Include(ID_VACINA, NOME_VACINA, QTD_DIA, QTD_PERIODO, SUM_QTD_DIA, SUM_QTD_PERIODO)',
					'SP_RELATORIO-VACINA_DIA-PERIODO-QTD-Read-List',
					'<Filter Name="ID" Value="-1" /><Filter Name="DT_INI" Value="'+ inicio +'" /><Filter Name="DT_FIM" Value="'+ fim +'" /><Filter Name="PageNumber" Value="'+ '1' +'" /><Filter Name="RowspPage" Value="'+ '1000' +'" />',
					'<FieldRef Name="ID_VACINA" /><FieldRef Name="NOME_VACINA" /><FieldRef Name="QTD_DIA" /><FieldRef Name="QTD_PERIODO" /><FieldRef Name="SUM_QTD_DIA" /><FieldRef Name="SUM_QTD_PERIODO" />'
				)
			},
			getFaturamentoDiaMesProperties:function(inicio, fim){
				return this.getPropertiesForRequest(
					inicio, 
					fim,
					'SPRELATORIOFATURAMENTODIAMES',
					'Include(ID, DATE, DIA, QTD_DIA, VALOR_DIA, SUM_QTD, SUM_VALOR)',
					'SP_RELATORIO-FATURAMENTO-DIA-MES-Read-List',
					'<Filter Name="ID" Value="-1" /><Filter Name="DT_INI" Value="'+ inicio +'" /><Filter Name="DT_FIM" Value="'+ fim +'" /><Filter Name="PageNumber" Value="'+ '1' +'" /><Filter Name="RowspPage" Value="'+ '1000' +'" /> ',
					'<FieldRef Name="ID" /><FieldRef Name="DATE" /><FieldRef Name="DIA" /><FieldRef Name="QTD_DIA" /><FieldRef Name="VALOR_DIA" /><FieldRef Name="SUM_QTD" /><FieldRef Name="SUM_VALOR" /> '
				)
			},
			getPacienteHistoricoProperties:function(nome, datCorte){
				return this.getPropertiesForRequest(
					inicio, 
					fim,
					'SPRELATORIOPACIENTEHISTORICO',
					'Include(PACIENTE_ID, PACIENTE, CPF_DO_RESPONSAVEL, ATENDIMENTO_ID, DATA_APLICACAO, DOSE, VACINA_ID, NOME_VACINA, LOTE, APLICADO_POR, MEDICO)',
					'SP_GET-PACIENTE-Read-List',
					'<Filter Name="ID" Value="' + nome + '" /><Filter Name="DT_INI" Value="' + DataCorte + '" /><Filter Name="PageNumber" Value="'+ '1' +'" /><Filter Name="RowspPage" Value="'+ '1000' +'" /> ',
					'<FieldRef Name="PACIENTE_ID" />\
					<FieldRef Name="PACIENTE" />\
					<FieldRef Name="CPF_DO_RESPONSAVEL" />\
					<FieldRef Name="ATENDIMENTO_ID" />\
					<FieldRef Name="DATA_APLICACAO" />\
					<FieldRef Name="DOSE" />\
					<FieldRef Name="VACINA_ID" />\
					<FieldRef Name="NOME_VACINA" />\
					<FieldRef Name="LOTE" />\
					<FieldRef Name="APLICADO_POR" />\
					<FieldRef Name="MEDICO" /> '

				)
			},
			getPacienteProperties:function(nome, cpf){
				return this.getPropertiesForRequest(
					inicio, 
					fim,
					'SPGETPACIENTE',
					'Include(ID, NOME, CPF_DO_RESPONSAVEL)',
					'SP_GET-PACIENTE-Read-List',
					'<Filter Name="ID" Value="-1" /><Filter Name="PACIENTE_NOME" Value="'+ nome +'" /><Filter Name="PACIENTE_CPF" Value="'+ cpf +'" /><Filter Name="PageNumber" Value="'+ '1' +'" /><Filter Name="RowspPage" Value="'+ '1000' +'" /> ',
					'<FieldRef Name="ID" /><FieldRef Name="NOME" /><FieldRef Name="CPF_DO_RESPONSAVEL" /> '

				)
			},
			getPacientesLoteProperties:function(idVacina){
				return this.getPropertiesForRequest(
					null,
					null,
					'SPGETVACINA',
					'Include(ID, NOME)',
					'SP_GET-VACINA-Read-List',
					'<Filter Name="ID" Value="-1" /> \
								<Filter Name="VACINA_NOME" Value="'+ idVacina +'" /> \
								<Filter Name="PageNumber" Value="'+ '1' +'" /> \
								<Filter Name="RowspPage" Value="'+ '1000' +'" /> ',
					'<FieldRef Name="ID" /> \
								<FieldRef Name="NOME" /> '
				)
			}
		}
	}
	
	var RelatorioStore = {
	
	}
	
	var RelatorioComponent = new Vue({
		el:'#relatorio-app',
		mixins:[RelatorioMixins],
		data:function(){
			return {
				RelatorioStore: RelatorioStore
			}
		},
		created:function(){}
	})
})(Vue, jQuery, accounting);