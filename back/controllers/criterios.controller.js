const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Criterio = require('../models/criterios.model');
const Curso = require('../models/cursos.model');
const Iteracion = require('../models/iteraciones.model');
const Rubrica = require('../models/rubricas.model');
const Escala = require('../models/escalas.model');
const criterioCtrl = {};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

criterioCtrl.listaCriterios = async(req, res) => {
    const lista = req.body.lista;

    if (!lista) {
        return res.json({
            ok: true,
            msg: 'Lista de criterios',
            criterios: 'none',
        });
    }

    // Solo puede listar criterios un admin
    const token = req.header('x-token');
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.status(400).json({
            ok: false,
            msg: 'No tiene permisos para listar criterios',
        });
    }

    try {
        const criterios = await Criterio.find({ _id: { $in: lista }, activo: true }).collation({ locale: 'es' }).sort({ nombre: 1, descripcion: 1 });
        res.json({
            ok: true,
            msg: 'Lista de criterios',
            criterios
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al listar criterios por uids',
        });
    }

}

criterioCtrl.getValores = async(req, res = response) => {
    console.log('Entra')

    const id = req.params.id;
    
    try {
        console.log('Hola')
        const iteracion = await Iteracion.findById(id);
        console.log('Iteracion: ',iteracion);
        if(!iteracion) 
            return res.json(400, {
                error: 1,
                msg: "La iteración no existe en la BBDD"
            });
        
        const cursoId = iteracion.curso;
        console.log('Curso: ', cursoId);
        const curso = await Curso.findById(cursoId);
        const rubrica = await Rubrica.findById(curso.rubrica);
        const criterios = rubrica.criterios;

        console.log('Criterios de Rubrica', criterios);

        let valores = [];

        for(let i=0; i<criterios.length; i++){
            let c = await Criterio.findById(criterios[i].criterio);
            let e = await Escala.find({criterio: c});

            valores.push(
                {
                    criterio: c,
                    escala: e
                }
            )
        }

        console.log('Valoresssssssssss :',valores);

        res.json({
            ok: true,
            msg: 'Request getCriterio successful',
            valores
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error al obtener los valores'
        });
    }
}

criterioCtrl.getCriterio = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const hasta = req.query.hasta || '';
    let registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const texto = req.query.texto;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    if (hasta === 'todos') {
        registropp = 1000;
    }
    //await sleep(2000);
    try {
        let criterios, total;
        if (id) {
            [criterios, total] = await Promise.all([
                Criterio.findById(id),
                Criterio.countDocuments()
            ]);
        } else {
            if (texto) {
                [criterios, total] = await Promise.all([
                    Criterio.find({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] }).skip(desde).limit(registropp),
                    Criterio.countDocuments({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] })
                ]);
            } else {
                [criterios, total] = await Promise.all([
                    Criterio.find({}).skip(desde).limit(registropp),
                    Criterio.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'Request getCriterio successful',
            criterios,
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

/*
post / 
<-- nombre (unico), proyecto?, descripcion?
--> criterio registrado
*/
criterioCtrl.createCriterio = async(req, res = response) => {

    const { nombre } = req.body;

    try {
        // Solo el administrador puede hacer esta acción
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear criterios',
            });
        }

        const existeCriterio = await Criterio.findOne({ nombre });

        if (existeCriterio) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe un criterio con el mismo nombre'
            });
        }

        const criterio = new Criterio(req.body);

        // Almacenar en BD
        await criterio.save();

        res.json({
            ok: true,
            msg: 'Request createCriteria successful',
            criterio,
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando criterio'
        });
    }
}

criterioCtrl.updateCriterio = async(req, res = response) => {

    const { nombre } = req.body;
    const uid = req.params.id;

    try {
        // Solo el administrador puede hacer esta acción
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para actualizar criterios',
            });
        }
        // Comrprobar que no existe un criterio con el uid registrado
        const existeCriterio = await Criterio.findById(uid);

        if (!existeCriterio) {
            return res.status(400).json({
                ok: false,
                msg: 'El criterio no existe'
            });
        }

        // Comrprobar que no existe un criterio con el mismo nombre registrado
        const existeCriterion = await Criterio.findOne({ nombre });

        if (existeCriterion && (existeCriterion._id != uid)) {
            return res.status(400).json({
                ok: false,
                msg: 'No se puede cambiar el nombre del criterio porque ya existe un criterio con el mismo nombre'
            });
        }

        const criterio = await Criterio.findByIdAndUpdate(uid, req.body, { new: true });
        res.json({
            ok: true,
            msg: 'Criterio actualizado correctamente',
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

criterioCtrl.deleteCriterio = async(req, res = response) => {

    const uid = req.params.id;

    try {
        // Solo el administrador puede hacer esta acción
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para eliminar criterios',
            });
        }

        // Comprobamos si existe el usuario que queremos borrar
        const existeCriterio = await Criterio.findById(uid);
        if (!existeCriterio) {
            return res.status(400).json({
                ok: true,
                msg: 'El criterio no existe'
            });
        }
        // Lo eliminamos y devolvemos el criterio recien eliminado
        const resultado = await Criterio.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'Criterio eliminado',
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

criterioCtrl.updateList = async(req, res) => {

    const id = req.params.id;
    const lista = req.body.lista;

    // Solo puede crear usuarios un admin
    const token = req.header('x-token');
    // lo puede actualizar un administrador o el propio usuario del token
    if (!(infoToken(token).rol === 'ROL_ADMIN')) {
        return res.json({
            ok: false,
            msg: 'No tiene permisos para modificar lista de profesores/alumnos de asignatura',
        });
    }

    // Antes de insertar, limpiamos la lista de posibles duplicados o no existentes
    let listaInsertar = [];
    try {
        const criterio = await Criterio.findByIdAndUpdate(id, objeto, { new: true });
        res.json({
            ok: true,
            msg: `Criterio - Actualizar lista de alumno`,
            criterio
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: `Error al actualizar listas de criterios`
        });
    }
}

module.exports = { criterioCtrl }