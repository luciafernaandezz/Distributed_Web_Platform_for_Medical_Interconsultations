var express = require("express");
var app = express();

app.use("/map", express.static("cliente_rest")); 
app.use("/me", express.static("cliente_rpc")); 
app.use(express.json());

var datos=require("./datos.js")
var especialidades = datos.esp
var centros = datos.cen
var medicos = datos.med
var expedientes = datos.exp

var siguientemedico = 7
var siguienteExp = 9

//1. Función  que obtiene el array con las especialidades
app.get("/api/especialidades", function(req, res) {
    res.status(200).json(especialidades);
  });

//2. Función que obtiene los arrays con los centros 
app.get("/api/centros", function(req,res){
    res.status(200).json(centros)
}) 

//3.Función que realiza un login para el médico
app.post("/api/medico/login", function (req, res) {
    var credenciales = {
        login:req.body.login,
        password: req.body.password
    };
    console.log("mis credenciales son:", credenciales.login, credenciales.password)
    //Compruebo si este médico está en la base de datos
    for (var i=0;i<medicos.length;i++){
        if(credenciales.login==medicos[i].login && credenciales.password == medicos[i].password){
            return res.status(201).json(medicos[i].id)
        }
    }
    res.status(403).json("El login no se ha podido realizar")
});

//4. Crea un nuevo medico 
app.post("/api/medico", function(req,res){
    var medico = {
        id : siguientemedico,
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        login: req.body.login,
        password: req.body.password,
        especialidad: 0,
        centro: req.body.centro
    }
    medicos.forEach(m =>{
    if(m.login == medico.login){
            return res.status(403).json("Ese login ya lo tiene otro médico cogido")
        }
    })
    if(medico.nombre ===""||medico.apellidos===""||medico.login===""||medico.password===""||medico.centro===""){
        return res.status(403).json("No se puede crear un médico con campos vacíos")
    }
    else{
        medicos.push(medico)
        siguientemedico++
        res.status(201).json("medico creado")
    }
})
//Actualiza los datos de un medico
app.put("/api/medico/:id",function(req,res){
    var id = req.params.id
    var medicoActualizado = {
        id, 
        nombre: req.body.nombre,
        apellidos:req.body.apellidos,
        login: req.body.login,
        password:req.body.password,
        especialidad: 0,
        centro:req.body.centro
    }
    console.log("el nuevo nombre es", medicoActualizado.nombre)
    for (var i=0; i<medicos.length; i++) {
        if(id == medicos[i].id){
            medicos[i].nombre = medicoActualizado.nombre
            medicos[i].apellidos = medicoActualizado.apellidos
            medicos[i].login = medicoActualizado.login
            medicos[i].password = medicoActualizado.password
            medicos[i].especialidad = medicoActualizado.especialidad
            medicos[i].centro = medicoActualizado.centro
            console.log("Se ha actualizado correctamente",medicos[i].login)
            return res.status(200).json("médico actualizado correctamente")
        }
        if(medicos[i].login == medicoActualizado.login){
            return res.status(404).json("Ese login ya lo tiene otro médico cogido")
        }
    }
    return res.status(404).json("Error actualizando el médico")
})


//5. Obtiene los datos de un médico pero no su contraseña 
app.get("/api/medico/:id", function(req,res){
    var id = req.params.id 
    const medico = medicos.find(medico=> medico.id== id)
    if(!medico) return res.status(404).json("Medico no encontrado")
    else {
        var datosmedico = {id: medico.id, nombre: medico.nombre, apellidos: medico.apellidos, login:medico.login}
        res.status(200).json(datosmedico)
    }
})

//6. Obtiene un array con los expedientes creados por un MAP
app.get("/api/medico/:idmap/expedientes", function(req, res) {
    var idmap = req.params.idmap
    var expedientesMedico = expedientes.filter(expediente => expediente.map == idmap);
    console.log("Este es el id del médico "+idmap)  
    console.log("Estos son los expedientes "+expedientesMedico)
    if (expedientesMedico.length<=0){
        return res.status(404).json("No hay expedientes para este médico")
    }
    return res.status(200).json(expedientesMedico); 
});

//7. Crea un nuevo expediente para el MAP indicado 
app.post("/api/medico/:id/expedientes",function(req,res){
    var idmap = req.params.id
    console.log(idmap)
    if(!idmap){return res.status(404).json("No se puede crear un expediente sin asociarlo a un map")}
        var expediente = {
            id: siguienteExp,
            map: idmap,
            me: 0,
            especialidad: parseInt(req.body.especialidad),
            SIP: req.body.SIP,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            f_nam:req.body.f_nam,
            genero: req.body.genero,
            observaciones: req.body.observaciones,
            solicitud:req.body.solicitud,
            f_creacion: new Date()
        }
        siguienteExp++
        console.log(expediente)
        expedientes.push(expediente)
        console.log("Expediente no asignado", expediente.me)
        console.log("Expediente creado correctamente")
        return res.status(201).json(expediente.id)
    })
    //return res.status(404).json(idmap)
//8. Actualiza los datos de un expediente
app.put("/api/expediente/:id",function(req,res){
    var id = req.params.id
    console.log(id)
    if(!id){return res.status(404).json("este id_exp no existe")}
        var expedienteActualizado = {
            especialidad: req.body.especialidad,
            SIP: req.body.SIP,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            genero: req.body.genero,
            observaciones: req.body.observaciones,
            f_creacion: new Date(),
            solicitud:req.body.solicitud
        }
    console.log("el nuevo expediente actualizado es", expedienteActualizado)
    for (var i=0; i<expedientes.length; i++) {
        if(id == expedientes[i].id){
            expedientes[i].especialidad = expedienteActualizado.especialidad
            expedientes[i].SIP = expedienteActualizado.SIP
            expedientes[i].nombre = expedienteActualizado.nombre
            expedientes[i].apellidos = expedienteActualizado.apellidos
            expedientes[i].genero = expedienteActualizado.genero
            expedientes[i].observaciones = expedienteActualizado.observaciones
            expedientes[i].f_creacion = new Date()
            console.log("Se ha actualizado correctamente el expediente",expedientes[i].id)
            return res.status(200).json("expediente actualizado correctamente")
        }
    }
    return res.status(404).json("Error actualizando el expediente")
})

//9. Borra un expediente
app.delete("/api/expediente/:id", function(req,res){
    var id = req.params.id
    //Busco el índice del expediente con el id dado
    const index = expedientes.findIndex(e=> e.id== id)
    //Si no lo encuentra, por defecto es -1 
    if (index === -1){
        res.status(404).json("No se ha encontrado el expediente a borrar")
    }
    //Si lo encuentra entonces uso splice para eliminar 
    //el expediente del array 
    else{
        expedientes.splice(index, 1)
        res.status(200).json("Expediente eliminado exitosamente")
    }
})
app.listen(3000)

//Función que elimina los expedientes sin asignar 
/*app.delete("/api/medico/me/expedientes", function(req, res) {
    // Filtrar expedientes con me = 0
    var expedientesinME = expedientes.filter(e => e.me == 0);

    if (expedientesinME.length <= 0) {
        return res.status(404).json("No hay expedientes sin asignar para borrar");
    } else {
        // Eliminar todos los expedientes con me = 0 del arreglo original
        expedientes = expedientes.filter(e => e.me !== 0);
        return res.status(200).json(expedientesinME.map(e => e.id)); // Devolver los IDs de los expedientes eliminados
    }
});*/

/*11. Función que elimina a una especialidad y todos los expedientes relacionados con ella 
app.delete("/api/medico/:id/especialidad", function(req, res) {
    var id = parseInt(req.params.id);  // Obtener el ID de los parámetros de la URL
    console.log("Este es el id de la especialidad", id);

    // Filtrar expedientes con la especialidad especificada
    var expedientesEsp = expedientes.filter(e => e.especialidad == id);
    console.log(expedientesEsp);

    if (expedientesEsp.length <= 0) {
        return res.status(404).json("No hay expedientes de esa especialidad");
    } else {
        // Eliminar cada expediente de la especialidad del arreglo original
        expedientesEsp.forEach(expediente => {
            const index = expedientes.findIndex(e => e.id === expediente.id);
            if (index !== -1) {
                expedientes.splice(index, 1);
            }
        });
        for (var i= 0; i<especialidades.length;i++){
            if (especialidades[i].id === id){
                especialidades.splice(i,1)
                console.log("especialidad con id: ", id , "eliminada correctamente")
            }
        }
        return res.status(200).json(expedientesEsp.map(e => e.id)); // Devolver los IDs de los expedientes eliminados
    }
});*/

/*12. Función que rellena las observaciones 
app.put("/api/expediente/campo/:id",function(req,res){
    var id = req.params.id
    console.log(id)
    if(!id){return res.status(404).json("No se puede actualizar un expediente si no tiene un map")}
    for (var i=0; i<expedientes.length; i++) {
        if(id == expedientes[i].id){
            expedientes[i].observaciones = "esto hay que verlo urgentemente"
            console.log("Se ha actualizado correctamente el expediente",expedientes[i].observaciones)
            return res.status(200).json("expediente actualizado correctamente")
        }
    }
    return res.status(404).json("Error actualizando el expediente")
})*/

/*13. Función que rellena todas las observaciones de todos los expedientes 
app.put("/api/expediente/campo/:id",function(req,res){
    var idmap = req.params.id
    console.log(idmap)
    if(!idmap){return res.status(404).json("Los expedientes no corresponden a un MAP")}
    for (var i=0;i<expedientes.length;i++){
        if(expedientes[i].map == idmap){
            expedientes[i].observaciones = "Estos pacientes son urgentes"
            console.log("Este expediente", expedientes[i].id, "ha cambiado su observación",expedientes[i].observaciones)
        }
    }
    return res.status(200).json("Rellenado el campo de observaciones correctamente")
})*/


/*Función 14. Elimina a un médico
app.delete("/api/medico/:id", function(req, res) { 
    console.log("Se ha recibido una solicitud DELETE")
    var idmap = req.params.id; 
    console.log("Se ha recibido correctamente el id:: ", idmap);
    if (!idmap) {
        return res.status(404).json("Ese MAP no está en la BDD");
    } else {
        var index = medicos.findIndex(m => m.id == idmap);
        if (index === -1) {
            return res.status(404).json("Ese MAP no está en la BDD");
        }
        medicos.splice(index, 1);
    }

    res.status(200).json(medicos);
});*/



    
