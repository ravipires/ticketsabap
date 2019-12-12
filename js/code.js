const tipoReqAjaxGet = 'get';
const tipoDadoAjaxJSON = 'json';
const urlPrincipal = "https://ts.accenture.com/sites/Recife_SAP_AM/_api/web/lists/getbytitle('Tickets%20Management')/items?$filter=ProjectId eq '13'";
const usuarioResponsavel = "https://ts.accenture.com/sites/Recife_SAP_AM/_api/Web/SiteUsers";
const statusTicket = "https://ts.accenture.com/sites/Recife_SAP_AM/_api/Web/Lists(guid'020a3b87-79ea-4217-9715-830a6d3662c2')/items";
const tipoTicket = "https://ts.accenture.com/sites/Recife_SAP_AM/_api/Web/Lists(guid'6de75817-585d-453a-b69f-ba49dca22ac8')/items";
const abaps = "https://ts.accenture.com/sites/Recife_SAP_AM/_api/Web/sitegroups/GetById(1020)/users";
//var textAreaEndereco = $( '#textAreaEndereco' );
var textAreaResposta = $( '#textAreaResposta' );
var buttonEnviar = $( '#buttonEnviar' );

var odataUsuario = [];
var odataTickets = [];
var odataTipoTicket = []; 
var odataStatusTickets = [];
var odataAbaps = [];
var objetoAbap = "";

// Função responsável em tornar a tabela editável.
function editTable() {
    $('#tabela tbody tr').each(function (i) {
        $(this).children('td.editavel').each(function (p) {
            $(this).dblclick(function () {
            
                var conteudoOriginal = $(this).text();
                var novoElemento = $('<input onchange="atualizaUsuario(this)"/>', { type:'date', valuekey: "value",});
                $(this).html(novoElemento.blur(function () {
                	//$(this).autocomplete({source: vetorUsuarios}); 
                    var conteudoNovo = $(this).val();
                    var posicao = p + 1;
                    var posicao2 = i + 1;
                 
                    if (conteudoNovo == ""){
                        $(this).parent().html(conteudoOriginal);
                    }
                     else {
                        $(this).parent()
                        .html(conteudoNovo)
                        .parents('tr')
                        .next()
                        .children('td:nth-child(' + posicao2 + ')')
                        .trigger('dbclick');
                    }  
	                                                     
                }
                ));

               	$(this).children().select();

               
            })
        })
    })
}
function atualizaUsuario(input){
	var existe = false;
	var add = false;
	var possivesUsuarios = [];
    var quantidadeUsuarios = odataUsuario[0].value.length;
    for(var contador = 0; contador < quantidadeUsuarios; contador++){
   		if(odataUsuario[0].value[contador].Title == input.value){
   			existe = true;
   		} else {
   			var usuario = odataUsuario[0].value[contador].Title
   			var possivelUsuario = usuario.split(" ");
   			for( var acesso = 0; acesso < possivelUsuario.length; acesso++){
   				if(possivelUsuario[acesso] == input.value){
   					possivesUsuarios.push(usuario);
   					possivesUsuarios.push("\n");
   					add = true;
   				}
   			}
   		}
    }
    if(add == true){
    	alert("Ops, você quis dizer algum desses usuários? \n" + possivesUsuarios);
    }

	if(existe == false && add == false){
		alert("Ops, esse usuário não existe no SharePoint.");
	}

	if(existe == true){
		alert("Modificado com sucesso!");	
		debugger;
		var clientContext = new SP.ClientContext("https://ts.accenture.com/sites/Recife_SAP_AM/_api/Web/SiteUsers");
		var oListItem = clientContext;
		var id = odataUsuario[0].value[contador].Id;
   		this.oListItem = clientContext.getItemById(id);

    	oListItem.set_item('Title', usuario);
	    oListItem.update();

	    /*
	    clientContext.executeQueryAsync(
	        Function.createDelegate(this, this.onQuerySucceeded), 
	        Function.createDelegate(this, this.onQueryFailed)
	    );
	    */
	}
}

// Função responsável por realizar a atualização dos objetos e enviar para o share point
function updateListItem(siteUrl) {
    var clientContext = new SP.ClientContext(siteUrl);
    var oList = clientContext.get_web().get_lists().getByTitle('Announcements');

    
}

function onQuerySucceeded() {
    alert('Item updated!');
}

function onQueryFailed(sender, args) {
    alert('Request failed. ' + args.get_message() + 
        '\n' + args.get_stackTrace());
}

//Função responsável em nos manter informados se a requisição ajax está funcionando ou não.
function beforeSendRequisicao()
{
	console.log( 'Enviando Requisição AJAX' );
}
function retornaUsuario(){

}

//Função principal que realiza consulta na lista principal e nas sublistas referentes as informações necessárias.
function enviarRequisicao()
{
	$.ajax({
		url: urlPrincipal,
		type: tipoReqAjaxGet,
		dataType: tipoDadoAjaxJSON,
		beforeSend: beforeSendRequisicao,
		async: false,
		success: function( data, textStatus, jqXHR) {
			$("#tickets").html( JSON.stringify( data, null, '\t' ) );
			odataTickets.push(data);
			//var jsonData = data;
			//Precisamos varrer cada objeto, capturar as linhas desejada e inserir os dados na tabela

			console.group( "data" );
			console.log( data );
			console.groupEnd( "data" );
			
			console.group( "textStatus" );
			console.log( textStatus );
			console.groupEnd( "textStatus" );	
			
			console.group( "jqXHR" );
			console.log( jqXHR );
			console.groupEnd( "jqXHR" );	
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log( 'Ocorreu um Erro na Requisição AJAX' );
			console.group( "jqXHR" );
			console.log( jqXHR );
			console.groupEnd( "jqXHR" );
			
			console.group( "textStatus" );
			console.log( textStatus );
			console.groupEnd( "textStatus" );	
			
			console.group( "errorThrown" );
			console.log( errorThrown );
			console.groupEnd( "errorThrown" );		
		}
		
	});
	
	// requisição para abaps e funcionais
	var urlUsuario = usuarioResponsavel;
	$.ajax({
		url: urlUsuario,
		type: tipoReqAjaxGet,
		dataType: tipoDadoAjaxJSON,
		beforeSend: beforeSendRequisicao,
		async: false,
		success: function( dataUsuario, textStatus, jqXHR) {
			$("#usuario").html( JSON.stringify( dataUsuario, null, '\t' ) );
			odataUsuario.push(dataUsuario);

		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log( 'Ocorreu um Erro na Requisição AJAX' );
		}
	});

	// Requisição para status dos tickets
	var urlTicket = statusTicket;
	$.ajax({
		url: urlTicket,
		type: tipoReqAjaxGet,
		dataType: tipoDadoAjaxJSON,
		beforeSend: beforeSendRequisicao,
		async: false,
		success: function( dataTicket, textStatus, jqXHR) {
			$("#statusTicket").html( JSON.stringify( dataTicket, null, '\t' ) );
			odataStatusTickets.push(dataTicket);
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log( 'Ocorreu um Erro na Requisição AJAX' );
		}
	});

	// requisição para os tipos de tickets
	var urlTipoTicket = tipoTicket;
	$.ajax({
		url: urlTipoTicket,
		type: tipoReqAjaxGet,
		dataType: tipoDadoAjaxJSON,
		beforeSend: beforeSendRequisicao,
		async: false,
		success: function( dataTipoTicket, textStatus, jqXHR) {
			$("#tipoTicket").html( JSON.stringify( dataTipoTicket, null, '\t' ) );
			odataTipoTicket.push(dataTipoTicket);
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log( 'Ocorreu um Erro na Requisição AJAX' );
		}
	});
	// requisição para os abaps
	var urlAbaps = abaps;
	$.ajax({
		url: urlAbaps,
		type: tipoReqAjaxGet,
		dataType: tipoDadoAjaxJSON,
		beforeSend: beforeSendRequisicao,
		async: false,
		success: function( dataAbaps, textStatus, jqXHR) {
			$("#tipoTicket").html( JSON.stringify( dataAbaps, null, '\t' ) );
			odataAbaps.push(dataAbaps);
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log( 'Ocorreu um Erro na Requisição AJAX' );
		}
	});


	//LÓGICA DE COMPARAÇÃO ENTRE AS LISTAS
	//odataUsuario / odataTickets / odataTipoTicket / odataStatusTickets / odataAbaps
	var quantidadeTickets = odataTickets[0].value.length;
	for(var contador = 0; contador < quantidadeTickets; contador++){
		//capturando nome do abap e do funcional
		var idUsuario = odataTickets[0].value[contador].BRDC_x0020_DeveloperId;
		var idFuncional = odataTickets[0].value[contador].Owner1Id;
        var quantidadeUsuarios = odataUsuario[0].value.length;
        var quantidadeAbaps = odataAbaps[0].value.length;
        var idAbap = odataTickets[0].value[contador].BRDC_x0020_DeveloperId;

		for(var acessoOdataUsuario = 0; acessoOdataUsuario < quantidadeUsuarios; acessoOdataUsuario++){
			if(odataUsuario[0].value[acessoOdataUsuario].Id == idFuncional){
				var funcional = odataUsuario[0].value[acessoOdataUsuario].Title;
				$("#funcional").html(funcional);
			}
		}

		for(var acessoOdataAbap = 0; acessoOdataAbap < quantidadeAbaps; acessoOdataAbap++){
			if(odataAbaps[0].value[acessoOdataAbap].Id == idAbap){
				var abap = odataAbaps[0].value[acessoOdataAbap].Title;
				$("#abap").html(abap);
			}
		}
			

		var idTicket = odataTickets[0].value[contador].StatusId;
		var vetorTickets = odataStatusTickets[0].value.length;
		for(var acessoOdataTicket = 0; acessoOdataTicket < vetorTickets; acessoOdataTicket++){
			if(odataStatusTickets[0].value[acessoOdataTicket].Id == idTicket){
				var status = odataStatusTickets[0].value[acessoOdataTicket].Title;
				$("#statusTicket").html(status);
			} 
		}

		var idTipoTicket = odataTickets[0].value[contador].Document_x0020_TypeId;
		var vetorTipos = odataTipoTicket[0].value.length;
		for(var acessoOdataTipo = 0; acessoOdataTipo < vetorTipos; acessoOdataTipo++){
			if(odataTipoTicket[0].value[acessoOdataTipo].Id == idTipoTicket){
				var tipo = odataTipoTicket[0].value[acessoOdataTipo].Title;
				$("#tipoTicket").html(tipo);
			} 
		}


		var newRow = $("<tr>");
		var cols = "";
		var acesso = 0;

		cols += '<td>' + 'farol'  +'</td>';
		cols += '<td class="editavel">' + odataTickets[0].value[contador].Sub_x0020_project +'</td>';
		cols += '<td class="editavel">' + odataTickets[0].value[contador].RICEF +'</td>';
		cols += '<td class="editavel">' + odataTickets[0].value[contador].ID +'</td>';
		cols += '<td class="editavel">' + $("#tipoTicket").html(); +'</td>';
		cols += '<td class="data editavel">' + odataTickets[0].value[contador].SLA_x0020_Hold_x0020_Start_x0020 +'</td>';
		cols += '<td class="data editavel">' + odataTickets[0].value[contador].SLA_x0020_Hold_x0020_End_x0020_D +'</td>';
		cols += '<td class="data editavel">' + odataTickets[0].value[contador].Created +'</td>';
		cols += '<td class="data editavel">' + odataTickets[0].value[contador].Created +'</td>';
		cols += '<td class="data editavel">' + odataTickets[0].value[contador].Data_x0020_Limite_x0020_Funciona +'</td>';
		cols += '<td class="data editavel">' + odataTickets[0].value[contador].Created +'</td>';
		cols += '<td class="editavel">' + odataTickets[0].value[contador].Ticket_x0020_Short_x0020_Descrip +'</td>';
		cols += '<td class="editavel">' + $("#statusTicket").html(); +'</td>';
		cols += '<td class="editavel"><select class="abapSelection"><option>' + $("#abap").html() +'</option></select></td>';
		cols += '<td class="editavel">' + $("#funcional").html() +'</td>';
		cols += '<td class="editavel">' + 'historico' +'</td> </tr>';
		
		newRow.append(cols);
		/*
		for(var acesso = 0; acesso < quantidadeAbaps; acesso++){
			$(".abapSelection").append("<option>" + odataAbaps[0].value[acesso].Title + "</option>");
		}
		*/
		//$(".abapSelection").append(objetoAbap);
		$("#colunsTable").append(newRow);
		$("#abap").html("");
		$("#funcional").html("");
		$("#statusTicket").html("");
		$("#tipoTicket").html("");
		

		
	}
	$('#tabela').css({display:'block'});
	$('#tabela').DataTable({
		"scrollX": true,
		"columnDefs": [
    		{ "orderable": false, "targets": 11}
  		],
  		//s"paging": false
	});
	//$('td').css({width = '100px'});
	debugger;
	editTable();
}

function exibirData(){
	$(".data").slideToggle("slow");

}

function inicializarBotoes()
{
	buttonEnviar.click( enviarRequisicao );
}

function inicializarInputs()
{
	inicializarBotoes();
}

function documentReady()
{
	inicializarInputs();
}

$( document ).ready( documentReady );
