const { response } = require('express');
const { infoToken } = require('../helpers/infotoken');
const Criterio = require('../models/criterios.model');
const Curso = require('../models/cursos.model');
const criterioCtrl = {};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
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

module.exports = { criterioCtrl }