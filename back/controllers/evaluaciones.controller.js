const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Iteracion     = require('../models/iteraciones.model');
const Curso         = require('../models/cursos.model');
const Rubrica      = require('../models/rubricas.model');

const evaluationCtrl = {};

evaluationCtrl.getEvaluations = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const hasta = req.query.hasta || '';
    let registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const texto = req.query.texto;
    let textoBusqueda = '';

    console.log('Texto: '+texto);

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    if (hasta === 'todos') {
        registropp = 1000;
    }
    //await sleep(2000);
    try {
        let evaluaciones, total;
        if (id) {
            [evaluaciones, total] = await Promise.all([
                Iteracion.findById(id),
                Iteracion.countDocuments()
            ]);
        } else {
            if (texto) {
                [evaluaciones, total] = await Promise.all([
                    Iteracion.find({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] }).skip(desde).limit(registropp),
                    Iteracion.countDocuments({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] })
                ]);
            } else {
                [evaluaciones, total] = await Promise.all([
                    Iteracion.find({}).skip(desde).limit(registropp),
                    Iteracion.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'Request getEvaluacion successful',
            evaluaciones,
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
            msg: 'Error al obtener evaluaciones'
        });
    }
}

evaluationCtrl.createIteration = async(req, res = response) => {

    const { curso, rubrica } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear evaluacioness',
        });
    }

    try {
        // Comprobar que el curso que se va a asignar al iteracion existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la iteración no existe'
            });
        }

        // Comrprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeRubrica = await Rubrica.findById(rubrica);
        if (!existeRubrica) {
            return res.status(400).json({
                ok: false,
                msg: 'La rúbrica asignada a la iteración no existe'
            });
        }

        const iteracion = new Iteracion(req.body);
        // Almacenar en BD
        await iteracion.save();

        res.json({
            ok: true,
            msg: 'Iteración creada',
            iteracion,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando iteración'
        });
    }
}

evaluationCtrl.updateIteration = async(req, res) => {

    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar evaluacioness',
        });
    }

    try {
        // Comprobar que el curso que se va a asignar al iteracion existe
        const existeCurso = await Curso.findById(curso);
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado en la asignatura no existe'
            });
        }

        const existeIteracion = await Iteracion.findById(uid);
        if (!existeIteracion) {
            return res.status(400).json({
                ok: false,
                msg: 'El iteracion no existe'
            });
        }

        // Comprobar que no existe un gurpo en ese mismo curso con ese nombre
        const existeIteracionn = await Iteracion.findOne({ nombre, curso });
        if (existeIteracionn && (existeIteracion._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'El iteracion ya existe en le mismo curso'
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
                    msg: 'Alguno de los alumnos indicados en el iteracion no existe o están repetidos'
                });
            }
        }

        // Creamos el registro para insertar pero con la lista de alumnos comprobados
        let object = req.body;
        object.alumnos = listaalumnosinsertar;

        const iteracion = await Iteracion.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Iteracion actualizado',
            iteracion
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando iteracion'
        });
    }
}

evaluationCtrl.deleteIteration = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para eliminar evaluaciones',
        });
    }

    try {
        // Comprobamos si existe el Iteracion que queremos borrar
        const existeIteracion = await Iteracion.findById(uid);
        if (!existeIteracion) {
            return res.status(400).json({
                ok: true,
                msg: 'El iteracion no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Iteracion.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Iteracion eliminado',
            resultado: resultado
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando iteracion'
        });

    }
}

module.exports = { evaluationCtrl }