const { response, query } = require('express');

const Criterio = require('../models/criterios.model');
const Curso = require('../models/cursos.model');
const Usuario = require('../models/usuarios.model');

const { infoToken } = require('../helpers/infotoken');


const obtenerCriterios = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const idprof = req.query.idprof || '';
    const textos = req.query.texto || '';
    const curso = req.query.curso || '';

    try {

        let criterios, total;
        if (id) {
            [criterios, total] = await Promise.all([
                Criterio.findById(id).populate('curso'), //.populate('profesores.usuario', '-password -alta -__v'),                
                Criterio.countDocuments()
            ]);


        } else {
            // {curso:'', {$or: {nombre : '', nombrecorto:''}, 'profesores.usuario':idprof}}}

            let query = {};

            if (textos !== '') {
                texto = new RegExp(textos, 'i');
                if (curso !== '') {
                    if (idprof !== '') {
                        // texto, curso e idprof
                        query = { curso: curso, $or: [{ nombre: texto }, { nombrecorto: texto }], 'profesores.usuario': idprof };
                    } else {
                        // texto, curso
                        query = { curso: curso, $or: [{ nombre: texto }, { nombrecorto: texto }] };
                    }
                } else {
                    if (idprof !== '') {
                        // texto e idprof
                        query = { $or: [{ nombre: texto }, { nombrecorto: texto }], 'profesores.usuario': idprof };
                    } else {
                        // texto
                        query = { $or: [{ nombre: texto }, { nombrecorto: texto }] };
                    }
                }
            } else {
                if (curso !== '') {
                    if (idprof !== '') {
                        // curso e idprof
                        query = { curso: curso, 'profesores.usuario': idprof };
                    } else {
                        query = { curso: curso }
                    }
                } else {
                    if (idprof !== '') {
                        query = { 'profesores.usuario': idprof };
                    } else {
                        query = {};
                    }
                }
            }

            [criterios, total] = await Promise.all([
                Criterio.find(query).skip(desde).limit(registropp).populate('curso'), //.populate('profesores.usuario', '-password -alta -__v'),
                Criterio.countDocuments(query)
            ]);

        }

        res.json({
            ok: true,
            msg: 'obtenerCriterios',
            criterios,
            items: criterios.items,
            page: {
                desde,
                registropp,
                total
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener criterios'
        });
    }
}


const crearCriterio = async(req, res = response) => {

    // De lo que nos manden extraemos curso, profesores y alumnos
    // profesores y alumnos no se van a insertar al crear
    const { curso, profesores, alumnos, ...object } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear criterio',
        });
    }

    try {

        // Comprobar que el curso que se va a asignar a la criterio existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la criterio no existe'
            });
        }

        /*let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });

            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la criterio no existe o están repetidos'
                });
            }

        }
        // Sustituir el campo profesores por la lista de profesores preparada
        criterio.profesores = listaprofesoresinsertar;
        */

        const criterio = new Criterio(object);
        // Insertamos el curso que ya está comprobado en el body
        criterio.curso = curso;
        // Almacenar en BD
        await criterio.save();

        res.json({
            ok: true,
            msg: 'Criterio creada',
            criterio
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando criterio'
        });
    }
}

const actualizarCriterio = async(req, res) => {

    const { profesores, alumnos, curso, ...object } = req.body;
    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para modificar criterio',
        });
    }

    try {

        // Comprobar que la criterio que se va a actualizar existe
        const existeCriterio = await Criterio.findById(uid);
        if (!existeCriterio) {
            return res.status(400).json({
                ok: false,
                msg: 'El criterio no existe'
            });
        }

        // Comprobar que el curso que se va a asignar a la criterio existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en el criterio no existe'
            });
        }

        /*let listaprofesoresinsertar = [];
        // Si nos ha llegado lista de profesores comprobar que existen y que no hay limpiar campos raros
        if (profesores) {
            let listaprofesoresbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaprof = profesores.map(registro => {
                if (registro.usuario) {
                    listaprofesoresbusqueda.push(registro.usuario);
                    listaprofesoresinsertar.push(registro);
                }
            });
            // Comprobamos que los profesores que nos pasan existen, buscamos todos los profesores de la lista
            const existenProfesores = await Usuario.find().where('_id').in(listaprofesoresbusqueda);
            if (existenProfesores.length != listaprofesoresbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los profesores indicados en la criterio no existe o están repetidos'
                });
            }
        }
        object.profesores = listaprofesoresinsertar;
        */
        object.curso = curso;
        const criterio = await Criterio.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Criterio actualizada',
            criterio
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando criterio'
        });
    }
}

const borrarCriterio = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para eliminar criterio',
        });
    }

    try {
        // Comprobamos si existe el criterio que queremos borrar
        const existeCriterio = await Criterio.findById(uid);
        if (!existeCriterio) {
            return res.status(400).json({
                ok: true,
                msg: 'El criterio no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Criterio.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Criterio eliminada',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando criterio'
        });

    }
}

const actualizarLista = async(req, res) => {

    const id = req.params.id;
    const tipo = req.body.tipo;
    const tiposPermitidos = ['profesores', 'alumnos'];
    const lista = req.body.lista;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para modificar lista de profesores/alumnos de criterio',
        });
    }

    if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipo no permitido',
            tipo
        });
    }
    ['uid', 'uid', 'uid']
    // Antes de insertar, limpiamos la lista de posibles duplicados o no existentes ['1','2','3'] -> [{usuario:'1'},{usuario:'3'}]
    let listaInsertar = [];
    try {
        const usuarios = await Usuario.find({ _id: { $in: lista } }, { _id: 0, 'usuario': '$_id' });
        let objetc;
        if (tipo === 'alumnos') { object = { alumnos: usuarios }; } // { alumnos: [{usuario:'1'},{usuario:'3'}]}
        if (tipo === 'profesores') { object = { profesores: usuarios }; } // { profesores: : [{usuario:'1'},{usuario:'3'}]}
        const criterio = await Criterio.findByIdAndUpdate(id, object, { new: true });
        res.json({
            ok: true,
            msg: `Actualizar lista de ${tipo}`,
            asignatura
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: `Error al actualizar listas`
        });
    }
}


module.exports = { obtenerCriterios, 
                   crearCriterio, 
                   actualizarCriterio, 
                   borrarCriterio, 
                   actualizarLista }