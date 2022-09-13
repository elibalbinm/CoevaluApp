const { response }  =   require('express');
const { infoToken } =   require('../helpers/infotoken');
const Rubrica       =   require('../models/rubricas.model');
const Curso         =   require('../models/cursos.model');
const Criterio      =   require('../models/criterios.model');

const rubricCtrl = {};

rubricCtrl.getRubrics = async(req, res = repsonse) => {

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
        let rubricas, total;
        if (id) {
            [rubricas, total] = await Promise.all([
                Rubrica.findById(id),
                Rubrica.countDocuments()
            ]);
        } else {
            if (texto) {
                [rubricas, total] = await Promise.all([
                    Rubrica.find({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] }).skip(desde).limit(registropp),
                    Rubrica.countDocuments({ $or: [{ nombre: textoBusqueda }, { descripcion: textoBusqueda }] })
                ]);
            } else {
                [rubricas, total] = await Promise.all([
                    Rubrica.find({}).skip(desde).limit(registropp),
                    Rubrica.countDocuments()
                ]);
            }
        }
        res.json({
            ok: true,
            msg: 'Request getRubrics successful',
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
            msg: 'Error getting rubrics'
        });
    }
}


rubricCtrl.createRubric = async(req, res = response) => {

    const { curso, criterios } = req.body;
    console.log(curso);
    console.log(criterios);

    try {
        // Solo el administrador puede hacer esta acción
        const token = req.header('x-token');
        if (!(infoToken(token).rol === 'ROL_ADMIN')) {
            return res.status(400).json({
                ok: false,
                msg: 'No tiene permisos para crear rubricas',
            });
        }

        const existeCurso = await Curso.findById(curso);
        // const existeCriterio = await Criterio.findOne({ criterios });

        //Comprobamos que el curso y el criterio que se va a asignar a la rubrica existe
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado a la rúbrica no existe'
            });
        }

         // Comprobamos la lista de alumnos que nos envían que existan
         let insertCriteria = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y limpiar campos raros
        if (criterios) {
            console.log(criterios);
            let searchCriteria = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = criterios.map(value => {
                console.log(value);
                if (value.criterio) {
                    searchCriteria.push(value.criterio);
                    insertCriteria.push(value);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenCriterios = await Criterio.find().where('_id').in(searchCriteria);
            if (existenCriterios.length != searchCriteria.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el grupo no existe o están repetidos'
                });
            }
        }


        const rubrica = new Rubrica(req.body);
        rubrica.criterios = insertCriteria;

        // Almacenar en BD
        await rubrica.save();

        res.json({
            ok: true,
            msg: 'Request createRubric successful',
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

rubricCtrl.updateRubric = async(req, res) => {

    const { curso, criterios } = req.body;
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
        const existeCurso = await Curso.findById(curso);
        // const existeCriterio = await Criterio.findOne({ criterios });

        //Comprobamos que el curso y el criterio que se va a asignar a la rubrica existe
        if (!existeCurso) {
            return res.status(400).json({
                ok: false,
                msg: 'El curso asignado a la rúbrica no existe'
            });
        }

         // Comprobamos la lista de alumnos que nos envían que existan
         let insertCriteria = [];
        // Si nos ha llegado lista de alumnos comprobar que existen y limpiar campos raros
        if (criterios) {
            console.log(criterios);
            let searchCriteria = [];
            // Convertimos el array de objetos en un array con los strings de id de usuario
            // Creamos un array de objetos pero solo con aquellos que tienen el campo usuario correcto
            const listaalu = criterios.map(value => {
                console.log(value);
                if (value.criterio) {
                    searchCriteria.push(value.criterio);
                    insertCriteria.push(value);
                }
            });
            // Comprobamos que los alumnos que nos pasan existen, buscamos todos los alumnos de la lista
            const existenCriterios = await Criterio.find().where('_id').in(searchCriteria);
            if (existenCriterios.length != searchCriteria.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Alguno de los alumnos indicados en el grupo no existe o están repetidos'
                });
            }
        }

        // Creamos el value para insertar pero con la lista de alumnos comprobados
        let object = req.body;
        object.criterios = insertCriteria;

        const rubrica = await Rubrica.findByIdAndUpdate(uid, object, { new: true });
        res.json({
            ok: true,
            msg: 'Rúbrica actualizada',
            rubrica
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando rúbrica'
        });
    }
}

rubricCtrl.deleteRubric = async(req, res = response) => {

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

module.exports = { rubricCtrl }