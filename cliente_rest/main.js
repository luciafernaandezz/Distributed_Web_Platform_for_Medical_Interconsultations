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
var id_exp_actual
conexion.addEventListener("message", function (event) {
    console.log("📩 Mensaje recibido en el cliente:", event.data);
    
    let msg = JSON.parse(event.data);
    
    // Almacenar mensajes en su respectivo expediente
    if (!receivedMessagesByExpediente[msg.expediente_id]) {
        receivedMessagesByExpediente[msg.expediente_id] = [];
    }
    receivedMessagesByExpediente[msg.expediente_id].push(msg);

    console.log("Mensaje en JSON: ", msg);

    switch (msg.operacion) {
        case "mensajeindividual":
            console.log("📨 Recibiendo un mensaje individual...");
            console.log(`Expediente actual: ${editexpediente.id}, Mensaje para expediente: ${msg.expediente_id}`);
            if (msg.expediente_id === editexpediente.id) {
                mostrarMensajesEnChat(msg.expediente_id);
            }
            break;

        case "mensajegrupal":
            console.log("📢 Mensaje grupal recibido.");
            if (msg.expediente_id === editexpediente.id) {
                mostrarMensajesEnChat(msg.expediente_id);
            }
            break;

        case "limpiar":
            console.log("🧹 Limpiando mensajes...");
            break;
    }
});

function cambiarChat(id_exp) {
    id_exp_actual = editexpediente.id;  // Actualizar el expediente activo
    mostrarMensajesEnChat(id_exp);  // Mostrar mensajes de este expediente
}
function mostrarMensajesEnChat(id_exp) {
    console.log("Se muestran los mensajes con id_exp: "+editexpediente.id)
    const tabla = document.getElementById("tablaMensajes");
    tabla.innerHTML = ""; // Limpiar mensajes previos

    if (receivedMessagesByExpediente[editexpediente.id]) {
        receivedMessagesByExpediente[editexpediente.id].forEach(msg => {
            const nuevaFila = tabla.insertRow();
            nuevaFila.classList.add(msg.remitente === usuarioActual ? "mensaje-enviado" : "mensaje-recibido");

            const celdaFechaYHora = nuevaFila.insertCell(0);
            const celdaNombre = nuevaFila.insertCell(1);
            const celdaTexto = nuevaFila.insertCell(2);

            celdaFechaYHora.textContent = msg.fecha_hora;
            celdaNombre.textContent = msg.remitente;
            celdaTexto.textContent = msg.mensaje;
        });
    } else {
        console.log("📭 No hay mensajes previos en este expediente.");
    }
}
function mensajeindividual(id,destinatario){
    rest.get("/api/medico/"+idmap, function (status, datosmedico) {
        var msg = {
            operacion: "mensajeindividual",
            remitente: datosmedico.nombre,
            destinatario:destinatario,
            mensaje: mensaje,
            fecha_hora: new Date(),
            expediente_id:id
        }
        conexion.send(JSON.stringify(msg));
        usuarioActual = datosmedico.nombre
    if (!receivedMessagesByExpediente[editexpediente.id]) {
        receivedMessagesByExpediente[editexpediente.id] = [];
    }
    receivedMessagesByExpediente[editexpediente.id].push(msg);
    // Refrescar el chat actual si está en el mismo expediente
    if (id_exp_actual === editexpediente.id) {
        mostrarMensajesEnChat(editexpediente.id);
}
    })
}
var usuarioActual
function mensajegrupal(id, esp){
    rest.get("/api/medico/"+idmap, function (status, datosmedico) {
        var msg = { 
            operacion: "mensajegrupal",
            remitente: datosmedico.nombre,
            mensaje: mensaje,
            especialidad: esp,
            Medesp: datosmedico.especialidad,
            fecha_hora: new Date(),
            expediente_id:id
        }
        usuarioActual = datosmedico.nombre
        conexion.send(JSON.stringify(msg));
        if (!receivedMessagesByExpediente[editexpediente.id]) {
            receivedMessagesByExpediente[editexpediente.id] = [];
        }
        receivedMessagesByExpediente[editexpediente.id].push(msg);
        // Refrescar el chat actual si está en el mismo expediente
        if (id_exp_actual === editexpediente.id) {
            mostrarMensajesEnChat(editexpediente.id);
        }
    })
}
function limpiar() {
    conexion.send(JSON.stringify({
        operacion: "limpiar"
    }));
}
var mensaje;
function enviar(){
    if(mensaje === ""){alert("No estás enviando nada")}
    if(editexpediente.me === 0){
        mensaje = document.getElementById("mensajes").value;
        mensajegrupal(editexpediente.id,editexpediente.especialidad);
    }
    else{
        mensaje = document.getElementById("mensajes").value;
        mensajeindividual(editexpediente.id,editexpediente.me);
    }
}
//Funciones útiles 
function crearBoton(texto, callback) {
    var boton = document.createElement('button');
    boton.innerHTML = texto;
    boton.addEventListener("click", callback);
    return boton;
}
function addRowToTable(fechaHora, nombre, texto, clase) {
    if (editexpediente.me===0){
    // Obtener la tabla por ID
    var table = document.getElementById("tablaMensajesGroup");
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
    if (editexpediente.me !== 0){
    var table = document.getElementById("tablaMensajes");
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
}
function mostrarInformacionExpediente(expediente) {
    cambiarSeccion("expediente");

    if (document.getElementById("esp") != null) {
        especialidades();
        editexpediente = expediente;
        console.log("Este es el id del me asociado: " + expediente.me);
    }

    var id = document.getElementById("id");
    var MedEsp = document.getElementById("medesp");
    var especialidad = document.getElementById("esp");
    var SIP = document.getElementById("sipe");
    var nombre = document.getElementById("clientname");
    var apellidos = document.getElementById("clientsurnames");
    var Fnam = document.getElementById("f_nam");
    var genero = document.getElementById("genero").value;
    var observaciones = document.getElementById("observaciones");
    var solicitud = document.getElementById("solicitud");
    var respuesta = document.getElementById("respuesta");
    var f_creacion = document.getElementById("fsolicitud");
    var asignación = document.getElementById("fasig");
    var resolucion = document.getElementById("fres");

    id.value = expediente.id;
    MedEsp.value = expediente.me;
    especialidad.value = expediente.especialidad;
    SIP.value = expediente.SIP;
    nombre.value = expediente.nombre;
    apellidos.value = expediente.apellidos;
    Fnam.value = expediente.f_nam;
    genero.value = expediente.genero;
    observaciones.value = expediente.observaciones;
    solicitud.value = expediente.solicitud;
    respuesta.value = expediente.respuesta;
    f_creacion.value = expediente.f_creacion.substring(0, 10);
    asignación.value = expediente.f_asignacion.substring(0, 10);
    resolucion.value = expediente.f_resolucion.substring(0, 10);
}
var especialidad;
//Función que muestra la lista de especialidades
function especialidades(){
    rest.get("/api/especialidades", function (status, specialties) {
        console.log("Estado:", status, "specialties:", specialties);
        if (status != 200) {
            return alert("Error cargando la lista de specialties");
        }
        var select = document.getElementById("esp");
        // Limpiar el elemento select
        select.innerHTML = "";
        specialties.forEach(e=>{
            var option = document.createElement("option")
            especialidad = e.nombre
            option.value = e.id
            option.text = e.nombre
            select.add(option)
        })
    });
}
//Función que carga la lista de centros
function centros(){
    rest.get("/api/centros", function(status,centres){
        console.log("Estado:", status, "Centros: ",centres)
        if(status!=200){
            alert("Error cargando la lista de centros")
            return
        }
        var select = document.getElementById("centro")
        // Limpiar el elemento select
        select.innerHTML = "";
        centres.forEach (centro =>{
            var option = document.createElement("option")
            option.value = centro.id
            option.text = centro.nombre
            select.add(option)
        })
    })
}
//Función que permite hacer un login.
//Variables global 
var idmap;
function login(){
    //Encapsulo la información del login
    var credenciales = {
        login: document.getElementById("user").value,
        password: document.getElementById("password").value
    }
    //Las credenciales viajan al servidor y se guardan en el callback de la función
    rest.post("/api/medico/login", credenciales, function(status,id){
        if(status != 201){
            alert("El médico no está en la BDD")
        }
        else{
            console.log("el id del médico es:", id)
            idmap= id
            datosmedico(idmap)
            return id 
        }
    })
}

//Función que permite obtener los datos del médico 
function datosmedico(idmap){
    console.log("el parámetro recogido es", idmap)
    saludomedico(idmap)
    tablaexpediente(idmap)
}
//Función de guardarmedico
function guardarmedico(){
    console.log(idmap)
    if(idmap == undefined){
    registrarmedico()
    }
    else{
        console.log("El id del medico es", idmap) 
        editarmedico()
    }
}
//Función crea un nuevo médico 
function registrarmedico(){
    //Cojo los datos del médico
    var medico = {
        nombre: document.getElementById("doctorname").value,
        apellidos: document.getElementById("doctorsurnames").value,
        login: document.getElementById("doctorlogin").value,
        password: document.getElementById("doctorpassword").value,
        centro: document.getElementById("centro").value,
    }
        rest.post("/api/medico/", medico, function(status, respuesta){
        console.log("Estado: "+status+ "Respuesta: "+respuesta)
        if(status==201){
            cambiarSeccion("login")
        }
        else{alert(respuesta)}
        document.getElementById("doctorname").value = '';
        document.getElementById("doctorsurnames").value = '';
        document.getElementById("doctorlogin").value = '';
        document.getElementById("doctorpassword").value = '';
        document.getElementById("centro").value = '';
    })
}
//Función que edita un médico
function editarmedico(){
    var medicoEditado = {
        nombre: document.getElementById("doctorname").value,
        apellidos: document.getElementById("doctorsurnames").value,
        login: document.getElementById("doctorlogin").value,
        password: document.getElementById("doctorpassword").value,
        centro: document.getElementById("centro").value,
    }
    rest.put("/api/medico/"+idmap, medicoEditado, function(estado,medicoActualizado){
        console.log("estado: ",estado, "Médico actualizado: ", medicoActualizado)
        if(estado==200){
            console.log("Se ha editado correctamente")
            saludomedico(idmap)
        }
        else{alert("El médico no se ha actualizado correctamente")}
    })
}

//Función que muestra el saludo del médico
function saludomedico(id){
    rest.get("/api/medico/"+id, function (status, datosmedico) {
        console.log("Estado:", status, "Datos:", datosmedico);
        if (status != 200 ||!datosmedico) {
            alert("Error cargando los datos del medico");
            return;
        }
        cambiarSeccion("Inicio");
        nombreme = datosmedico.nombre
        var datosDiv = document.getElementById("datosmedico");
        datosDiv.innerHTML = "";
        datosDiv.innerHTML += "<h3> Bienvenido: " + datosmedico.nombre + " " + datosmedico.apellidos + "</h3>";
        nombre = datosmedico.nombre
        conexion.send(JSON.stringify({
            operacion: "identificarse",
            nombre: datosmedico.nombre,
        }));
        var editboton = document.createElement('button');
            editboton.innerHTML = "Editar Datos";
            editboton.addEventListener("click",function(event){
                if (datosmedico.nombre === "" || datosmedico.apellidos === "" || datosmedico.login === "" || datosmedico.password === "") {
                    alert("Debe completar todos los campos");}
                    centros()
                    cambiarSeccion("datos")

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
        })
        datosDiv.appendChild(editboton)
    });
}
//Variable del expediente
var editexpediente;
//Función que muestra la tabla del expediente
function tablaexpediente(idmap) {
    cambiarSeccion("Inicio");
    rest.get("/api/medico/" + idmap + "/expedientes", function(status, expedientesMedico) {
        console.log("Estado: ", status, "Expedientes del medico: " + expedientesMedico);
        
            // Limpia la tabla antes de insertar nuevas filas
            // Limpia solo el cuerpo de la tabla antes de insertar nuevas filas
            var tabla = document.getElementById('tabla');
            var tbody = tabla.getElementsByTagName('tbody')[0];
            tbody.innerHTML= " "

            if (status == 200) {
            // Datos de expedientes
            expedientesMedico.forEach(e => {
                var fila = tbody.insertRow(-1);
                var propiedades = ["id", "f_creacion", "f_asignacion", "f_resolucion", "especialidad", "SIP"];

                // Inserta celdas con los datos de los expedientes
                propiedades.forEach(propiedad => {
                    var cell = fila.insertCell();
                    cell.innerHTML = e[propiedad];
                    if (e[propiedad]=== undefined){
                        cell.innerHTML = " ";
                    }
                    if (e[propiedad]=== 1 & propiedad ==="especialidad"){
                        cell.innerHTML = " Cardiología";
                    }
                    if (e[propiedad]=== 2 & propiedad === "especialidad"){
                        cell.innerHTML = " Dermatología";
                    }
                });

                //Botón Eliminar
                var eliminarBoton = crearBoton("Eliminar", function(event) {
                    event.target.parentNode.parentNode.remove();
                    eliminar(e.id);
                });
                fila.insertCell().appendChild(eliminarBoton);
                //Botón Editar
                var editarBoton = crearBoton("Editar", function(event) {
                    mostrarInformacionExpediente(e);
                });
                fila.insertCell().appendChild(editarBoton);
                //Botón Chatear
                var ChatearBoton = crearBoton("Chatear", function(event) {
                    editexpediente = e
                    //id_exp = e.id
                    if(e.me === 0){
                        cambiarSeccion("chat")
                        mostrarMensajesEnChat(e.id)
                    }
                    else{
                    cambiarSeccion("chat")
                    console.log("WS(boton chatear) este es el ME del expediente ",editexpediente.me)
                    mostrarMensajesEnChat(expediente.me)
                    }
                });
                fila.insertCell().appendChild(ChatearBoton);
                
                /*Botón duplicar
                var DuplicarBoton = crearBoton("Duplicar", function(event) {
                    rest.post("/api/medico/" + idmap + "/expedientes",e, function (status, id){
                        if(status === 201){
                            tablaexpediente(idmap)
                        }
                        else{console.log(status,id)}
                    })
                });
                fila.insertCell().appendChild(DuplicarBoton);*/
                /*Botón rellenar observaciones
                var rellenarBoton = crearBoton("Rellenar", function(event) {
                    rest.put("/api/expediente/campo/"+e.id,e, function (status, res){
                        if(status === 200){
                            tablaexpediente(idmap)
                            console.log(e.observaciones)
                        }
                        else{
                            console.log(status,res)
                        }
                    })
                });
                fila.insertCell().appendChild(rellenarBoton);*/
        } )
    };
})
}

//Función chat 
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

//Función que elimina los expedientes 
function eliminar(id){
    rest.delete("/api/expediente/"+id, function(status,response){
        if(status==200){
            console.log(response)
        }
        else{console.log(response)}
    })
}
//Función de guardarexpediente
function guardarexpediente(){
    console.log("Este es el id",editexpediente, "del id del médico",idmap)
    if(editexpediente == undefined){
        registrarexpediente()
    }
    else{
        console.log("El id del medico es", idmap) 
        editarexpediente(editexpediente.id)
    }
}
//Función que crea un nuevo expediente 
function registrarexpediente(){
    //Encapsulo la información del nuevo expediente 
    var expediente = {
        especialidad: document.getElementById("esp").value,
        me:0,
        SIP: document.getElementById("sipe").value,
        nombre: document.getElementById("clientname").value,
        apellidos: document.getElementById("clientsurnames").value,
        f_nam:document.getElementById("f_nam").value,
        genero: document.getElementById("genero").value,
        observaciones: document.getElementById("observaciones").value,
        solicitud: document.getElementById("solicitud").value
        
    }
    //Control de errores 
    if (expediente.especialidad === "" || expediente.SIP === "" || expediente.nombre === "" || expediente.apellidos === ""|| expediente.genero ===""|| expediente.observaciones ==="") {
        alert("Debe completar todos los campos");}
    //El nuevo expediente viaja al servidor y se guarda en el callback de la función 
    rest.post("/api/medico/" + idmap + "/expedientes",expediente, function (status, id){
        console.log("este es el id del map:"+idmap)
        console.log("esta es la especialidad"+expediente.especialidad)
        console.log("Estado: "+status+ "id del expediente: "+id)
        console.log("Este expediente todavía no está asignado", expediente.me)
        console.log("Este es el sip del expediente", expediente.SIP)
        if(status==201){
            cambiarSeccion("Inicio")
            tablaexpediente(idmap)
        }
        else{alert("Ese login ya está cogido")}
    })
}
//Función que edita un expediente 
function editarexpediente(id){
    var expedienteeditado = {
        especialidad: parseInt(document.getElementById("esp").value),
        SIP: document.getElementById("sipe").value,
        nombre: document.getElementById("clientname").value,
        apellidos: document.getElementById("clientsurnames").value,
        genero: document.getElementById("genero").value,
        observaciones: document.getElementById("observaciones").value,
        solicitud: document.getElementById("solicitud").value
    }
    rest.put("/api/expediente/"+id, expedienteeditado, function(estado,expedienteactualizado){
        console.log("estado: ",estado, "Expediente actualizado: ",id)
        if(estado==200){
            console.log("Se ha editado correctamente")
            console.log(expedienteactualizado)
            tablaexpediente(idmap)
        }
        else{alert("El expediente no se ha actualizado correctamente")}
    })
}
//funcion que muestra los mensajes 
function mostrarmensaje(){
    var tablachat;
    tablachat = document.getElementById("titulo").innerHTML 
}
/*function eliminarsinasignar() {
    rest.delete("/api/medico/me/expedientes", function(status, res) {
        if (status == 200) {
            console.log(res); // Muestra los IDs de los expedientes eliminados
            tablaexpediente(idmap)
        } else {
            console.log(res); // Muestra el mensaje de error
        }
    });
}*/
/*Función que muestra la lista de especialidades para eliminar 
function eliminarespecialidades(){
    rest.get("/api/especialidades", function (status, specialties) {
        console.log("Estado:", status, "specialties:", specialties);
        if (status != 200) {
            alert("Error cargando la lista de specialties");
            return;
        }
        var select = document.getElementById("deletEsp");
        // Limpiar el elemento select
        select.innerHTML = "";
        specialties.forEach(especialidad=>{
            var option = document.createElement("option")
            option.value = especialidad.id
            option.text = especialidad.nombre
            select.add(option)
        })
    });
}*/
/*function eliminarEspExp() {
    var id = document.getElementById("deletEsp").value;
    console.log(id);
    
    rest.delete("/api/medico/" + id + "/especialidad", function(status, res) {
        if (status === 200) {
            console.log(res); // Muestra los IDs de los expedientes eliminados
            tablaexpediente(idmap); // Actualizar la tabla de expedientes
        } else {
            console.log(res); // Muestra el mensaje de error
        }
    });
}*/
/*function rellenartodosCampo(){
    rest.put("/api/expediente/campo/"+idmap,function(status,response){
        if(status === 200){
            console.log(response)
            tablaexpediente(idmap)
        }
        else{
            console.log(response)
        }
    })
}*/
/*function eliminarMAP(){
    var del_map = document.getElementById("eliminarMAP").value 
    if (del_map !== ""){
        rest.delete("/api/medico/"+del_map, function(status,response){
            console.log(idmap)
            if(status === 200){
                console.log("Expediente eliminado correctamente")
            }
            if (status=== 404){
                console.log(del_map)
                console.log("Algo no ha ido bien")}
        })
    }
    else{
        rest.delete("/api/medico/"+idmap, function(status,response){
            console.log("No se ha indicado MAP a eliminar, se autoelimina")
            if(status === 200){
                console.log("Expediente eliminado correctamente")
            }
            if (status=== 404){console.log("holi")}
        })
    }
}*/