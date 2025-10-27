//Es necesario instalar en la carpeta del servidor los modulos cors y express
var rpc = require("./rpc.js"); //incorporamos la libreria

var datos=require("./datos.js");
const { response } = require("express");
var especialidades = datos.esp
var centros = datos.cen
var expedientes = datos.exp
var medicos = datos.med

var siguienteId = 7
var siguienteIdExp = 5 


//Función para obtener los pacientes
function obtenerEspecialidades() {
    return especialidades;
}
function obtenerCentros() {
    return centros;
}
function login(log, pass){
    console.log("Este es el login y la contraseña introducida",log,pass)
    for (var i=0; i<medicos.length;i++){
        if (medicos[i].login === log && medicos[i].password === pass){
            console.log("Credenciales correctas")
            return medicos[i].id
        }
    }
    return null
}
function crearME(nom, ape, log, pass, esp, cen){
    var resp
    console.log("Este es el nombre del nuevo médico", nom,ape,log,pass,esp,cen)
    for (var i = 0; i<medicos.length;i++){
        if(medicos[i].login === log){
            resp = "Ese login ya está devuelto"
        }
        if (nom === "" || ape === "" || log === "" || pass === ""||esp ===""||cen==="") {
            resp = "No puede haber campos vacíos" 
        }
    }
    resp = siguienteId 
    siguienteId++ 
    console.log("El ME con id", resp, "ha sido añadido")
    medicos.push({id:siguienteId, nombre:nom, apellidos:ape, login:log, password:pass, especialidad:esp, centro:cen })
    return resp
}

function actualizarme(id_me, datos){
    if (datos.nombre === "" || datos.apellidos === "" || datos.login === "" || datos.password === ""|| datos.centro==="" || datos.especialidad==="") {
        return null;}
    for(i=0; i<medicos.length;i++){
        if(medicos[i].id == id_me){
            medicos[i].nombre = datos.nombre
            medicos[i].apellidos = datos.apellidos
            medicos[i].login = datos.login
            medicos[i].password = datos.password
            medicos[i].centro = datos.centro
            medicos[i].especialidad = datos.especialidad
            return id_me
        }
        if (datos.login == medicos[i].login){
            return null 
        }
    }
}

function obtenerDatosMedico(id_medico){
    var datosmedico
    const medico = medicos.find(medico => medico.id == id_medico)
    if(!medico){ datosmedico = null}
    else{
        datosmedico = {id: medico.id, nombre: medico.nombre, apellidos: medico.apellidos, login:medico.login, centro:medico.centro, especialidad:medico.especialidad}
        console.log(datosmedico.especialidad)
    }
    return datosmedico;
}

function obtenerExpDisponibles(id_especialidad){
        var datosexpedientes = []; // Inicializa el array de datos de expedientes
        // Encuentra todos los expedientes que coinciden con la especialidad y el médico
        const expedientesFiltrados = expedientes.filter(e => e.especialidad === id_especialidad && e.me === 0);
        if(expedientesFiltrados!= 0){
            // Itera sobre los expedientes filtrados y agrega los datos relevantes a datosexpedientes
            for (var i = 0; i < expedientesFiltrados.length; i++) {
            datosexpedientes.push({
                id: expedientesFiltrados[i].id,
                map: expedientesFiltrados[i].map,
                f_creacion: expedientesFiltrados[i].f_creacion
            });
        }
        }
        // Verifica si se encontraron expedientes
        if (expedientesFiltrados.length === 0) {
            datosexpedientes = null; // Devuelve null si no se encontraron expedientes disponibles
        } 
        return datosexpedientes; // Devuelve el array de datos de expedientes

 }

 function asignarExp(id_exp, id_me) {
    for (let i = 0; i < expedientes.length; i++) {
        if (expedientes[i].id === id_exp) {
            expedientes[i].me = id_me;
            expedientes[i].f_asignacion = new Date();
            console.log("El expediente con id", id_exp, "se ha asignado al médico", id_me);
            return true;
        }
    }
    console.log("No se encontró el expediente con id", id_exp);
    return false;
}

function obtenerExpAsignados(id_me) {
    console.log("este es el id_me", id_me);
    var datosexpedientes = [];
    const expedientesFiltrados = expedientes.filter(e => e.me === id_me);
    if (expedientesFiltrados.length === 0) { return null; }
    console.log("El número de expedientes filtrados es: ", expedientesFiltrados.length);
    
    for (var i = 0; i < expedientesFiltrados.length; i++) {
        datosexpedientes.push(expedientesFiltrados[i]);
        console.log("este es el id del expediente", datosexpedientes[i].id);
    }
    console.log("Hay", datosexpedientes.length,"asociados al me")
    return datosexpedientes;
}
function resolverExp(id_exp, respuesta){
    console.log("Este es el ", id_exp)
    for (var i = 0; i < expedientes.length; i++) {
        if (expedientes[i].id === id_exp) {
            expedientes[i].respuesta = respuesta;
            expedientes[i].f_resolucion= new Date();
            return true;
        }
    }
    console.log("No se encontró el expediente con id", id_exp);
    return false;
}
/*Funcion que duplica un Expediente 
function duplicarExpediente(id) {
    // Encontrar el expediente (médico) con el ID proporcionado
    var expediente = expedientes.find(m => m.id == id);
    if (!expediente) { return false}
    // Crear una copia del expediente encontrado
    var nuevoExpediente = { ...expediente };
    nuevoExpediente.id = siguienteIdExp +1 
    siguienteIdExp = siguienteIdExp +1
    // Añadir el expediente duplicado al array medicos
    expedientes.push(nuevoExpediente);
    return nuevoExpediente;
}*/
/*function duplicarExpediente(id){
    // Encontrar el expediente (médico) con el ID proporcionado
    var expediente = expedientes.find(m => m.id == id);
    // Si no se encuentra el expediente, retornar false
    if (!expediente) {
        return false;
    }
    // Crear una copia manual del expediente encontrado
    var nuevoExpediente = {
        id: siguienteIdExp +1, // Generar un nuevo ID para el expediente duplicado 
        map:expediente.map,
        me: expediente.me,
        SIP: expediente.SIP,
        nombre:expediente.nombre,
        apellidos: expediente.apellidos,
        f_nam: expediente.f_nam,
        genero:expediente.genero,
        observaciones:expediente.observaciones,
        solicitud: expediente.solicitud,
        respuesta:expediente.respuesta,
        f_creacion: expediente.f_creacion, 
        f_asignacion:expediente.f_asignacion,
        f_resolucion:expediente.f_resolucion
    };
    // Añadir el expediente duplicado al array medicos
    expedientes.push(nuevoExpediente)
}*/


/*Función que elimina los expedientes que tienen cierto MAP 
function eliminarExpMap(id) {
    console.log("Este es el", id, "del map que queremos eliminar")
    var expedientesMap = expedientes.filter(e => e.map == id);
    if (expedientesMap.length <= 0) {
        console.log("No hay expedientes con id: " + id + " map");
        return null;
    } else {
        expedientesMap.forEach(expediente => {
            var index = expedientes.findIndex(e => e.id === expediente.id);
            if (index !== -1) {
                expedientes.splice(index, 1);
            }
        });
        for (var i= 0; i<medicos.length;i++){
        if (medicos[i].id === id){
            medicos.splice(i,1)
            console.log("medico con id", id , "eliminado correctamente")
        }
    }
        return expedientes;
    }
}*/

/*Función que desasigna el expediente 
function desasignar(id_exp){
    for (var i=0; i<expedientes.length;i++){
        if (expedientes[i].id === id_exp ){
            console.log("Este es el id del expediente a desasignar", id_exp)
            expedientes[i].me = 0 
            console.log(expedientes[i].me)
        }
    }
    return expedientes
}*/

/*Función que desasigna todos los expedientes 
function desasignartodos(){
    var response = null
    for (var i=0; i<expedientes.length;i++){
        if (expedientes[i].me !== 0){
            expedientes[i].me = 0
            response = expedientes
        }
    }
    return response
}*/

/*Función que asigna todos los expedientes 
function autoasignar(id_me,id_especialidad){
    var response = 0
    for (var i=0;i<expedientes.length;i++){
        if (expedientes[i].me === 0 && expedientes[i].especialidad === id_especialidad){
            expedientes[i].me = id_me
            response = response +1 
        }
    }
    console.log("El número de expedientes asignados es: ", response)
    return response
}*/

/*Función que asigna a otroME y resuelve
function reasignarResolver(id_me, esp, id_me2){
    var response = null
    for (var i=0;i<expedientes.length;i++){
        if (expedientes[i].me === id_me && expedientes[i].especialidad === esp ){
            expedientes[i].me = id_me2
            expedientes[i].f_resolucion = new Date()
            expedientes[i].respuesta = "De acuerdo, ya está reasignado a otro especialista"
            response = "De acuerdo ya está asignado al médico: "+id_me2+ "y su respuesta es "+ expedientes[i].respuesta
        }
        if(expedientes[i].me === id_me && expedientes[i].especialidad !== esp) {
            response = "ese me no es de la especialidad: "+esp
        }
    }
    return response
}*/

/*function eliminarME(id){
    var index = medicos.findIndex(m=> m.id == id)
    if (index === -1){return false}
    else{
        medicos.splice(index,1)
        return true
    }
}*/

/*function liberarExpediente(idME){
    var expEliminados=0;
    for (var i=0; i <expedientes.length; i++){
        if (expedientes[i].me == idME && expedientes[i].respuesta == ""){
            expedientes[i].me=0;
            expedientes[i].fecha_asignacion = ""
            expEliminados++;
        }
    }
    console.log('Se han liberado ', expEliminados, 'expedientes');
    return expEliminados;
}*/

//Boton en ME cuantos de su especialidad, cuantos asignados y cuantos resueltos 
function contador(id_me){
    var response 
    for (var i=0; i<medicos.length;i++){
        if(medicos[i].id === id_me){
            var expedientesEspecialidad = expedientes.filter(e => e.especialidad === medicos[i].especialidad);
        }
    }
    var expedientesAsignados = expedientes.filter(e=> e.me === id_me)
    var expedientesResueltos = expedientes.filter(e=> e.respuesta === "")
    response = "Expedientes asignados: "+expedientesAsignados.length+"Expedientes Resueltos: "+expedientesResueltos.length +"Expedientes Especialidad: "+expedientesEspecialidad.length
    return response
}




var servidor = rpc.server(); // crear el servidor RPC
var app = servidor.createApp("gestion_pacientes"); // crear aplicación de RPC

//Registramos los procedimientos
//app.register(autoasignar)
app.register(obtenerEspecialidades);
app.register(obtenerCentros);
app.register(login);
app.register(crearME);
app.register(actualizarme)
app.register(obtenerDatosMedico)
app.register(obtenerExpDisponibles)
app.register(asignarExp)
app.register(obtenerExpAsignados)
app.register(resolverExp)
//app.register(duplicarExpediente)
//app.register(eliminarExpMap)
//app.register(desasignar)
//app.register(asignartodos)
//app.register(reasignarResolver)
//app.register(eliminarME)
//app.register(respuesta)
app.register(contador)


