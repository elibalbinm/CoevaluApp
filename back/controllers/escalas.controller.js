const { response } = require('express');

const Escala = require('../models/escalas');
const Curso = require('../models/cursos');
const Usuario = require('../models/usuarios');

const { infoToken } = require('../helpers/infotoken');

const obtenerEscalas = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const textos = req.query.texto || '';
    const curso = req.query.curso || '';

    try {
        let escalas, total;
        if (id) {
            [escalas, total] = await Promise.all([
                Escala.findById(id).populate('curso', '-__v'),
                Escala.countDocuments()
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


            [escalas, total] = await Promise.all([
                Escala.find(query).skip(desde).limit(registropp).populate('curso', '-__v'),
                Escala.countDocuments(query)
            ]);
        }

        res.json({
            ok: true,
            msg: 'obtenerEscalas',
            escalas,
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
            msg: 'Error al obtener escalas'
        });
    }
}


const crearEscala = async(req, res = response) => {

    const { nombre, alumnos, curso } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear escalas',
        });
    }

    try {
        // Comprobar que el curso que se va a asignar al escala existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en el escala no existe'
            });
        }

        // Comrprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeEscala = await Escala.findOne({ nombre, curso });
        if (existeEscala) {
            return res.status(400).json({
                ok: false,
                msg: 'El escala ya existe en le mismo curso'
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
                    msg: 'Alguno de los alumnos indicados en el escala no existe o están repetidos'
                });
            }
        }

        const escala = new Escala(req.body);
        escala.alumnos = listaalumnosinsertar;

        // Almacenar en BD
        await escala.save();

        res.json({
            ok: true,
            msg: 'Escala creado',
            escala,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando escala'
        });
    }
}

const actualizarEscala = async(req, res) => {

    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar escalas',
        });
    }

    try {
        // Comprobar que el curso que se va a asignar al escala existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        const existeEscala = await Escala.findById(uid);
        if (!existeEscala) {
            return res.status(400).json({
                ok: false,
                msg: 'El escala no existe'
            });
        }

        // Comprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeEscalan = await Escala.findOne({ nombre, curso });
        if (existeEscalan && (existeEscala._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El escala ya existe en le mismo curso'
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
                    msg: 'Alguno de los alumnos indicados en el escala no existe o están repetidos'
                });
            }
        }

        // Creamos el registro para insertar pero con la lista de alumnos comprobados
        let object = req.body;
        object.alumnos = listaalumnosinsertar;

        const escala = await Escala.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Escala actualizado',
            escala
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando escala'
        });
    }
}

const borrarEscala = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para eliminar escalas',
        });
    }

    try {
        // Comprobamos si existe el escala que queremos borrar
        const existeEscala = await Escala.findById(uid);
        if (!existeEscala) {
            return res.status(400).json({
                ok: true,
                msg: 'El escala no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Escala.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Escala eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando escala'
        });

    }
}

module.exports = { obtenerEscalas, crearEscala, actualizarEscala, borrarEscala }