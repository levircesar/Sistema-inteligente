var $ = require('jquery')
const Schema = require("./dispositivos_pb");
const Logado = require("./login_pb");

/*COMECAR CONEXAO*/

var socket = io.connect();


var lampada = new Schema.Dispositivo();

lampada.setId(1);
lampada.setName("lampada");
lampada.setStatus(true);
lampada.setTemp(80.5);

var televisao = new Schema.Dispositivo();

televisao.setId(2);
televisao.setName("televisao");
televisao.setStatus(true);
televisao.setTemp(0);

var arcondicionado = new Schema.Dispositivo();

arcondicionado.setId(3);
arcondicionado.setName("arcondicionado");
arcondicionado.setStatus(false);
arcondicionado.setTemp(17);


var todos = new Schema.Dispositivos();
todos.addDispositivos(lampada);
todos.addDispositivos(televisao);
todos.addDispositivos(arcondicionado);

var todosBytes = todos.serializeBinary();
var lampadaBytes = lampada.serializeBinary();
var televisaoBytes = televisao.serializeBinary();
var arcondicionadoBytes = arcondicionado.serializeBinary();



/*
var button = $('<button/>').html('click me').on('click', function() {
    alert('it worked fine')
  });

var button2 = $('<button/>').html('click me2').on('click', function() {
console.log(hussein);
});

$('body').append(button)

$('body').append(button2)



*/
/*INICIO*/

$("form#login").submit(function(e){
  e.preventDefault();
  var ip = $(this).find("#ip_input").val();
  var porta = $(this).find("#porta_serv").val();
  var aplicacao = new Logado.Login();
  aplicacao.setIp(ip);
  aplicacao.setPorta(porta);
  var aplicacaoBytes = aplicacao.serializeBinary();

  console.log('ip = '+ aplicacao.getIp());
  console.log('porta = '+ aplicacao.getPorta());

  atualizarTemp();

  // Evento enviado quando o usuário insere um apelido
  socket.emit("entrar", aplicacaoBytes , function(valido){
    if(valido == 3){
      // Se tudo estiver certo, ok
      $("#acesso_usuario").hide();
      $(".chamada").hide();
      $("#sala_chat").show();
      
    }else if (valido ==1){
      //SE o IP for diferente do servidor é apresentado um alert
      $("#acesso_usuario").val("");
      alert("IP do servidor invalido");
    }else if (valido ==2){
      //SE a porta for diferente da porta do servidor é apresentado um alert
      $("#acesso_usuario").val("");
      alert("Porta do servidor invalida");
    }
  });

  socket.emit("show all",todosBytes);
});


pegarTemp();
function pegarTemp(){
  return arcondicionado.getTemp();
}

statusTv();
function statusTv(){
  return televisao.getStatus();
}

atualizarTemp();
function atualizarTemp(){
  if(arcondicionado.getStatus() != true){
    $("form#valorTemp").find("[name=temp]").val('desligado');
  }else{
    $("form#valorTemp").find("[name=temp]").val(pegarTemp());
  }
 
}


pegarCor();
function pegarCor(){
  let l = lampada.getStatus();
  let t= televisao.getStatus();
  let a =arcondicionado.getStatus();
  if(l == true){
    $('#luz').css('background-color','yellow');
  }else{
    $('#luz').css('background-color','black');
  }

  if(t == true){
    $('#visor').css('background-color','yellow');
  }else{
    $('#visor').css('background-color','black');
  }

  if(a == true){
    $('#led').css('background-color','yellow');
  }else{
    $('#led').css('background-color','black');
  }

}


//console.log('lampada status: ' + lampada.getStatus());
//console.log('televisao status: ' + televisao.getStatus());
//console.log('arcondicionado status: ' + arcondicionado.getStatus());

socket.on("clienteStatus" , function(){
  todosBytes = todos.serializeBinary();
  socket.emit("show all",todosBytes);
});



$("#sair").click(function(e){
  socket.emit("sair");
  socket.close();
  window.location.replace("index.html");
  alert('Voce deixou a aplicação');
});

$("#teste1").click(function(e){
  e.preventDefault();
  arcondicionadoBytes = arcondicionado.serializeBinary();
  socket.emit("olhar temperatura",arcondicionadoBytes);
});


$("#lampada").click(function(e){
  e.preventDefault();
  lampadaBytes = lampada.serializeBinary();
  socket.emit("mudar status",lampadaBytes);
});

$("#televisao").click(function(e){
  e.preventDefault();
  televisaoBytes = televisao.serializeBinary();
  socket.emit("mudar status",televisaoBytes);
});

$("#arcondicionado").click(function(e){
  e.preventDefault();
  arcondicionadoBytes = arcondicionado.serializeBinary();
  atualizarTemp();
  socket.emit("mudar status",arcondicionadoBytes);
});

$("#aumentarTemp").click(function(e){
  e.preventDefault();
  arcondicionadoBytes = arcondicionado.serializeBinary();
  socket.emit("aumentar temperatura",arcondicionadoBytes);
});

$("#diminuirTemp").click(function(e){
  e.preventDefault();
  arcondicionadoBytes = arcondicionado.serializeBinary();
  socket.emit("diminuir temperatura",arcondicionadoBytes);
});



$("#allStatus").click(function(e){
  e.preventDefault();
  todosBytes = todos.serializeBinary();
  socket.emit("allStatus",todosBytes);
});



socket.on("desligar", function(dados){
  let recebido = Schema.Dispositivo.deserializeBinary(dados);
  let recebidoId = 	   recebido.toArray()[0];
  if(recebidoId == 1){
    lampada.setStatus(false);
    lampadaBytes = lampada.serializeBinary();
    console.log('lampada status: ' + lampada.getStatus());
    pegarCor();
  }else if(recebidoId == 2){
    televisao.setStatus(false);
    televisaoBytes = televisao.serializeBinary();
    console.log('televisao status: ' + televisao.getStatus());
    pegarCor();
  }else if(recebidoId == 3){
    arcondicionado.setStatus(false);
    arcondicionadoBytes = arcondicionado.serializeBinary();
    console.log('arcondicionado status: ' + arcondicionado.getStatus());
    pegarCor();
  }
  atualizarTemp();
});

socket.on("ligar", function(dados){
  let recebido = Schema.Dispositivo.deserializeBinary(dados);
  let recebidoId = 	   recebido.toArray()[0];
  if(recebidoId == 1){
    lampada.setStatus(true);
    lampadaBytes = lampada.serializeBinary();
    console.log('lampada status: ' + lampada.getStatus());
    pegarCor();
   // alert('lampada ligada');
  }else if(recebidoId == 2){
    televisao.setStatus(true);
    televisaoBytes = televisao.serializeBinary();
    console.log('televisao status: ' + televisao.getStatus());
    pegarCor();
  }else if(recebidoId == 3){
    arcondicionado.setStatus(true);
    arcondicionadoBytes = arcondicionado.serializeBinary();
    console.log('arcondicionado status: ' + arcondicionado.getStatus());
    pegarCor();
  }

  atualizarTemp();
});


socket.on("atualizar temperatura" ,function(dados){
  let recebido = Schema.Dispositivo.deserializeBinary(dados);
  let recebidoId = 	   recebido.toArray()[0];
  let recebidoTemp =   recebido.toArray()[3];
  if(recebidoId == 1){
    lampadaBytes = lampada.serializeBinary();
    alert('temperatura atualizada');
  }else if(recebidoId == 2){
    televisaoBytes = televisao.serializeBinary();
    alert('temperatura atualizada');
  }else if(recebidoId == 3){
    arcondicionado.setTemp(recebidoTemp);
    arcondicionadoBytes = arcondicionado.serializeBinary();
  }
  atualizarTemp();
});


socket.on("show all", function(dados){
  let recebidos = Schema.Dispositivos.deserializeBinary(dados);
	recebidos = recebidos.toArray()[0];
  console.log(recebidos);
});
