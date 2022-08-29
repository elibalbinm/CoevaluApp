const { response } = require('express');

const Rubrica = require('../models/rubricas.model');
const Curso = require('../models/cursos.model');
const Usuario = require('../models/usuarios.model');

const { infoToken } = require('../helpers/infotoken');

const obtenerRubricas = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const textos = req.query.texto || '';
    const curso = req.query.curso || '';

    try {
        let rubricas, total;
        if (id) {
            [rubricas, total] = await Promise.all([
                Rubrica.findById(id).populate('curso', '-__v'),
                Rubrica.countDocuments()
            ]);
        } else {
            // {curso:'', {$or: {nombre : '', nombrecorto:''}}
            let query = {};
            if (textos !== '') {
                texto = new RegExp(textos, 'i');
                if (curso !== '') {
                    query = { curso: curso, $or: [{ nombre: texto }, { proyecto: texto }] };
                } else {
                    query = { $or: [{ nombre: texto }, { proyecto: texto }] };
                }
            } else {
                if (curso !== '') {
                    query = { curso: curso };
                } else {
                    query = {};
                }
            };


            [rubricas, total] = await Promise.all([
                Rubrica.find(query).skip(desde).limit(registropp).populate('curso', '-__v'),
                Rubrica.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'obtenerRubricas',
            rubricas,
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
            msg: 'Error al obtener rubricas'
        });
    }
}


const crearRubrica = async(req, res = response) => {

    const { nombre, alumnos, curso } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear rubricas',
        });
    }

    try {
        // Comprobar que el curso que se va a asignar al rubrica existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en el rubrica no existe'
            });
        }

        // Comrprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeRubrica = await Rubrica.findOne({ nombre, curso });
        if (existeRubrica) {
            return res.status(400).json({
                ok: false,
                msg: 'El rubrica ya existe en le mismo curso'
            });
        }

        // Comprobamos la lista de alumnos que nos envían que existan
        let listaalumnosinsertar = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y limpiar campos raros
        if (alumnos) {
            let listaalumnosbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenAlumnos = await Usuario.find().where('_id').in(listaalumnosbusqueda);
            if (existenAlumnos.length != listaalumnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el rubrica no existe o están repetidos'
                });
            }
        }

        const rubrica = new Rubrica(req.body);
        rubrica.alumnos = listaalumnosinsertar;

        // Almacenar en BD
        await rubrica.save();

        res.json({
            ok: true,
            msg: 'Rubrica creado',
            rubrica,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando rubrica'
        });
    }
}

const actualizarRubrica = async(req, res) => {

    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar Rubricas',
        });
    }

    try {
        // Comprobar que el curso que se va a asignar al Rubrica existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        const existeRubrica = await Rubrica.findById(uid);
        if (!existeRubrica) {
            return res.status(400).json({
                ok: false,
                msg: 'El Rubrica no existe'
            });
        }

        // Comprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeRubrican = await Rubrica.findOne({ nombre, curso });
        if (existeRubrican && (existeRubrica._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El rubrica ya existe en le mismo curso'
            });
        }

        // Comprobamos la lista de alumnos que nos envían que existan
        let listaalumnosinsertar = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y hay limpiar campos raros
        if (alumnos) {
            let listaalumnosbusqueda = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = alumnos.map(registro => {
                if (registro.usuario) {
                    listaalumnosbusqueda.push(registro.usuario);
                    listaalumnosinsertar.push(registro);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenAlumnos = await Usuario.find().where('_id').in(listaalumnosbusqueda);
            if (existenAlumnos.length != listaalumnosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el rubrica no existe o están repetidos'
                });
            }
        }

        // Creamos el registro para insertar pero con la lista de alumnos comprobados
        let object = req.body;
        object.alumnos = listaalumnosinsertar;

        const rubrica = await Rubrica.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Rubrica actualizado',
            rubrica
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando rubrica'
        });
    }
}

const borrarRubrica = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para eliminar rubricas',
        });
    }

    try {
        // Comprobamos si existe el rubrica que queremos borrar
        const existeRubrica = await Rubrica.findById(uid);
        if (!existeRubrica) {
            return res.status(400).json({
                ok: true,
                msg: 'El rubrica no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Rubrica.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Rubrica eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando rubrica'
        });

    }
}

module.exports = { obtenerRubricas, crearRubrica, actualizarRubrica, borrarRubrica }