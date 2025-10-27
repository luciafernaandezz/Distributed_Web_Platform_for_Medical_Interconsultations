//Crear conexión WS con el servidor
var conexion = new WebSocket("ws://localhost:4444", "saludos");
conexion.addEventListener("open", function () {
    console.log("Cliente conectado!!!");
});
conexion.addEventListener("close", function () {
    console.log("Desconectado del servidor!!!");
});
conexion.addEventListener("error", function () {
    console.log("Error con la conexión!!!");
});

// Evento de recepción del mensaje
let receivedMessagesByExpediente = {};
conexion.addEventListener("message", function (event) {
    console.log("📩 Mensaje recibido en el cliente:", event.data);
    
    let msg = JSON.parse(event.data);
    console.log("Mensaje en JSON: ", msg);
    switch (msg.operacion) {
        case "mensajeindividual":
            // Almacenar mensajes en su respectivo expediente
            if (!receivedMessagesByExpediente[msg.expediente_id]) {
            receivedMessagesByExpediente[msg.expediente_id] = [];
            }
            receivedMessagesByExpediente[msg.expediente_id].push(msg);
            console.log("📨 Recibiendo un mensaje individual...");
            console.log(`Expediente actual: ${id_exp}, Mensaje para expediente: ${msg.expediente_id}`);
            if (msg.expediente_id === id_exp) {
                console.log("se van a mostrar los mensajes");
                mostrarMensajesEnChat(msg.expediente_id);
            }
            break;

        case "mensajegrupal":
            if (!receivedMessagesByExpediente[msg.expediente_id]) {
                receivedMessagesByExpediente[msg.expediente_id] = [];
                }
                receivedMessagesByExpediente[msg.expediente_id].push(msg);
                console.log(`Expediente actual: ${id_exp2}, Mensaje para expediente: ${msg.expediente_id}`);
                if (msg.expediente_id === id_exp2) {
                    console.log("se van a mostrar los mensajes");
                    mostrarMensajesEnChat(msg.expediente_id);
                }
            break;
        case "limpiar":
            console.log("🧹 Limpiando mensajes...");
            break;
    }
});
function cambiarChat(id_exp) {
    id_exp_actual = id_exp;  // Actualizar el expediente activo
    mostrarMensajesEnChat(id_exp);  // Mostrar mensajes de este expediente
}
var usuarioActual;
function mostrarMensajesEnChat(id_exp) {
    console.log("Se está llevando a cabo la funcion de mostrar mensajes en el me")
    const tabla = document.getElementById("tablaMensajes");
    tabla.innerHTML = ""; // Limpiar mensajes previos
    if (receivedMessagesByExpediente[id_exp]) {
        receivedMessagesByExpediente[id_exp].forEach(msg => {
            const nuevaFila = tabla.insertRow();
            nuevaFila.classList.add(msg.remitente === usuarioActual ? "mensaje-enviado" : "mensaje-recibido");
            
            const celdaFechaYHora = nuevaFila.insertCell(0);
            const celdaNombre = nuevaFila.insertCell(1);
            const celdaTexto = nuevaFila.insertCell(2);

            celdaFechaYHora.textContent = msg.fecha_hora
            celdaNombre.textContent = msg.remitente;
            celdaTexto.textContent = msg.mensaje;
        });
    } else {
        console.log("📭 No hay mensajes previos en este expediente.");
    }
}
var editexpediente;
function mensajeindividual(id, destinatario){
    obtenerDatosMedico(id_me, function(datosmedico){
        var msg = {
            operacion: "mensajeindividual",
            remitente:datosmedico.nombre,
            destinatario:destinatario,
            mensaje: mensaje,
            fecha_hora: new Date(),
            expediente_id:id
        }
        conexion.send(JSON.stringify(msg));
        usuarioActual = datosmedico.nombre
        // Almacenar el mensaje localmente también
        if (!receivedMessagesByExpediente[id_exp]) {
            receivedMessagesByExpediente[id_exp] = [];
        }
        receivedMessagesByExpediente[id_exp].push(msg);
    
        // Refrescar el chat actual si está en el mismo expediente
        if (id_exp_actual === id) {
            mostrarMensajesEnChat(id);
        }
    })
}
function mensajegrupal(id, esp){
    obtenerDatosMedico(id_me, function(datosmedico){
        var msg = {
            operacion: "mensajegrupal",
            remitente:datosmedico.nombre,
            mensaje: mensaje,
            especialidad: esp, 
            fecha_hora: new Date(),
            expediente_id:id
        }
        conexion.send(JSON.stringify(msg));
        usuarioActual = datosmedico.nombre
        if (!receivedMessagesByExpediente[id]) {
            receivedMessagesByExpediente[id] = [];
        }
        receivedMessagesByExpediente[id].push(msg);
        if (id_exp_actual === id) {
            mostrarMensajesEnChat(id);
        }
    })
}
function limpiar() {
    conexion.send(JSON.stringify({
        operacion: "limpiar"
    }));
}
var mensaje;
var id_exp2
function enviar(){
    if(mensaje === ""){alert("No estás enviando nada")}
    if(editexpediente.me === undefined){
        mensaje = document.getElementById("mensajes").value;
        id_exp2 = editexpediente.id
        mensajegrupal(editexpediente.id, editexpediente.especialidad);
    }
    else{
        mensaje = document.getElementById("mensajes").value;
        mensajeindividual(editexpediente.id,editexpediente.map);
    }
}
var conexion
var app = rpc("localhost", "gestion_pacientes");
//Obtener referencias a los procedimientos remotos registrados por el servidor.
var obtenerEspecialidades = app.procedure("obtenerEspecialidades"); //obtenerPacientes es una funcion
var obtenerCentros = app.procedure("obtenerCentros");
var login = app.procedure("login");
var registrarse = app.procedure("crearME");
var actualizarme = app.procedure("actualizarme")
var obtenerDatosMedico = app.procedure("obtenerDatosMedico")
var asignarExp = app.procedure("asignarExp")
var obtenerExpDisponibles = app.procedure("obtenerExpDisponibles")
var obtenerExpAsignados = app.procedure("obtenerExpAsignados")
var resolverExp = app.procedure("resolverExp")
//var duplicarExp = app.procedure("duplicarExpediente")
//var eliminarExpMap = app.procedure("eliminarExpMap")
//var desasignar = app.procedure("desasignar")
//var desasignartodos = app.procedure("desasignartodos")
//var reasignarResolver = app.procedure("reasignarResolver")
var autoasignar = app.procedure("autoasignar")
//var eliminarME= app.procedure("eliminarME")
//var respuesta = app.procedure("respuesta")
var contador = app.procedure("contador")
// Función que crea un botón
function crearBoton(texto, callback) {
    var boton = document.createElement('button');
    boton.innerHTML = texto;
    boton.addEventListener("click", callback);
    return boton;
}
//Función que muestra la información 
function mostrarinformacion(datosmedico, e){
    id_exp = e.id
    mostrarEspecialidadesExpediente()
    cambiarSeccion("expediente")
    var id = document.getElementById("id")
    var MedEsp = document.getElementById ("medesp")
    var especialidad = document.getElementById("esp")
    var SIP =  document.getElementById("SIP")
    var nombre = document.getElementById("clientname")
    var apellidos = document.getElementById("clientsurnames")
    var Fnam =document.getElementById("f_nam")
    var genero = document.getElementById("genero").value
    var observaciones = document.getElementById("observaciones")
    var solicitud = document.getElementById("solicitud")
    var respuesta = document.getElementById("respuesta")
    var f_solicitud = document.getElementById("fsolicitud")
    var f_asignación = document.getElementById("fasig")
    var f_resolucion = document.getElementById("fres")
    id.value = e.id 
    MedEsp.value = datosmedico.nombre + " " + datosmedico.apellidos
    especialidad.value= e.especialidad
    SIP.value= e.SIP
    nombre.value = e.nombre
    apellidos.value = e.apellidos
    Fnam.value = e.f_nam
    genero.value = e.genero
    observaciones.value = e.observaciones
    solicitud.value  = e.solicitud
    respuesta.value = e.respuesta
    f_solicitud.value = e.f_creacion.substring(0,10)
    f_asignación.value = e.f_asignacion.substring(0,10)
    f_resolucion.value = e.f_resolucion.substring(0,10)
}
function addRowToTable(fechaHora, nombre, texto, clase) {
    // Obtener la tabla por ID
    var table = document.getElementById("tablachat");

    // Crear una nueva fila
    var row = table.insertRow(-1); // -1 para agregar al final
    row.className = clase;
    // Crear celdas para la fila
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    // Asignar valores a las celdas
    cell1.textContent = fechaHora;
    cell2.textContent = nombre;
    cell3.textContent = texto;
}

function mostrarEspecialidades() {
    var especialidades = obtenerEspecialidades()
    var select = document.getElementById("especialidad"); //lista es el ul del index
    select.innerHTML = ""; // vaciar lista por si tenía algo antes
    for (i=0; i<especialidades.length;i++){
        var option = document.createElement("option")
            option.value = especialidades[i].id
            option.text = especialidades[i].nombre
            select.add(option)
    }
}
function mostrarEspecialidadesExpediente() {
    var especialidades = obtenerEspecialidades()
    var select = document.getElementById("esp"); //lista es el ul del index
    select.innerHTML = ""; // vaciar lista por si tenía algo antes
    for (i=0; i<especialidades.length;i++){
        var option = document.createElement("option")
            option.value = especialidades[i].id
            option.text = especialidades[i].nombre
            select.add(option)
    }
}
function mostrarCentros() {
    var centros = obtenerCentros()
    var select = document.getElementById("centro"); 
    select.innerHTML = ""; // vaciar el desplegable por si tenía algo antes
    for (i=0; i<centros.length;i++){
        var option = document.createElement("option")
            option.value = centros[i].id
            option.text = centros[i].nombre
            select.add(option)
    }
}
var id_me;
var id_exp
var id_exp_actual
var nombreME
function Acceder(){
    //Encapsulo la información del login
    var credenciales = {
        login: document.getElementById("user").value,
        password: document.getElementById("password").value
    }
    login(credenciales.login, credenciales.password,function(id){
        if(id!= null){
            id_me = id
            console.log("el id del médico es", id_me)
            obtenerDatosMedico(id_me, function(datosmedico){
                conexion.send(JSON.stringify({
                    operacion: "identificarse",
                    nombre: datosmedico.nombre,
                }));
                nombreMe = datosmedico.nombre,
                esp_me = datosmedico.especialidad
            cambiarSeccion("Inicio")
            var datosDiv = document.getElementById("datosmedico");
            datosDiv.innerHTML = "";
            datosDiv.innerHTML += "<h3> Bienvenido: " + datosmedico.nombre + " " + datosmedico.apellidos + "</h3>";
            nombre = datosmedico.nombre;
            var editboton = document.createElement('button');
            editboton.innerHTML = "Editar Datos";
            editboton.addEventListener("click", function(event) {
                mostrarCentros();
                mostrarEspecialidades();
                cambiarSeccion("datos");
                
                // Usar nombres de variables locales para almacenar valores temporales
                var nombreTemporal = document.getElementById("doctorname");
                var apellidosTemporal = document.getElementById("doctorsurnames");
                var loginTemporal = document.getElementById("doctorlogin");
                var centroTemporal = document.getElementById("centro");
                var especialidadTemporal = document.getElementById("especialidad");
                
                nombreTemporal.value = datosmedico.nombre;
                apellidosTemporal.value = datosmedico.apellidos;
                loginTemporal.value = datosmedico.login;
                centroTemporal.value = datosmedico.centro;
                console.log(datosmedico.especialidad)
                especialidadTemporal.value = datosmedico.especialidad;
            });
            datosDiv.appendChild(editboton)
            });
        }
        else {alert("Ese médico no se encuentra en la BDD")}
    }
)}

function contarExp(){
    contador(id_me, function(response){
        alert(response)
    })
}

function guardarmedico(){
    console.log(id_me)
    if(id_me == undefined){
        registrarmedico()
    }
    else{
        console.log("El id del medico es", id_me)
        editarmedico()
    }
}
function registrarmedico(){
    var datos = {
        nombre: document.getElementById("doctorname").value,
        apellidos: document.getElementById("doctorsurnames").value,
        login: document.getElementById("doctorlogin").value,
        password: document.getElementById("doctorpassword").value,
        centro: document.getElementById("centro").value,
        especialidad: parseInt(document.getElementById("especialidad").value),
    }
    registrarse(datos.nombre, datos.apellidos, datos.login, datos.password, datos.especialidad, datos.centro, function(resp){
        if (typeof resp === "string"){
            alert (resp)
        }
        else{
            console.log("ME añadido")
            cambiarSeccion("login")
        }
    })
}
function editarmedico(){
    //Recojo las variables 
    var datos = {
        nombre: document.getElementById("doctorname").value,
        apellidos: document.getElementById("doctorsurnames").value,
        login: document.getElementById("doctorlogin").value,
        password: document.getElementById("doctorpassword").value,
        centro: document.getElementById("centro").value,
        especialidad: document.getElementById("especialidad").value
    }
    actualizarme(id_me, datos, function(id){
        if (id == null){
            alert ("Actualización incorrecta")
        }
        else{
            console.log("Se ha editado correctamente")
            cambiarSeccion("login")
         }
    })
}
function asignarexpediente(){
    mostrarEspecialidadesExpediente()
    cambiarSeccion("asignar")
    obtenerDatosMedico(id_me, function(datosmedico){
        console.log(datosmedico.especialidad)
        obtenerExpDisponibles(datosmedico.especialidad,function(datosexpedientes){
            if(datosexpedientes === null){
                var vacio = document.getElementById("tablasignar");
                vacio.innerHTML = "<p>No hay expedientes libres a asignar</p>";
            }
            else{
            //Limpio la tabla antes de insertar nuevas filas 
            var tablasignar = document.getElementById("tablasignar")
            tablasignar.innerHTML=''

            //Encabezados de la tabla 
            var headers = ["Id", "MAP","FCreación"];
            var headerRow = tablasignar.insertRow(-1);
            headers.forEach(headerText => {
                var headerCell = headerRow.insertCell();
                headerCell.innerHTML = "<td><strong>" + headerText + "</strong></td>";
            });

            //datos de expedientes 
            datosexpedientes.forEach(e=>{
                editexpediente = e
                var fila = tablasignar.insertRow(-1)
                var propiedades = ["id","map","f_creacion"]
                //Inserto celdas con los datos de los expedientes
                propiedades.forEach(p=>{
                    var cell = fila.insertCell()
                    cell.innerHTML = e[p]
                })

                //Botón Asignar
                var asignarBoton = crearBoton("Asignar", function(event) {
                    id_exp = e.id
                    asignarExp(id_exp, id_me, function (boolean){
                        if (boolean) {
                            console.log("La asignación fue exitosa");
                        } else {
                            console.log("La asignación no fue exitosa");
                        }
                    })
                    mostrarExpAsignados()
                });
                fila.insertCell().appendChild(asignarBoton);
                //Botón Chatear
                var ChatearBoton = crearBoton("Chatear", function(event) {
                    editexpediente = e 
                    id_exp2 = e.id
                    cambiarSeccion("chat")
                    console.log("WS(boton chatear) este es el ME del expediente ",id_me)
                    mostrarMensajesEnChat(e.id)
                });
                fila.insertCell().appendChild(ChatearBoton);
            })
            }
        })
    })
}
function mostrarExpAsignados(){
    obtenerExpAsignados(id_me, function(datosexpedientes){
        mostrarEspecialidadesExpediente()
        cambiarSeccion("asignados")
        if(datosexpedientes === null){
            var vacio = document.getElementById("tablasignados");
            vacio.innerHTML = "<p>No hay expedientes asignados a este ME</p>";
        }
        else{
            //Limpio la tabla antes de insertar nuevas filas 
            var tablasignados = document.getElementById("tablasignados")
            tablasignados.innerHTML=''

            //Encabezados de la tabla 
            var headers = ["Id", "F.Cre","F.Asg","F.Res","SIP"];
            var headerRow = tablasignados.insertRow(-1);
            headers.forEach(headerText => {
                var headerCell = headerRow.insertCell();
                headerCell.innerHTML = "<td><strong>" + headerText + "</strong></td>";
            });
            //datos de expedientes 
            datosexpedientes.forEach(e=>{
                var fila = tablasignados.insertRow(-1)
                var propiedades = ["id","f_creacion","f_asignacion","f_resolucion","SIP"]
                //Inserto celdas con los datos de los expedientes
                propiedades.forEach(p=>{
                    var cell = fila.insertCell()
                    cell.innerHTML = e[p]
                })
                //Botón consultar
                var consultarBoton = crearBoton("consultar", function(event){
                    obtenerDatosMedico(id_me, function(datosmedico){
                        mostrarinformacion(datosmedico,e)
                    })
                })
                fila.insertCell().appendChild(consultarBoton)
                //Botón Chatear
                var ChatearBoton = crearBoton("Chatear", function(event) {
                    cambiarSeccion("chat")
                    editexpediente = e
                    id_exp = e.id
                    console.log("WS(boton chatear) este es el ME del expediente ",editexpediente.me)
                    mostrarMensajesEnChat(id_exp)
                });
                fila.insertCell().appendChild(ChatearBoton);
                /*Botón Duplicar
                 var DuplicarBoton = crearBoton("Duplicar", function(event) {
                    duplicarExp(e.id)
                    mostrarExpAsignados()
                    console.log(e)
                });
                fila.insertCell().appendChild(DuplicarBoton);*/
                /*Botón Desasignar
                var DesasignarBoton = crearBoton("Desasignar", function(event){
                    desasignar(e.id, function (response){
                        if (response === null){console.log("No se ha podido desasignar correctamente")}
                        else{console.log("Ahora el el expediente: ", e.id, "no tiene médico asociado ")}
                    })
                    mostrarExpAsignados()
                })
                fila.insertCell().appendChild(DesasignarBoton)*/
            })
        }
    }
)} 
function resolver(){
    var respuesta = document.getElementById("respuesta").value
    if(respuesta === " "){alert("Debe de rellenar todos los campos")}
    resolverExp(id_exp,respuesta,function(boolean){
        if(!boolean){alert("El expediente no se puede resolver")}
        else{
            console.log("Expediente resuelto")
            mostrarExpAsignados()
        }
    })
}
/*Funcion que elimina los expedientes de un MAP y al médico
function eliminarExpedientesMap(){
    var id = parseInt(document.getElementById("deleteMed").value)
    console.log("Este es el id: ",id,"del map que queremos eliminar")
    eliminarExpMap(id,function(res){
        if(res === null){console.log("No se ha podido eliminar")}
        else{
            console.log("expedientes eliminados correctamente")
            asignarexpediente()
        }
    })
}*/

/*Función que desasigna todos los expedientes ya asignados
function desasignarAsignados(){
    desasignartodos(function(response){
        if (response === null){console.log("La desasignación no se ha realizado correctamente")}
        else{
            console.log("Desasignados correctamente ")
            mostrarExpAsignados()
        }
    })
}*/

//Función que asigna todos los desasignados al ME y los cuenta
function asignarDesasignados(){
    obtenerDatosMedico(id_me, function(datosmedico){
        autoasignar(id_me,datosmedico.especialidad,function(response){
            if(response === 0){alert("No hay expedientes sin asignar")}
        else{
            asignarexpediente()
            console.log("Expedientes asignados correctamente", response)
            alert("Expedientes asignados correctamente "+response)
        }
        })
    })
}
/*function reasigResolv(){
    var id_me2 = parseInt(document.getElementById("reasignar").value)
    obtenerDatosMedico(id_me2,function(datosmedico){
        console.log("No tiene especialidad",datosmedico.especialidad)
        if(datosmedico.especialidad === undefined ||datosmedico.especialidad === null){
            alert("Ese medico no está en la BDDS")
        }
        reasignarResolver(id_me, datosmedico.especialidad, id_me2, function(response){
            if(response === null){(response)}
            else{
                mostrarExpAsignados()
                console.log(response)
            }
        })
    })
}*/
/*function deleteME(){
    var del_me = document.getElementById("eliminarME").value
    if (del_me!== ""){
        console.log(del_me)
        eliminarME(del_me, function(boolean){
            if (boolean){console.log("Eliminado correctamente el ME con id: ",del_me)}
            else{console.log("Algo ha ido mal")}
        })
    }
    else{
        console.log("No se ha indicado ME a eliminar, se procede a autoeliminarse")
        eliminarME(id_me, function(boolean){
            if(boolean){
                console.log("Médico autoeliminado correctamente")
            }
            else{
                console.log("No se ha podido autoeliminar correctamente")
            }
        })
    }
}*/

/*function responder(){
    respuesta(id_me, function(response){
        if (response === 0){
            console.log("No hay expedientes sin respuesta")
            alert("Expedientes resueltos: "+response)
        }
        else{
            console.log("Expediente respondido correctamente")
            alert("Expedientes resueltos: "+response)
            mostrarExpAsignados()
        }
    })
}*/

/*liberarExpediente(idME, function (expEliminados){
        if (expEliminados >0){
            alert("Se han eliminado ", expEliminados, "expedientes");
        }
        else{
            alert("No se han podido eliminar expedientes")
        }
    });
}*/