// Crear un servidor HTTP Línea 1-15 (configuración del servidor)
var http = require("http");
var httpServer = http.createServer();

// Crear servidor WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
	httpServer: httpServer
});

// Iniciar el servidor HTTP en un puerto
var puerto = 4444;
httpServer.listen(puerto, function () {
	console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});
var datos = require("./datos.js")
var especialidades = datos.esp
var centros = datos.cen
var medicos = datos.med
var expedientes = datos.exp

var conexiones = []; // array con todas las conexiones
wsServer.on("request",function(request){// "open"
	var connection = request.accept("saludos", request.origin); //Lo acepto
	//conexion
	var cliente = {
		conexion: connection, //asocio a la conexion un nombre
		nombre: null // aun no se quien es el destinatario
	}
	conexiones.push(cliente)
	//Mensaje recibido del cliente
	connection.on("message",function(message){
		if(message.type === "utf8"){
			console.log("mensaje recbido"+message.utf8Data)
		}
		var msg = JSON.parse(message.utf8Data)
		console.log("Mensaje en JSON",msg)
		switch(msg.operacion){
			case "identificarse":
				cliente.nombre = msg.nombre
				console.log("WS: Se ha identificado "+cliente.nombre)
				//aviso a los que se están conectados de que hay uno nuevo
				//informar al nuevo (este cliente) de los nombre de los otros clientes que ya había
				for (var i=0; i<conexiones.length;i++){
					if(conexiones[i] !== cliente){
						conexiones[i].conexion.sendUTF(message.utf8Data)//aviso a otro de mi (mando el mismo msg)
						connection.sendUTF(JSON.stringify({ //aviso a mi de otro
							operacion: "nuevo",
							nombre: conexiones[i].nombre
						}))
					}
				}
				break;
				case "mensajeindividual":
					for (var i = 0; i < conexiones.length; i++) {
						// Si el destinatario en conexiones es el médicoME
						if (conexiones[i].nombre === medicos[msg.destinatario-1].nombre) {
							conexiones[i].conexion.sendUTF(message.utf8Data);
						}
					}
			break;
			case "mensajegrupal": 
			for (var i = 0; i < conexiones.length; i++) {
				// Si el destinatario en conexiones es un médico
				if (conexiones[i] !== cliente) {
					conexiones[i].conexion.sendUTF(message.utf8Data);
				}
		}
	}
})
})