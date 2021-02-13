var app = require('http').createServer(resposta); // Criando o servidor
var fs = require('fs'); // Sistema de arquivos
var io = require('socket.io')(app); // Socket.IO
const Schema = require("./dispositivos_pb");
const Logado = require("./login_pb");

var usuarios = []; // Lista de usuários
var ultimas_mensagens = []; // Lista com ultimas mensagens enviadas no chat

var ip_default = '127.0.0.1';
var port = 7000;

app.listen(port);

console.log("Aplicação está em execução...");
// Função principal de resposta as requisições do servidor
function resposta (req, res) {
	var arquivo = "";
	if(req.url == "/"){
		arquivo = __dirname + '/index.html';
	}else{
		arquivo = __dirname + req.url;
	}
	fs.readFile(arquivo,
		function (err, data) {
			if (err) {
				res.writeHead(404);
				return res.end('Página ou arquivo não encontrados');
			}

			res.writeHead(200);
			res.end(data);
		}
	);
}

	io.on("connection", function(socket){
	// Método de resposta ao evento de entrar

	setInterval(function(){
		socket.emit("clienteStatus");
	},10000);
	
	socket.on("entrar", function(dados, callback){
	
		var msg2 = Logado.Login.deserializeBinary(dados);
		var objetoIp = msg2.toArray()[0];
		var objetoporta = msg2.toArray()[1];

		if(ip_default != objetoIp){	
			callback(1);
		}else if(port != objetoporta){
			callback(2);
		}else{
			callback(3);
			console.log('usuario entrou na aplicacao');
		}
	});



	socket.on("mudar status", function(dados){
	
		let recebido = Schema.Dispositivo.deserializeBinary(dados);
		let recebidoId = 	 recebido.toArray()[0];
		let recebidoNome =   recebido.toArray()[1];
		let recebidoStatus = recebido.toArray()[2];
		let recebidoTemp =   recebido.toArray()[3];
		
		
		let msg = new Schema.Dispositivo();
		msg.setId(recebidoId);
		msg.setName(recebidoNome);
		msg.setTemp(recebidoTemp);
		if(recebidoStatus == true){
			msg.setStatus(false);
			recebidoStatus = false;
			let msgByte = msg.serializeBinary();
			socket.emit("desligar" , msgByte);
			
		}else{
			msg.setStatus(true);
			recebidoStatus = true;
			let msgByte = msg.serializeBinary();
			socket.emit("ligar" , msgByte);
		}
		console.log(recebidoNome + 'status = ' +recebidoStatus);

	});

	socket.on("aumentar temperatura", function(dados){
		let recebido = Schema.Dispositivo.deserializeBinary(dados);
		let recebidoId = 	 recebido.toArray()[0];
		let recebidoNome =   recebido.toArray()[1];
		let recebidoStatus = recebido.toArray()[2];
		let recebidoTemp =   recebido.toArray()[3];

		let msg = new Schema.Dispositivo();
		msg.setId(recebidoId);
		msg.setName(recebidoNome);
		msg.setStatus(recebidoStatus);
		msg.setTemp(recebidoTemp+1);
		TempAtual = recebidoTemp+1;
		let msgByte = msg.serializeBinary();
		socket.emit("atualizar temperatura" , msgByte);
	});

	 

	socket.on("diminuir temperatura", function(dados){
		let recebido = Schema.Dispositivo.deserializeBinary(dados);
		let recebidoId = 	 recebido.toArray()[0];
		let recebidoNome =   recebido.toArray()[1];
		let recebidoStatus = recebido.toArray()[2];
		let recebidoTemp =   recebido.toArray()[3];

		let msg = new Schema.Dispositivo();
		msg.setId(recebidoId);
		msg.setName(recebidoNome);
		msg.setStatus(recebidoStatus);
		msg.setTemp(recebidoTemp-1);
		TempAtual =recebidoTemp-1;
		let msgByte = msg.serializeBinary();
		socket.emit("atualizar temperatura" , msgByte);
	});


	//botao Olhar temperatura
	socket.on("olhar temperatura", function(dados){
		let recebido = Schema.Dispositivo.deserializeBinary(dados);
		let recebidoId = 	 recebido.toArray()[0];
		let recebidoNome =   recebido.toArray()[1];
		let recebidoStatus = recebido.toArray()[2];
		let recebidoTemp =   recebido.toArray()[3];
		if(recebidoTemp > 30){
			console.log('temperatura elevada,melhor baixar : ' +recebidoTemp);
		}else if(recebidoTemp <15){
			console.log('temperatura muito baixa, melhor subir : ' +recebidoTemp);
		}else{
			console.log(recebidoTemp);
		}
		
	});

	
	

	socket.on("show all", function(dados){
	var recebidos = Schema.Dispositivos.deserializeBinary(dados);
	var TempAtual = recebidos.toArray()[0][2][3];
	var statusAr = recebidos.toArray()[0][2][2];
	recebidos = recebidos.toArray()[0];
	
	
	if(statusAr != true){
		TempAtual = 0;
	}
	console.log('TempAtual = '+TempAtual);
	console.log('statusAr = '+statusAr);
	});


	//botao Todos os status precionado
	socket.on("allStatus" ,function(dados){
	var recebidos = Schema.Dispositivos.deserializeBinary(dados);
	recebidos = recebidos.toArray()[0];
	console.log(recebidos);
	});
	

	//se o botao sair for acionado
	socket.on("sair", function(){
		console.log('Usuario saiu da aplicação');
	});


	//se a página for fechada
	socket.on("disconnect", function(){
		console.log('Usuario saiu da aplicação');
	});

});
