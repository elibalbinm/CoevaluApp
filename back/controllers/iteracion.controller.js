const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Iteracion     = require('../models/iteraciones.model');
const Curso         = require('../models/cursos.model');
const Rubrica      = require('../models/rubricas.model');

const iterationCtrl = {};

// Listado de iteraciones para mostrar la tabla en el Dashboard de Alumno
// Filtro por curso académico
iterationCtrl.listaIteraciones = async(req, res) => {
    const curso = req.query.curso;

    if(!(await Curso.findById(curso))){
        return res.status(404).json({
            ok: false,
            msg: 'No existe el curso académico asociado a la iteración'
        });
    }
    
    try {
        [iteraciones, total] = await Promise.all([
            Iteracion.find({ curso: curso }),
            Iteracion.countDocuments({})
        ]);

        res.json({
            ok: true,
            msg: 'Lista de iteraciones',
            iteraciones
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al listar iteraciones'
        });
    }

}

iterationCtrl.getIterations = async(req, res = response) => {

    // Paginación
    // console.log("Res: "+res)
    console.log("Response: "+req.query.texto)
    const desde = Number(req.query.desde) || 0;
    const hasta = req.query.hasta || '';
    let registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const texto = req.query.texto;
    let textoBusqueda = '';
    const curso = req.query.curso || '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    if (hasta === 'todos') {
        registropp = 1000;
    }
    //await sleep(2000);
    try {
        let iteraciones, total;
        if (id) {
            [iteraciones, total] = await Promise.all([
                Iteracion.findById(id).populate('curso', '-__v'),
                Iteracion.countDocuments()
            ]);
        } else {
            if (texto) {
                [iteraciones, total] = await Promise.all([
                    Iteracion.find({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] }).skip(desde).limit(registropp),
                    Iteracion.countDocuments({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] })
                ]);
            } else {
                [iteraciones, total] = await Promise.all([
                    Iteracion.find({}).skip(desde).limit(registropp).populate('curso', '-__v'),
                    Iteracion.countDocuments()
                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'Request getIteracion successful',
            iteraciones,
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
            msg: 'Error al obtener iteraciones'
        });
    }
}

iterationCtrl.getIteration = async(req, res = response ) => {
    const uid = req.params.id;
    const token = req.header('x-token');

    if (!((infoToken(token).rol === 'ROL_ADMIN') || 
          infoToken(token).rol === 'ROL_ALUMNO') ||
          infoToken(token).rol === 'ROL_PROFESOR') {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos obtener la iteración',
        });
    }
    try {
        const iteracion = await Iteracion.findById(uid);
        if (!iteracion) {
            return res.status(400).json({
                ok: false,
                msg: 'La iteración no existe',
            });
        }
        res.json({
            ok: true,
            msg: 'Iteración cargada',
            iteracion
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error cargando información de la iteración',
        });
    }
}

iterationCtrl.createIteration = async(req, res = response) => {

    const { curso, rubrica } = req.body;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para crear iteracioness',
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

iterationCtrl.updateIteration = async(req, res) => {

    const { nombre, alumnos, curso } = req.body;
    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para actualizar iteracioness',
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

iterationCtrl.deleteIteration = async(req, res = response) => {

    const uid = req.params.id;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para eliminar iteraciones',
        });
    }

    try {
        // Comprobamos si existe el Iteracion que queremos borrar
        const existeIteracion = await Iteracion.findById(uid);
        if (!existeIteracion) {
            return res.status(400).json({
                ok: true,
                msg: 'La iteracion no existe'
            });
        }
        // Lo eliminamos y devolvemos el usuaurio recien eliminado
        const resultado = await Iteracion.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Iteracion eliminada',
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

module.exports = { iterationCtrl }