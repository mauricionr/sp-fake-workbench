
document.addEventListener("DOMContentLoaded", function() {
	/*
	SP.SOD.executeFunc("sp.js");
	ExecuteOrDelayUntilScriptLoaded(reports.init, "sp.js");
	events(window, document);

	Date.CultureInfo.monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
	Date.CultureInfo.abbreviatedMonthNames = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];


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
	
	$('.dtInit').mask("99/99/9999");
	$('.dtEnd').mask("99/99/9999");

	$("#txtNomePaciente").keyup(function(event){
		if(event.keyCode == 13){
			reports.getReports();
		}
	});
	*/
});



var module = {};

var events = (function(window, document, undefined){
	'use strict';

	var $div = document.getElementById('events');

	$('#select').on('change',function(){
		
		var relatorio = this.value;

		module.reset();

		$('#Dia').val(Date.today().toString("dd"));
		$('#Mes').val(Date.today().toString("MM"));
		$('#Ano').val(Date.today().toString("yyyy"));

		$('#dtIni').val(Date.today().moveToFirstDayOfMonth().toString("dd/MM/yyyy"));
		$('#dtEnd').val(Date.today().toString("dd/MM/yyyy"));

		$('#txtNomePaciente').val('');
		$('#txtIdPaciente').val('');

		switch(relatorio)
		{
			case "VaciaDiaMesQtd":
				$('.Dia').show();
				$('.SemData').show();
				$('#pacientData').hide();
			break;
			case "VaciaDiaMesValores":
				$('.Dia').show();
				$('.SemData').show();
				$('#pacientData').hide();
			break;
			case "FaturamentoDiaMes":
				$('.SemData').show();
				$('.Dia').hide();
				$('#pacientData').hide();
			break;

			case "PacienteHistorico":
				$('.SemData').hide();
				$('.Dia').hide();
				$('#pacientData').show();
			break;

			case "PacienteLote":
				$('.SemData').hide();
				$('.Dia').hide();
				$('.vacinas').show();
			break;
		}
	});

	module.consts = {
		NaoEncontrato : 'Nenhum resultado encontrato de acordo com o critério especificado'
	}

 	module.input = {
		formData: {
			dtIni : function() {
				return module.IsEmpty($("#dtInit").val()) ? null : Date.parseExact($("#dtInit").val(), 'dd/MM/yyyy').toString('yyyy-MM-dd');;
			},
			dtEnd  : function() {
				//- Essa propriedade funciona para o campo de data corrente, caso os parametros de dia / mes / ano estiverem preenchidos

				var dia = $('#Dia').val(); 
				var mes = $('#Mes').val();
				var ano = $('#Ano').val();

				var dtSelected = module.padLeft(dia, 2, '0') + '/' + module.padLeft(mes, 2, '0') + '/' + module.padLeft(ano, 2, '0');

				if(!module.IsEmpty(dtSelected)) {
					return Date.parseExact(dtSelected, 'dd/MM/yyyy').toString('yyyy-MM-dd');
				}
				else {
					// - Caso não, retorna o valor do campo dtEnd
					return module.IsEmpty($("#dtEnd").val()) ? null : Date.parseExact($("#dtInit").val(), 'dd/MM/yyyy').toString('yyyy-MM-dd');;
				}
			},
			dtMes : function() { 
				var dtSelected = '01' + '/' + $('#Mes').val() + '/' + $('#Ano').val();
				return Date.parseExact(dtSelected, 'dd/MM/yyyy').toString('yyyy-MM-dd');
			},
			dtCortePaciente : function() {
				var dt = $("#txtDataCortePaciente").val();
				if(module.IsEmpty(dt)) {
					return null;
				}
				else{
					return Date.parseExact(dt, 'dd/MM/yyyy').toString('yyyy-MM-dd');
				}
			},
			idInit : function() { 
				return $('#idInit').val() 
			},
			idEnd  : function() { 
				return $('#idEnd').val() 
			},
			pageCount : function() { return $('.PageCount').text() },
			pageCurrent : function() { return $('.PageCurrent').text() },
			relatoriosSelect : function() { return $('#select').val() },
			idVacina: function() { return $('#idVacina').val() },
			idLote: function() { return $('#txtIDLote').val() },
			nomePaciente: function() { return $('#txtNomePaciente').val() },
			idPaciente : function() { return $('#txtIdPaciente').val() }
		}
	};
	
	module.resetOld = function($this){
		$this.getElementsByClassName("loading")[0].style.display = 'block';
		$this.getElementsByClassName("PageOptions")[0].style.display = 'none';
		$this.getElementsByClassName("Ficha")[0].innerHTML = "";
	};
	
	$div.addEventListener('change', function(event){
		// var $select = event.target;
		//  if($select.id == 'select'){
		// 	  if($select.options[$select.selectedIndex].value == '2'){
		// 	 	this.getElementsByClassName('vacinas')[0].style.display = 'block';
		// 	 	this.getElementsByClassName('select')[0].style.width = '180px';
		// 	 	this.getElementsByClassName('headerVaccine')[0].innerHTML = "";
		// 	 }else{
		// 	    this.getElementsByClassName('vacinas')[0].style.display = 'none';
		// 	    this.getElementsByClassName('select')[0].style.width = '340px';
		// 	    this.getElementsByClassName('headerVaccine')[0].innerHTML = "";
		// 	 };
		// };
    });
	
	
	$div.addEventListener('click', function(event){
		var $btn = event.target;
		var $inputs = module.input.formData;
		if($btn.id == 'search') {					
			
			$('#pacientes').html('');
			$('#dados').html('');

			reports.getReports();
		}
	});
});

var reports = (function(){
	"use strict";
	
	var option = '';
	var collListItem = "";
	var htmlVacinaRest = "";

	module.init = function() {
		module.reset(this);
	};

	module.reset = function($this) {
		$('.semDataIni').hide();
		$('.semDataFim').hide();
		$('.loading').hide();
		$('.PageOptions').hide();
		
		$('#pacientData').hide();

		$('#pacientes').html('');
		$('#dados').html('');
	};

	module.selectPacient = function(obj) {
		// 1 - Defino o valor do ID do paciente
		
		var pacientID = $(obj).attr('PacientID')
		module.log('Pacient ID: "' + pacientID + "'");
		$('#txtIdPaciente').val(pacientID);

		// 2 - Efetuo a busca novamente por dados do paciente
		reports.getReports();
	};

	module.BuildVaciaDiaMesValores = function(data, listItems, DataINI, DataFIM, CurrentMonth) {

		var tableHtml = '';
		if(listItems.get_count() <= 0)
		{
			tableHtml += 
				'<tr>\
					<td>' + module.consts.NaoEncontrato  + '</td>\
				</tr>'
			return tableHtml;
		}
		var listItemEnumerator = listItems.getEnumerator();
		var SumQtdDay = 0, SumValorDay = 0, SumQtdPeriod = 0, SumValorPeriod = 0;
		tableHtml =
			'<tr class="strong"> \
				<td> </td> \
				<td colspan="2">' + Date.parse(DataFIM).toString('dd/MM/yyyy') + ' </td> \
				<td colspan="2">' + CurrentMonth + ' </td> \
			</tr>';

		tableHtml += 
			'<tr>\
				<th>Produto</th>\
				<th>Qtde</th>\
				<th>Valor</th>\
				<th>Qtde</th>\
				<th>Valor</th>\
			</tr>'

		while (listItemEnumerator.moveNext()) {
			var item = listItemEnumerator.get_current();
			tableHtml +=
				'<tr> \
					<td>'+ item.get_item("NOME_VACINA") +'</td>\
					<td>'+ item.get_item("QTD_DIA") +'</td>\
					<td>'+ accounting.formatMoney(item.get_item("VALOR_DIA")) +'</td>\
					<td>'+ item.get_item("QTD_PERIODO") +'</td>\
					<td>'+ accounting.formatMoney(item.get_item("VALOR_PERIODO")) +'</td>\
				</tr>';

			SumQtdDay = item.get_item("SUM_QTD_DIA")
			SumValorDay = item.get_item("SUM_VALOR_DIA")
			SumQtdPeriod = item.get_item("SUM_QTD_PERIODO")
			SumValorPeriod = item.get_item("SUM_VALOR_PERIODO")
		}

		tableHtml +=
			'<tr class="total"> \
				<td> TOTAL </td> \
				<td>' + SumQtdDay + ' </td> \
				<td>' + accounting.formatMoney(SumValorDay) + ' </td> \
				<td>' + SumQtdPeriod + ' </td> \
				<td>' + accounting.formatMoney(SumValorPeriod) + ' </td> \
			</tr>';
		return tableHtml;
	};


	module.BuildVaciaDiaMesQtd = function(data, listItems, DataINI, DataFIM, CurrentMonth) {

		var tableHtml = '';
		if(listItems.get_count() <= 0)
		{
			tableHtml += 
				'<tr>\
					<td>' + module.consts.NaoEncontrato  + '</td>\
				</tr>'
			return tableHtml;
		}

		var listItemEnumerator = listItems.getEnumerator();
		var SumQtdDay = 0;
		var SumQtdPeriod = 0;
		tableHtml =
			'<caption>' + CurrentMonth + ' </caption>';

		tableHtml += 
			'<tr>\
				<th>Produto</th>\
				<th>Qtde</th>\
				<th>Qtde</th>\
			</tr>'

		while (listItemEnumerator.moveNext()) {
			var item = listItemEnumerator.get_current();
			tableHtml +=
				'<tr> \
					<td>'+ item.get_item("NOME_VACINA") +'</td>\
					<td>'+ item.get_item("QTD_DIA") +'</td>\
					<td>'+ item.get_item("QTD_PERIODO") +'</td>\
				</tr>';

			SumQtdDay = item.get_item("SUM_QTD_DIA")
			SumQtdPeriod = item.get_item("SUM_QTD_PERIODO")
		}

		tableHtml +=
			'<tr class="total"> \
				<td> TOTAL </td> \
				<td>' + SumQtdDay + ' </td> \
				<td>' + SumQtdPeriod + ' </td> \
			</tr>';
		return tableHtml;
	};

	module.BuildFaturamentoDiaMes = function(data, listItems, DataINI, DataFIM, CurrentMonth) {

		var tableHtml = '';
		if(listItems.get_count() <= 0)
		{
			tableHtml += 
				'<tr>\
					<td>' + module.consts.NaoEncontrato  + '</td>\
				</tr>'
			return tableHtml;
		}

		var listItemEnumerator = listItems.getEnumerator();
		var SumQtdDay = 0, SumValor = 0;
		tableHtml =
			'<tr class="strong"> \
				<td> </td> \
				<td>' + Date.parse(DataFIM).toString('dd/MM/yyyy') + ' </td> \
				<td>' + CurrentMonth + ' </td> \
			</tr>';

		tableHtml += 
			'<tr>\
				<th>Dia</th>\
				<th>Qtde</th>\
				<th>Valor</th>\
			</tr>'

		while (listItemEnumerator.moveNext()) {
			var item = listItemEnumerator.get_current();
			tableHtml +=
				'<tr> \
					<td>'+ item.get_item("DIA") +'</td>\
					<td>'+ item.get_item("QTD_DIA") +'</td>\
					<td>'+ accounting.formatMoney(item.get_item("VALOR_DIA")) +'</td>\
				</tr>';

			SumQtdDay = item.get_item("SUM_QTD")
			SumValor = accounting.formatMoney(item.get_item("SUM_VALOR"))
		}

		tableHtml +=
			'<tr class="total"> \
				<td> Total </td> \
				<td>' + SumQtdDay + ' </td> \
				<td>' + SumValor + ' </td> \
			</tr>';
		return tableHtml;
	};

	module.BuildPacienteList = function(data, listItems)
	{
		var tableHtml = '';

		if(listItems.get_count() <= 0)
		{
			tableHtml += 
				'<tr>\
					<td>' + module.consts.NaoEncontrato  + '</td>\
				</tr>'
			return tableHtml;
		}
		var listItemEnumerator = listItems.getEnumerator();
		tableHtml += 
			'<caption>Pacientes</caption> \
			<tr>\
				<th>Nome</th>\
				<th>CPF do Responsável</th>\
			</tr>'

		while (listItemEnumerator.moveNext()) {
			var item = listItemEnumerator.get_current();
			tableHtml +=
				'<tr> \
					<td style="cursor: pointer;" onclick="module.selectPacient(this)" PacientID="' + item.get_item("ID") + '">'+ item.get_item("NOME") +'</td>\
					<td>'+ item.get_item("CPF_DO_RESPONSAVEL") +'</td>\
				</tr>';
		}

		return tableHtml;
	};


	module.BuildPacienteHistorico = function(data, listItems)
	{
		var tableHtml = '';
		if(listItems.get_count() <= 0)
		{
			tableHtml += 
				'<tr>\
					<td>' + module.consts.NaoEncontrato  + '</td>\
				</tr>'
			return tableHtml;
		}
		var PacientNome = '', header = '', body = '';
		var listItemEnumerator = listItems.getEnumerator();
		header =
			'<tr>\
				<th>Vacina</th>\
				<th>Data</th>\
				<th>Dose</th>\
				<th>Aplicador</th>\
				<th>Lote</th>\
				<th>Medico</th>\
			</tr>';

		while (listItemEnumerator.moveNext()) {
			var item = listItemEnumerator.get_current();
			body +=
				'<tr> \
					<td>'+ item.get_item("NOME_VACINA") +'</td>\
					<td>'+ item.get_item("DATA_APLICACAO").toString("dd/MM/yyyy") +'</td>\
					<td>'+ item.get_item("DOSE") +'</td>\
					<td>'+ item.get_item("APLICADO_POR") +'</td>\
					<td>'+ item.get_item("LOTE") +'</td>\
					<td>'+ item.get_item("MEDICO") +'</td>\
				</tr>';
			PacientNome = item.get_item("PACIENTE");
		}

		// 1 - Nome do Paciente
		tableHtml = 
			'<caption>Paciente: ' + PacientNome  + '</caption>' ;

		// 2 - Header da tabela
		tableHtml += header

		// 3 - Dados
		tableHtml += body

		return tableHtml;
	};


	
	module.BuildReportSucess = function( option, data, listItems, DataINI, DataFIM, CurrentMonth) {
		var tableHtml = '';
		switch(option)
		{
			case "VaciaDiaMesQtd":
				tableHtml = module.BuildVaciaDiaMesQtd(data, listItems, DataINI, DataFIM, CurrentMonth);
			break;
			case "VaciaDiaMesValores":
				tableHtml = module.BuildVaciaDiaMesValores(data, listItems, DataINI, DataFIM, CurrentMonth);
			break;
			case "FaturamentoDiaMes":
				tableHtml = module.BuildFaturamentoDiaMes(data, listItems, DataINI, DataFIM, CurrentMonth);
			break;
			case "PacientesLote":
				//tableHtml = module.BuildFaturamentoDiaMes(data, listItems, DataINI, DataFIM, CurrentMonth);



			break;

			case "PacienteHistorico":
				// Primeiro Deve selecionar o paciente para depois obter o histórico
				if( module.IsEmpty(  module.input.formData.idPaciente() ) ) {
					var PacientesHtml = module.BuildPacienteList(data, listItems);
					$("#pacientes").html(PacientesHtml);
				}
				else{
					$("#pacientes").html('');
					$('#txtIdPaciente').val('');
					tableHtml = module.BuildPacienteHistorico(data, listItems);
				}
			break;
		}
		$(".loading").hide();
		$("#dados").html(tableHtml);
	};

	module.getReports= function() {
		// New Module Method Implemented by S.O.
		option = module.input.formData.relatoriosSelect();

		this.clientContext = new SP.ClientContext.get_current();
		var website = this.clientContext.get_web();
		var list = null;
		var query = new SP.CamlQuery();
		var listItems = null;
		switch(option)
		{
			case "VaciaDiaMesQtd":
				var DataFIM = module.input.formData.dtEnd();
				var DataINI = module.input.formData.dtIni() == null ? Date.parse(DataFIM).moveToFirstDayOfMonth().toString('yyyy-MM-dd') : module.input.formData.dtIni();
				module.log('Data Inicial: "' + DataINI + '" Data Final : "' + DataFIM + '"');
				var CurrentMonth = Date.parse(DataFIM).toString('MMMM-yyyy');
				list = website.get_lists().getByTitle('SPRELATORIOVACINADIAPERIODOQTD');
				var queryText = 
					'<View> \
						<Method Name="SP_RELATORIO-VACINA_DIA-PERIODO-QTD-Read-List"> \
							<Filter Name="ID" Value="-1" /> \
							<Filter Name="DT_INI" Value="'+ DataINI +'" /> \
							<Filter Name="DT_FIM" Value="'+ DataFIM +'" /> \
							<Filter Name="PageNumber" Value="'+ '1' +'" /> \
							<Filter Name="RowspPage" Value="'+ '1000' +'" /> \
						</Method> \
						<Query /> \
						<ViewFields> \
							<FieldRef Name="ID_VACINA" /> \
							<FieldRef Name="NOME_VACINA" /> \
							<FieldRef Name="QTD_DIA" /> \
							<FieldRef Name="QTD_PERIODO" /> \
							<FieldRef Name="SUM_QTD_DIA" /> \
							<FieldRef Name="SUM_QTD_PERIODO" /> \
						</ViewFields> \
					</View>';

				query.set_viewXml(queryText);
				listItems = list.getItems(query);
				this.clientContext.load(listItems, 'Include(ID_VACINA, NOME_VACINA, QTD_DIA, QTD_PERIODO, SUM_QTD_DIA, SUM_QTD_PERIODO)');
				$('.loading').show();
				this.clientContext.executeQueryAsync(
					Function.createDelegate(this, function(data) { 
						module.BuildReportSucess( option, data, listItems, DataINI, DataFIM, CurrentMonth); 
				}), 
				Function.createDelegate(this, module.onQueryFailed))
			break;
			case "VaciaDiaMesValores":
				var DataFIM = module.input.formData.dtEnd();
				var DataINI = module.input.formData.dtIni() == null ? Date.parse(DataFIM).moveToFirstDayOfMonth().toString('yyyy-MM-dd') : module.input.formData.dtIni();
				module.log('Data Inicial: "' + DataINI + '" Data Final : "' + DataFIM + '"');
				var CurrentMonth = Date.parse(DataFIM).toString('MMMM-yyyy');
				list = website.get_lists().getByTitle('SPRELATORIOVACINADIAPERIODOVALOR');
				var queryText = 
					'<View> \
						<Method Name="SP_RELATORIO-VACINA_DIA-PERIODO-VALOR-Read-List"> \
							<Filter Name="ID" Value="-1" /> \
							<Filter Name="DT_INI" Value="'+ DataINI +'" /> \
							<Filter Name="DT_FIM" Value="'+ DataFIM +'" /> \
							<Filter Name="PageNumber" Value="'+ '1' +'" /> \
							<Filter Name="RowspPage" Value="'+ '1000' +'" /> \
						</Method> \
						<Query /> \
						<ViewFields> \
							<FieldRef Name="ID_VACINA" /> \
							<FieldRef Name="NOME_VACINA" /> \
							<FieldRef Name="QTD_DIA" /> \
							<FieldRef Name="QTD_PERIODO" /> \
							<FieldRef Name="VALOR_DIA" /> \
							<FieldRef Name="VALOR_PERIODO" /> \
							<FieldRef Name="SUM_QTD_DIA" /> \
							<FieldRef Name="SUM_VALOR_DIA" /> \
							<FieldRef Name="SUM_QTD_PERIODO" /> \
							<FieldRef Name="SUM_VALOR_PERIODO" /> \
						</ViewFields> \
					</View>';
				query.set_viewXml(queryText);
				listItems = list.getItems(query);
				this.clientContext.load(listItems, 'Include(ID_VACINA, NOME_VACINA, QTD_DIA, VALOR_DIA, VALOR_PERIODO, QTD_PERIODO, SUM_QTD_DIA, SUM_VALOR_DIA, SUM_QTD_PERIODO, SUM_VALOR_PERIODO)');
				$('.loading').show();
				this.clientContext.executeQueryAsync(
					Function.createDelegate(this, function(data) { 
						module.BuildReportSucess( option, data, listItems, DataINI, DataFIM, CurrentMonth); 
				}), 
				Function.createDelegate(this, module.onQueryFailed))
			break;
			case "FaturamentoDiaMes":
				var DataINI = module.input.formData.dtMes();
				var DataFIM = Date.parse(DataINI).moveToLastDayOfMonth().toString('yyyy-MM-dd');
				module.log('Data Inicial: "' + DataINI + '" Data Final : "' + DataFIM + '"');
				var CurrentMonth = Date.parse(DataINI).toString('MMMM-yyyy');
				list = website.get_lists().getByTitle('SPRELATORIOFATURAMENTODIAMES');
				var queryText = 
					'<View> \
						<Method Name="SP_RELATORIO-FATURAMENTO-DIA-MES-Read-List"> \
							<Filter Name="ID" Value="-1" /> \
							<Filter Name="DT_INI" Value="'+ DataINI +'" /> \
							<Filter Name="DT_FIM" Value="'+ DataFIM +'" /> \
							<Filter Name="PageNumber" Value="'+ '1' +'" /> \
							<Filter Name="RowspPage" Value="'+ '1000' +'" /> \
						</Method> \
						<Query /> \
						<ViewFields> \
							<FieldRef Name="ID" /> \
							<FieldRef Name="DATE" /> \
							<FieldRef Name="DIA" /> \
							<FieldRef Name="QTD_DIA" /> \
							<FieldRef Name="VALOR_DIA" /> \
							<FieldRef Name="SUM_QTD" /> \
							<FieldRef Name="SUM_VALOR" /> \
						</ViewFields> \
					</View>';
				query.set_viewXml(queryText);
				listItems = list.getItems(query);
				this.clientContext.load(listItems, 'Include(ID, DATE, DIA, QTD_DIA, VALOR_DIA, SUM_QTD, SUM_VALOR)');
				$('.loading').show();
				this.clientContext.executeQueryAsync(
					Function.createDelegate(this, function(data) { 
						module.BuildReportSucess( option, data, listItems, DataINI, DataFIM, CurrentMonth); 
				}), 
				Function.createDelegate(this, module.onQueryFailed))
			break;
			case "PacienteHistorico":
				var PacienteName = module.input.formData.nomePaciente();
				var idPaciente = module.input.formData.idPaciente();
				var DataCorte = module.input.formData.dtCortePaciente();
				module.log('Nome do Paciente: "' + PacienteName + '"');
				module.log('ID do Paciente: "' + idPaciente + '"');
				module.log('Data de Corte Paciente: "' + DataCorte + '"');

				if( module.IsEmpty( idPaciente ) )
				{
					list = website.get_lists().getByTitle('SPGETPACIENTE');
					var queryText = 
						'<View> \
							<Method Name="SP_GET-PACIENTE-Read-List"> \
								<Filter Name="ID" Value="-1" /> \
								<Filter Name="PACIENTE_NOME" Value="'+ PacienteName +'" /> \
								<Filter Name="PACIENTE_CPF" Value="'+ PacienteName +'" /> \
								<Filter Name="PageNumber" Value="'+ '1' +'" /> \
								<Filter Name="RowspPage" Value="'+ '1000' +'" /> \
							</Method> \
							<Query /> \
							<ViewFields> \
								<FieldRef Name="ID" /> \
								<FieldRef Name="NOME" /> \
								<FieldRef Name="CPF_DO_RESPONSAVEL" /> \
							</ViewFields> \
						</View>';
					query.set_viewXml(queryText);
					listItems = list.getItems(query);
					this.clientContext.load(listItems, 'Include(ID, NOME, CPF_DO_RESPONSAVEL)');
				}
				else
				{
					list = website.get_lists().getByTitle('SPRELATORIOPACIENTEHISTORICO');
					var queryText = 
						'<View> \
							<Method Name="SP_RELATORIO_PACIENTE_HISTORICO-Read-List"> \
								<Filter Name="ID" Value="' + idPaciente + '" /> \
								<Filter Name="DT_INI" Value="' + DataCorte + '" /> \
								<Filter Name="PageNumber" Value="'+ '1' +'" /> \
								<Filter Name="RowspPage" Value="'+ '1000' +'" /> \
							</Method> \
							<Query /> \
							<ViewFields> \
								<FieldRef Name="PACIENTE_ID" /> \
								<FieldRef Name="PACIENTE" /> \
								<FieldRef Name="CPF_DO_RESPONSAVEL" /> \
								<FieldRef Name="ATENDIMENTO_ID" /> \
								<FieldRef Name="DATA_APLICACAO" /> \
								<FieldRef Name="DOSE" /> \
								<FieldRef Name="VACINA_ID" /> \
								<FieldRef Name="NOME_VACINA" /> \
								<FieldRef Name="LOTE" /> \
								<FieldRef Name="APLICADO_POR" /> \
								<FieldRef Name="MEDICO" /> \
							</ViewFields> \
						</View>';
					query.set_viewXml(queryText);
					listItems = list.getItems(query);
					this.clientContext.load(listItems, 'Include(PACIENTE_ID, PACIENTE, CPF_DO_RESPONSAVEL, ATENDIMENTO_ID, DATA_APLICACAO, DOSE, VACINA_ID, NOME_VACINA, LOTE, APLICADO_POR, MEDICO)');
				}
				
				$('.loading').show();
				this.clientContext.executeQueryAsync(
					Function.createDelegate(this, function(data) {
						module.BuildReportSucess( option, data, listItems); 
				}), 
				Function.createDelegate(this, module.onQueryFailed))

			break;
			case "PacientesLote" :
				var idVacina = module.input.formData.idVacina();
				var idLote = module.input.formData.idLote();

				module.log('ID da Vacina: "' + idVacina + '"');
				module.log('ID do Lote: "' + idVacina + '"');

				if( module.IsEmpty( idVacina ) )
				{
					list = website.get_lists().getByTitle('SPGETVACINA');
					var queryText = 
						'<View> \
							<Method Name="SP_GET-VACINA-Read-List"> \
								<Filter Name="ID" Value="-1" /> \
								<Filter Name="VACINA_NOME" Value="'+ idVacina +'" /> \
								<Filter Name="PageNumber" Value="'+ '1' +'" /> \
								<Filter Name="RowspPage" Value="'+ '1000' +'" /> \
							</Method> \
							<Query /> \
							<ViewFields> \
								<FieldRef Name="ID" /> \
								<FieldRef Name="NOME" /> \
							</ViewFields> \
						</View>';
					query.set_viewXml(queryText);
					listItems = list.getItems(query);
					this.clientContext.load(listItems, 'Include(ID, NOME)');
				}
				else{


				}
				$('.loading').show();
				this.clientContext.executeQueryAsync(
					Function.createDelegate(this, function(data) {
						module.BuildReportSucess( option, data, listItems); 
				}), 
				Function.createDelegate(this, module.onQueryFailed))
			break;
		}
	};

	module.getReportsOld= function(DT_INI,DT_FIM,PaginaComando,PrimeiroProdutoID,UltimoProdutoID,PaginaConta,PaginaAtual,selected,QuantidadePorPagina,idVacina) {
		 option = selected;
		 var m = [0,31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		 if(option == '4'){
		 	if($('#Dia').val() != ""){
		 		DT_INI = $('#Dia').val()+"/"+$('#Mes').val()+'/'+$('#Ano').val();
			 	DT_FIM = $('#Dia').val()+"/"+$('#Mes').val()+'/'+$('#Ano').val();
		 	}else{
			 	DT_INI = "01/"+$('#Mes').val()+'/'+$('#Ano').val();
			 	DT_FIM = m[$('#Mes').val()]+"/"+$('#Mes').val()+'/'+$('#Ano').val();
		 	}
		 }
		 
		 
		 if(option == '3'){
		 	
		 	$('#vaccine').show();
		 	$(".loading").hide(); 
		 	$("#dados").html(htmlVacinaRest);
		 }else{
		 	 $('#vaccine').hide();
			 var clientContext = new SP.ClientContext(_spPageContextInfo.siteAbsoluteUrl);
		     var oList = clientContext.get_web().get_lists().getByTitle(json[option].title);
		     var select = "&$expand=FieldValuesAsText"; 
		     var camlQuery = new SP.CamlQuery();
		     var xml = "";
		     var filterVacina = '';
		     
		     if(option == '2'){
		     	
		     	filterVacina  = '<Filter Name="idVacina" Value="'+idVacina+'" />';
		     	var Lote = $('#idVacina option:selected').attr('lote');
		     	
		     	//PrimeiroProdutoID = ID
		     	//Lote = PrimeiroProdutoID
		     	xml = json[option].xmlHeader+filterVacina+'<Filter Name="DT_INI" Value="'+DT_INI+'" />\
		    	 	 	<Filter Name="DT_FIM" Value="'+DT_FIM+'" />\
		    	 	 	<Filter Name="ID" Value="'+parseInt(PrimeiroProdutoID,10)+'" />\
		    	 	 	<Filter Name="PaginaComando" Value="'+PaginaComando+'" />\
		    	 	 	<Filter Name="PrimeiroProdutoID" Value="'+Lote+'" />\
		    	 	 	<Filter Name="UltimoProdutoID" Value="'+UltimoProdutoID+'" />\
		    	 	 	<Filter Name="PaginaConta" Value="'+PaginaConta +'" />\
		    	 	 	<Filter Name="PaginaAtual" Value="'+PaginaAtual+'" />\
		    	 	 	<Filter Name="QuantidadePorPagina" Value="'+QuantidadePorPagina+'" />\
		 			</Method>\
					<Query/>\
						<ViewFields>'+json[option].xmlQuery+'\
						</ViewFields>\
						<RowLimit Paged="TRUE">'+QuantidadePorPagina+'</RowLimit>\
						<JSLink>clienttemplates.js</JSLink>\
						<XslLink Default="TRUE">main.xsl</XslLink>\
						<Toolbar Type="Standard"/>\
					</View>';
			 }else if(option == '5'){
			     	xml = json[option].xmlHeader+'\
			     	    <Filter Name="DT_INI" Value="'+DT_INI+'" />\
		    	 	 	<Filter Name="DT_FIM" Value="'+DT_FIM+'" />\
		 			</Method>\
					<Query/>\
						<ViewFields>'+json[option].xmlQuery+'\
						</ViewFields>\
						<RowLimit Paged="TRUE">5000</RowLimit>\
						<JSLink>clienttemplates.js</JSLink>\
						<XslLink Default="TRUE">main.xsl</XslLink>\
						<Toolbar Type="Standard"/>\
					</View>';

		     }else{
		     	 xml = json[option].xmlHeader+filterVacina+'<Filter Name="DT_INI" Value="'+DT_INI+'" />\
		    	 	 	<Filter Name="DT_FIM" Value="'+DT_FIM+'" />\
		    	 	 	<Filter Name="PaginaComando" Value="'+PaginaComando+'" />\
		    	 	 	<Filter Name="PrimeiroProdutoID" Value="'+PrimeiroProdutoID+'" />\
		    	 	 	<Filter Name="UltimoProdutoID" Value="'+UltimoProdutoID+'" />\
		    	 	 	<Filter Name="PaginaConta" Value="'+PaginaConta +'" />\
		    	 	 	<Filter Name="PaginaAtual" Value="'+PaginaAtual+'" />\
		    	 	 	<Filter Name="QuantidadePorPagina" Value="'+QuantidadePorPagina+'" />\
		 			</Method>\
					<Query/>\
						<ViewFields>'+json[option].xmlQuery+'\
						</ViewFields>\
						<RowLimit Paged="TRUE">'+QuantidadePorPagina+'</RowLimit>\
						<JSLink>clienttemplates.js</JSLink>\
						<XslLink Default="TRUE">main.xsl</XslLink>\
						<Toolbar Type="Standard"/>\
					</View>';
		     
		     }
		     
		    
		    
		    JSRequest.EnsureSetup();
			camlQuery.set_viewXml(xml);
		    collListItem = oList.getItems(camlQuery);
		    clientContext.load(collListItem);
		   
		    clientContext.executeQueryAsync(Function.createDelegate(this, module.onQuerySucceeded), Function.createDelegate(this, module.onQueryFailed)); 
		};
	};
	
	module.onQuerySucceeded = function(sender, args){
		module.MontarHtml(option,sender,args);
	};
	
	module.IsEmpty = function(string){
		return string == null || string == "" || string == undefined;
	};

	module.log = function(msg){
		if(typeof(console) != 'undefined'){
			console.log(msg);
		}
	}
	
	module.onQueryFailed = function(sender, args){
		if(typeof(console) != 'undefined'){
			console.log(args.get_message() + '\n' + args.get_stackTrace());
		}
		else{
			alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
		}
	};

	module.StringForCurrencyOrNumber = function(numero){
		return	numero = parseFloat(numero.toString().replace(',','.'));
	};
	
	module.CurrencyForString = function(numero){
		return	numero = numero.toFixed(2).toString().replace('.',',');
	};

	module.padLeft = function(value, length, char) {
    	return (value.toString().length < length) ? module.padLeft(char + value, length, char) : value;
	};
	
	module.MontarHtml = function(option,sender,args){
		
		if(option == '0'){
				var listItemEnumerator = collListItem.getEnumerator();  
		        var table ='<tr class="strong" style="border-bottom: solid 1px;">\
						  <td>Produto</td>\
						  <td>Qtde Estoque</td>\
						  <td>Valor Unitário</td>\
						  <td>Qtde</td>\
						  <td>Valor</td>\
						</tr>';
		
				var idInit = 0,idEnd = 0,PageCount = 0,PageCurrent = 0,count = 1,anterior = 0,firstValue = 0,umavez = true; 	    
		    	var QtdeUnidade = 0,SomaUnidade = 0,QtdeTotal = 0,somaTotal = 0;
		    	var vacinaObj = [];
		
		    	while (listItemEnumerator.moveNext()) {
		    	    var oListItem = listItemEnumerator.get_current();
		    	   
		    	   if(idEnd < oListItem.get_item("ID_ATENDVACINA")){   	
					 	idEnd = oListItem.get_item("ID_ATENDVACINA");
					 	
					 	if(umavez){
					 		idInit = oListItem.get_item("ID_ATENDVACINA");
							umavez = false;
						}
					}
					 	
		    	    if(idInit > oListItem.get_item("ID_ATENDVACINA")) 
		    	   		idInit = oListItem.get_item("ID_ATENDVACINA");
		   			 	
			    	if(oListItem.get_item("ID_VACINA") == anterior){ 
			    	     firstValue = module.StringForCurrencyOrNumber(firstValue) + module.StringForCurrencyOrNumber(oListItem.get_item("VALOR"));  
			    	     var ok = true;
			    	     
			    	     if(vacinaObj.length == 0){
			    	     	vacinaObj.push({'id':anterior,'valor':firstValue,'count':1})
			    	     };
			    	     
			    	     for(var i =0; vacinaObj.length > i;i++){
			    	     	if(vacinaObj[i].id == anterior){
			    	     		vacinaObj[i].valor = firstValue;
			    	     		vacinaObj[i].count = vacinaObj[i].count+1;
			    	     		ok = false;
			    	     	};
			    	     };
			    	     
			    	     if(ok){
			    	     	vacinaObj.push({'id':anterior,'valor':firstValue,'count':2});
			    	     };
			    	}else{
						table +='<tr>\
								  <td>'+oListItem.get_item("NOME")+'</td>\
								  <td>'+oListItem.get_item("DATA_ATENDIMENTO")/*QTDE unidade*/+'</td>\
								  <td>'+oListItem.get_item("ID_ATENDIMENTO")/*VALOR unidade*/+'</td>\
								  <td data-Qtde="'+oListItem.get_item("ID_VACINA")/*QtdeTotal*/+'"></td>\
								  <td data-valor="'+oListItem.get_item("ID_VACINA")/*valorTotal*/+'"></td>\
								</tr>';
						
						QtdeUnidade += module.StringForCurrencyOrNumber(oListItem.get_item("DATA_ATENDIMENTO"));
						SomaUnidade += module.StringForCurrencyOrNumber(oListItem.get_item("ID_ATENDIMENTO"));
						firstValue = oListItem.get_item("VALOR");	
						anterior = oListItem.get_item("ID_VACINA");
						
						if(collListItem.get_count() == count ){
							vacinaObj.push({'id':anterior,'valor':module.StringForCurrencyOrNumber(firstValue),'count':1});
						};
					};
					
					PageCount = oListItem.get_item("PaginaConta");
					PageCurrent = oListItem.get_item("PaginaAtual");
					
					count++;
		     }
	         table +='<tr class="total">\
					  <td>Total</td>\
					  <td data-soma="QtdeUnidade"></td>\
					  <td data-soma="SomaUnidade"></td>\
					  <td data-soma="QtdeTotal"></td>\
					  <td data-soma="somaTotal"></td>\
					</tr>';
	
	        // MUDAR ...
		        $(".loading").hide();       
		        $(".PageCurrent").html(PageCurrent);
		        $(".PageCount").html(PageCount);
		        
		        $(".Ficha").html(table);
		        
		        $(".PageOptions").show();
		        
		        var max = vacinaObj.length;
		        
		       	while(max--){
		       		$('[data-qtde="'+vacinaObj[max].id+'"]').html(vacinaObj[max].count);
		       		$('[data-valor="'+vacinaObj[max].id+'"]').html(module.CurrencyForString(vacinaObj[max].valor));
		       		QtdeTotal += module.StringForCurrencyOrNumber(vacinaObj[max].count);
		       		somaTotal += module.StringForCurrencyOrNumber(vacinaObj[max].valor);
		        };
		        
		       	$('[data-soma="QtdeUnidade"]').html(QtdeUnidade);
		       	$('[data-soma="SomaUnidade"]').html(module.CurrencyForString(SomaUnidade));
		       	$('[data-soma="QtdeTotal"]').html(QtdeTotal);
		       	$('[data-soma="somaTotal"]').html(module.CurrencyForString(somaTotal));
		       
		        $('.idInit').attr('data-idInit',idInit);
		        $('.idEnd').attr('data-idEnd',idEnd);
				
				$('.dtInit').val(module.IsEmpty($('.dtInit').val())?'30/01/2015':$('.dtInit').val());
				
				$('.dtEnd').val(module.IsEmpty($('.dtEnd').val())?Settings.Today:$('.dtEnd').val());
				
				if(PageCurrent == 1){
					$('#previous , #first').hide();
					$('.toglee').show();
					$('#next, #last').show();
					$('.togleeEnd').hide();
				}else{
					$('#previous , #first').show();
					$('.toglee').hide();
					$('#next, #last').show();
					$('.togleeEnd').hide();
				};
				
				if(PageCount == 0){
					$('#next, #last').hide();
					$('.PageCount').html('1');
				};
	
				
				if(PageCount == PageCurrent){
					$('#next, #last').hide();
					$('.togleeEnd').show();
				};
				
		}else if(option == '1'){
			
				var listItemEnumerator = collListItem.getEnumerator();  
		        var table ='<tr class="strong" style="border-bottom: solid 1px;">\
						  		<td>Médico</td>\
						  		<td>Qtde</td>\
							</tr>';
		
				var idInit = 0,idEnd = 0,PageCount = 0,PageCurrent = 0,count = 1,anterior = 0,firstValue = 0,umavez = true; 	    
		    	var QtdeUnidade = 0,SomaUnidade = 0,QtdeTotal = 0,somaTotal = 0;
		    	var medicoObj = [];
		
		    	while (listItemEnumerator.moveNext()) {
		    	    var oListItem = listItemEnumerator.get_current();
		    	   
		    	   if(idEnd < oListItem.get_item("ID_ATENDIMENTO")){   	
					 	idEnd = oListItem.get_item("ID_ATENDIMENTO");
					 	
					 	if(umavez){
					 		idInit = oListItem.get_item("ID_ATENDIMENTO");
							umavez = false;
						};
					};
					 	
		    	    if(idInit > oListItem.get_item("ID_ATENDIMENTO")) 
		    	   		idInit = oListItem.get_item("ID_ATENDIMENTO");
		   			 	
			    	if(oListItem.get_item("NOME") == anterior){ 
			    	     var ok = true;
			    	     
			    	     if(medicoObj.length == 0){
			    	     	medicoObj.push({'id':oListItem.get_item("NOME"),'nome':anterior,'count':1})
			    	     };
			    	     
			    	     var i = medicoObj.length;
			    	     while(i--){
			    	     	if(medicoObj[i].nome == anterior){
			    	     		medicoObj[i].count = medicoObj[i].count+1;
			    	     		ok = false;
			    	     	};
			    	     };
			    	    		    	     
			    	     if(ok){
			    	     	medicoObj.push({'id':oListItem.get_item("NOME"),'nome':anterior,'count':2});
			    	     };    
	
			    	}else{
						table +='<tr>\
								  <td>'+oListItem.get_item("NOME")+'</td>\
								  <td data-qtde="'+oListItem.get_item("NOME")/*QtdeTotal*/+'">1</td>\
								</tr>';
						
						anterior = oListItem.get_item("NOME");
						
						if(collListItem.get_count() == count ){
							medicoObj.push({'id':oListItem.get_item("ID_ATENDIMENTO"),'nome':anterior,'count':1});
						};
	
					};
					
					PageCount = oListItem.get_item("PaginaConta");
					PageCurrent = oListItem.get_item("PaginaAtual");
					
					count++;
		     	};
		     	
		     	//table +='<tr>\
	    		//		</tr>';
	
	        	// MUDAR ...
		        $(".loading").hide();       
		        $(".PageCurrent").html(PageCurrent);
		        $(".PageCount").html(PageCount);
		        
		        $(".Ficha").html(table);
		        
		        $(".PageOptions").show();
		        
		        var max = medicoObj.length;//-1;
		        
		       	while(max--){
		       		$('[data-qtde="'+medicoObj[max].id+'"]').html(medicoObj[max].count);
		        };
		        	       
		        $('.idInit').attr('data-idInit',idInit);
		        $('.idEnd').attr('data-idEnd',idEnd);
				$('.dtInit').val(module.IsEmpty($('.dtInit').val())?'30/01/2015':$('.dtInit').val());
				$('.dtEnd').val(module.IsEmpty($('.dtEnd').val())?Settings.Today:$('.dtEnd').val());
				
				if(PageCurrent == 1){
					$('#previous , #first').hide();
					$('.toglee').show();
					$('#next, #last').show();
					$('.togleeEnd').hide();
				}else{
					$('#previous , #first').show();
					$('.toglee').hide();
					$('#next, #last').show();
					$('.togleeEnd').hide();
				};
				
				if(PageCount == 0){
					$('#next, #last').hide();
					$('.PageCount').html('1');
				};
				
				if(PageCount == PageCurrent){
					$('#next, #last').hide();
					$('.togleeEnd').show();
				};
	
		}else if(option == '2'){	
				var listItemEnumerator = collListItem.getEnumerator();  
		        
		        var table ='<tr class="strong" style="border-bottom: solid 1px;">\
						  		<td>Paciente</td>\
						  		<td>Dt Aplicação</td>\
						  		<td>Dose</td>\
						  		<td>Dt Nascto</td>\
						  		<td>Telefone</td>\
							</tr>';
		
				var idInit = 0,idEnd = 0,PageCount = 0,PageCurrent = 0,firstValue = 0,umavez = true,NameVaccine = '',LoteVaccine = '';
		
		    	while (listItemEnumerator.moveNext()) {
		    	    var oListItem = listItemEnumerator.get_current();
		    	   
		    	   if(idEnd < oListItem.get_item("id")){   	
					 	idEnd = oListItem.get_item("id");
					 	
					 	if(umavez){
					 		idInit = oListItem.get_item("id");
							umavez = false;
						};
					};
					 	
		    	    if(idInit > oListItem.get_item("id")) 
		    	   		idInit = oListItem.get_item("id");
		   			 	
					table +='<tr>\
								<td>'+oListItem.get_item("PACIENTE")+'</td>\
								<td>'+oListItem.get_item("DT_APLICADO")+'</td>\
								<td>'+oListItem.get_item("DOSE")+'</td>\
								<td>'+oListItem.get_item("DATA_DE_NASCIMENTO")+'</td>\
								<td>'+oListItem.get_item("CONT_TIPO1")+'</td>\
							</tr>';	
					
					PageCount = oListItem.get_item("PaginaConta");
					PageCurrent = oListItem.get_item("PaginaAtual");
					NameVaccine = oListItem.get_item("NOME");
					LoteVaccine = oListItem.get_item("LOTE");
		     	};
		     	
	        	  var header = '<div>\
			        				<div style="float: left;margin: 0px 267px 0px 0px;">\
			        				    <label>Vacina :</label>\
			        				    <label> '+NameVaccine+'</label>\
			        				</div>\
			        				<div>\
			        					<label>Lote :</label>\
			        					<label>' +LoteVaccine+'</label>\
			        				</div>\
		        				</div>';
		        				
	        	$('.headerVaccine').html(header);
	        	
		        $(".loading").hide();       
		        $(".PageCurrent").html(PageCurrent);
		        $(".PageCount").html(PageCount);
		        
		        $(".Ficha").html(table);
		        
		        $(".PageOptions").show();
    
		        $('.idInit').attr('data-idInit',idInit);
		        $('.idEnd').attr('data-idEnd',idEnd);
				$('.dtInit').val(module.IsEmpty($('.dtInit').val())?'30/01/2015':$('.dtInit').val());
				$('.dtEnd').val(module.IsEmpty($('.dtEnd').val())?Settings.Today:$('.dtEnd').val());
				
				$('.headerVaccine').html();
				
				if(PageCurrent == 1){
					$('#previous , #first').hide();
					$('.toglee').show();
					$('#next, #last').show();
					$('.togleeEnd').hide();
				}else{
					$('#previous , #first').show();
					$('.toglee').hide();
					$('#next, #last').show();
					$('.togleeEnd').hide();
				};
				
				if(PageCount == 0){
					$('#next, #last').hide();
					$('.PageCount').html('1');
				};
				
				if(PageCount == PageCurrent){
					$('#next, #last').hide();
					$('.togleeEnd').show();
				};
		}else if(option == '4'){
		
				var dataIni = $('.dtInit').val();
				var dataFim = $('.dtEnd').val();
				
				var listItemEnumerator = collListItem.getEnumerator();  
		       
		
				function dataFormat(date){
					return new Date(date.split('/')[2],(date.split('/')[1]-1),date.split('/')[0]);
				}
		
				var idInit = 0,idEnd = 0,PageCount = 0,PageCurrent = 0,count = 1,anterior = 0,firstValue = 0,umavez = true; 	    
		    	var QtdeUnidade = 0,SomaUnidade = 0,QtdeTotal = 0,somaTotal = 0;
		    	var vacinaObj = [];
				var vacinaObjAll = [];
				
		    	while (listItemEnumerator.moveNext()) {
		    	    var oListItem = listItemEnumerator.get_current();
		    	 					 	
					vacinaObjAll.push(
					{
						'id':oListItem.get_item("ID_ATENDVACINA"),
						'data':dataFormat(oListItem.get_item("APLICADO")),
						'valor':oListItem.get_item("VALOR"),
						'nome':oListItem.get_item("NOME"),
						'valor_unitario':oListItem.get_item("ID_ATENDIMENTO"),
						'paciente':oListItem.get_item("ID_VACINA")
					
					});
					 		
		     	}
		     	
		     	console.log(vacinaObjAll);
		     	
		     
				vacinaObjAll.sort(function(a,b){
					// Turn your strings into dates, and then subtract them
					// to get a value that is either negative, positive, or zero.
					//return new Date(b.data) - new Date(a.data);
					if(a.paciente< b.paciente) return -1;
				    if(a.paciente> b.paciente) return 1;
				    return 0;
				});
				
				var somaDose = 0;
				var somaValor = 0;
				
				var dataAnterior = new Date('99/01/01');
				var vacinaOrdenador = []
				//console.log(vacinaOrdenador);
				//console.log(vacinaObjAll);
				for(var i in vacinaObjAll){
					
					/*if(vacinaObjAll[i].data.getUTCDate() == dataAnterior.getUTCDate() && vacinaObjAll[i].data.getUTCMonth() == dataAnterior.getUTCMonth()){
						for(var d in vacinaOrdenador){
							if(vacinaOrdenador[d].dia == vacinaObjAll[i].data.getUTCDate()){
								somaValor += module.StringForCurrencyOrNumber(vacinaObjAll[i].valor);
							}
						}
					
					}else{*/
					
						vacinaOrdenador.push({
							'dia':vacinaObjAll[i].data.getUTCDate(),
							'qtd':1,
							'valor':module.StringForCurrencyOrNumber(vacinaObjAll[i].valor),
							'nome':vacinaObjAll[i].nome,
							'valor_unitario':vacinaObjAll[i].valor_unitario,
							'paciente':vacinaObjAll[i].paciente
						})
						
						//dataAnterior = vacinaObjAll[i].data;
					//}
					somaValor += module.StringForCurrencyOrNumber(vacinaObjAll[i].valor);
					somaDose += 1
				}
				
				 var table ='<tr class="strong">\
						  <td>Paciente</td>\
						  <td>Vacina</td>\
						  <td>Qtde</td>\
						  <td>Valor</td>\
						</tr>';
						
				var max = vacinaOrdenador.length;
				var pacienteAnterior = "";
				var count = 0;
				var somaPacVac = 0;
				var totalPacientes = 0;
				while(max > count){
							
							//style="border-bottom: solid 1px;"
					if(pacienteAnterior != vacinaOrdenador[count].paciente){
						
						if(pacienteAnterior != ""){		
							table +='<tr>\
							            <td></td>\
										<td>'+"VC/MC ?"+'</td>\
										<td>'+"====>"+'</td>\
										<td>'+module.CurrencyForString(somaPacVac)+'</td>\
								    <tr>';
							somaPacVac = 0;
						}	
						totalPacientes ++;
						table +='<tr style="border-top: solid 1px;">\
						            <td>'+vacinaOrdenador[count].paciente+'</td>\
									<td>'+vacinaOrdenador[count].nome+'</td>\
									<td>'+1+'</td>\
									<td>'+module.CurrencyForString(vacinaOrdenador[count].valor)+'</td>\
							    <tr>';
							     somaPacVac += vacinaOrdenador[count].valor;
						    	
					}else{
					
						//if( undefined != vacinaOrdenador[count+1]){ 
							//if(vacinaOrdenador[count].nome == vacinaOrdenador[count+1].nome){
								table +='<tr>\
								            <td></td>\
											<td>'+vacinaOrdenador[count].nome+'</td>\
											<td>'+1+'</td>\
											<td>'+module.CurrencyForString(vacinaOrdenador[count].valor)+'</td>\
									    <tr>';
									    
									 somaPacVac += vacinaOrdenador[count].valor;
							// }else{
								
							//}

						//}else{
						//	table +='<tr>\
						//	            <td></td>\
						//				<td>'+"VC/MC ?"+'</td>\
						//				<td>'+"====>"+'</td>\
						//				<td>'+module.CurrencyForString(somaPacVac)+'</td>\
						//		    <tr>';
						//	somaPacVac = 0;
						//}
					}
					if( undefined == vacinaOrdenador[count+1]){ 
							table +='<tr>\
							            <td></td>\
										<td>'+"VC/MC ?"+'</td>\
										<td>'+"====>"+'</td>\
										<td>'+module.CurrencyForString(somaPacVac)+'</td>\
								    <tr>';
					}
					
				
					pacienteAnterior = vacinaOrdenador[count].paciente;
					count++;
				}
				
			table += "<tr style='border-top: solid 1px;'>\
								<td>Total do Dia:</td>\
								<td> "+totalPacientes+" Paciente(s)</td>\
							     <td>"+somaDose +"</td>\
							     <td>"+module.CurrencyForString(somaValor)+"</td>\
							</tr>";
							
					
			$(".loading").hide(); 
			$(".Ficha").html(table);    
							
		}else if(option == '5'){
			var listItemEnumerator = collListItem.getEnumerator();  
		        
		        var table ='<tr>\
						  		<th>Paciente</th>\
						  		<th>Vacina</th>\
						  		<th>Qtde</th>\
						  		<th>Valor</th>\
						  		<th>Aplicador</th>\
							</tr>';
		
		        var Total = 0;
		    	while (listItemEnumerator.moveNext()) {
		    	    var oListItem = listItemEnumerator.get_current();
		    	 		   	
					table +='<tr><td>'+oListItem.get_item("DT_APLICADO")+'</td></tr>';
					table +='<tr>\
								<td>'+oListItem.get_item("PACIENTE")+'</td>\
								<td>'+oListItem.get_item("NOME")+'</td>\
								<td>'+1+'</td>\
								<td>'+oListItem.get_item("VALOR_PAGO")+'</td>\
								<td>'+oListItem.get_item("APLICADO_POR")+'</td>\
							</tr>';	
							
					Total += module.StringForCurrencyOrNumber(oListItem.get_item("VALOR_PAGO"));
		     	};
		     	
		     	table +='<tr colspan="2"><td></td><td></td><td>Total:</td><td>'+module.CurrencyForString(Total)+'</td></tr>';

	        		        				
	        	$('.Ficha').html(table);
		        $(".loading").hide();       
		}
	};
		
	return {
		init : module.init,
		getReports : module.getReports
	};
}());
