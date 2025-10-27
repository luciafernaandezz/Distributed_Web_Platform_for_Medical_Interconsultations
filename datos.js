var especialidades = [
    {id: 1, nombre:"Cardiología"},
    {id: 2, nombre:"Dermatología"},
]
var centros = [
    {id: 1, nombre:"Centro de Alicante"},
    {id: 2, nombre:"Centro de Águilas"},
    {id: 3, nombre:"Centro de Jaén"},
    {id: 4, nombre:"Centro de Elche"},
]
var medicos = [
    {id: 1, nombre:"María", apellidos:"García Fernández", login:"map1", password:"map1", especialidad:0,centro:1},
    {id: 2, nombre:"Pepe", apellidos:"Pardo Rel", login:"map2", password:"map2", especialidad:0, centro:2},
    {id: 3, nombre:"Jose", apellidos:"López valle", login:"me1", password:"me1", especialidad:1, centro:3},
    {id: 4, nombre:"Lola", apellidos:"Alberola Prieto", login:"me2", password:"me2", especialidad:1, centro:4},
    {id: 5, nombre:"Cristina", apellidos:"Castillo Ruiz", login:"me3", password:"me3", especialidad:2, centro:4},
    {id: 6, nombre:"Monica", apellidos:"Cazalilla ", login:"me4", password:"me4", especialidad:2, centro:4},
]
var expedientes = [
    {id: 1, map:1, me:0, especialidad: 1, SIP:"1111111", nombre:"marina", apellidos: "Pérez Cazalilla", f_nam:"1994-12-10", genero:"M", observaciones:"no tiene", solicitud:"pruebas adicionales", respuesta:"", f_creacion:"2024-02-16", f_asignacion:"", f_resolucion:""},
    {id: 2, map:1, me:0, especialidad: 2, SIP:"2222222", nombre:"Lucia", apellidos: "Castillo Ruiz", f_nam:"1995-12-10", genero:"M", observaciones:"es alérgica", solicitud:"análisis de sangre", respuesta:"", f_creacion:"2024-02-16 08:00:00", f_asignacion:"", f_resolucion:""},
    {id: 3, map:1, me:3, especialidad: 1, SIP:"3333333", nombre:"Pablo", apellidos: "Delgado Vivoras", f_nam:"1996-12-10", genero:"H", observaciones:"es celicaco", solicitud:"prueba de alergia", respuesta:"", f_creacion:"2022-02-16 08:00:00", f_asignacion:"2023-02-16 08:00:00", f_resolucion:""},
    {id: 4, map:1, me:5, especialidad: 2, SIP:"4444444", nombre:"Juan", apellidos: "Cazalilla González", f_nam:"1997-12-10", genero:"H", observaciones:"es epiléptico", solicitud:"resonancia magnética", respuesta:"", f_creacion:"2021-02-16 08:00:00", f_asignacion:"2022-02-16 08:00:00", f_resolucion:""},
    {id: 5, map:2, me:0, especialidad: 1, SIP:"5555555", nombre:"Lorenzo", apellidos: "López Peinado", f_nam:"1994-12-10", genero:"M", observaciones:"no tiene", solicitud:"pruebas adicionales", respuesta:"", f_creacion:"2024-02-16", f_asignacion:"", f_resolucion:""},
    {id: 6, map:2, me:0, especialidad: 2, SIP:"6666666", nombre:"Manuel", apellidos: "Fernández Aparicio", f_nam:"1995-12-10", genero:"M", observaciones:"es alérgica", solicitud:"análisis de sangre", respuesta:"", f_creacion:"2024-02-16 08:00:00", f_asignacion:"", f_resolucion:""},
    {id: 7, map:2, me:4, especialidad: 1, SIP:"7777777", nombre:"Ana", apellidos: "Fernández López", f_nam:"1996-12-10", genero:"H", observaciones:"es celicaco", solicitud:"prueba de alergia", respuesta:"", f_creacion:"2022-02-16 08:00:00", f_asignacion:"2023-02-16 08:00:00", f_resolucion:""},
    {id: 8, map:2, me:6, especialidad: 2, SIP:"8888888", nombre:"Virginia", apellidos: "Fernández Pérez", f_nam:"1997-12-10", genero:"H", observaciones:"es epiléptico", solicitud:"resonancia magnética", respuesta:"", f_creacion:"2021-02-16 08:00:00", f_asignacion:"2022-02-16 08:00:00", f_resolucion:""}
]

module.exports.esp=especialidades;
module.exports.cen=centros;
module.exports.med=medicos;
module.exports.exp=expedientes;