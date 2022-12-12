const { response }  =   require('express');
const { infoToken } =   require('../helpers/infotoken');
const Rubrica       =   require('../models/rubricas.model');
const Curso         =   require('../models/cursos.model');
const Criterio      =   require('../models/criterios.model');

const rubricCtrl = {};

rubricCtrl.totalRubricas = async(req, res) => {
    
    try {
        const total = await Rubrica.estimatedDocumentCount((err, numOfDocs) => {
            if(err) throw(err);
    
            console.log(`Total registros: ${numOfDocs}.`);

            res.json({
                ok: true,
                msg: 'Número de rúbricas registradas en la BBDD',
                numOfDocs
            });

        });
        
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error al contabilizar el número de Usuarios registrados.',
        });
    }
}

rubricCtrl.getRubrics = async(req, res = repsonse) => {

    // Paginación
    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const id = req.query.id;
    const textos = req.query.texto || '';
    const curso = req.query.curso || '';
    
    //await sleep(2000);
    try {
        let rubricas, criterios, total;
        if (id) {
            [rubricas, total] = await Promise.all([
                Rubrica.findById(id).populate('curso', '-__v'),
                Rubrica.findById(id).populate( 
                    {path: 'criterios',
                    // Get friends of friends - populate the 'friends' array for every friend
                    populate: { path: 'criterio', model: Criterio }
                    }),
                Rubrica.countDocuments()
            ]);
        } else {
            console.log('Entra al else')
            // {curso:'', {$or: {nombre : '', nombrecorto:''}}
            let query = {};
            if (textos !== '') {
                texto = new RegExp(textos, 'i');
                if (curso !== '') {
                    query = { curso: curso, $or: [{ texto: texto }] };
                } else {
                    query = { $or: [{ texto: texto }] };
                }
            } else {
                if (curso !== '') {
                    query = { curso: curso };
                } else {
                    query = {};
                }
            };

            // console.log('Almaceno rubricas')
            [rubricas, total] = await Promise.all([
                Rubrica.find(query).skip(desde).limit(registropp).populate( 
                    {path: 'criterios',
                    // Get friends of friends - populate the 'friends' array for every friend
                    populate: { path: 'criterio', model: Criterio }
                    }).populate('curso'),
                Rubrica.countDocuments(query)
            ]);
            
        }
        res.json({
            ok: true,
            msg: 'Request getRubrics successful',
            rubricas,
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
            msg: 'Error getting rubrics'
        });
    }
}


rubricCtrl.createRubric = async(req, res = response) => {

    const { texto, criterios, curso } = req.body;
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

    const { texto, criterios, curso } = req.body;
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

rubricCtrl.updateList = async(req, res) => {

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
        const criterios = await Criterio.find({ _id: { $in: lista } }, { _id: 0, 'criterio': '$_id' });
        const objeto = { criterios: criterios };
        const grupo = await Grupo.findByIdAndUpdate(id, objeto, { new: true });
        res.json({
            ok: true,
            msg: `Actualizar lista de criterios`,
            grupo
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: `Error al actualizar la lista de criterios de una rúbrica`
        });
    }
}

module.exports = { rubricCtrl }