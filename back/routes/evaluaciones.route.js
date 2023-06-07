/*
Ruta base: /api/asignaturas
*/

const { Router } = require('express');
const { evaluationCtrl } = require('../controllers/evaluaciones.controller');
const { check } = require('express-validator');
const Usuario      = require('../models/usuarios.model');
const Iteracion     = require('../models/iteraciones.model');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

  /*  "/api/evaluaciones"
   *    GET: finds all evaluaciones
   *    POST: creates a new evaluacion
   *    PUT: modify a evaluacion
   *    DELETE: 
   */

router.get('/total', evaluationCtrl.totalEvaluaciones);

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('iditeracion', 'El id de la iteración debe ser válido').optional().isMongoId(),
    check('idalumno', 'El id del alumno debe ser un id válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto de búsqueda debe ser un texto').optional().trim(),
    // check('curso', 'El curso debe ser un identificador de curso válido').optional().isMongoId(),
    validarCampos,
], evaluationCtrl.getEvaluations);

// router.get('/:id', [
//     check('id', 'El identificador no es válido').isMongoId(),
//     validarCampos,
//     validarJWT
// ], evaluationCtrl.getEvaluation);

router.post('/', [
    validarJWT, 

    check('criterio', 'El criterio definido no existe en la BBDD').optional().isMongoId(),
    check('votaciones.*.valores.*.alumno_votado', 'El usuario definido no existe en la BBDD').optional().isMongoId(),
    check('votaciones.*.valores.*.escala', 'El criterio definido no existe en la BBDD').optional().isMongoId(),
    check('votaciones.*.valores.*.valor', 'El criterio definido no existe en la BBDD').optional().isNumeric(),
    check('iteracion', 'El identificador de Iteración no es válido').optional().isMongoId(),
    check('alumno', 'El identificador de Alumno no es válido').optional().isMongoId(),
    check('fecha', 'El formato de la fecha definida no es correcto.').optional().isDate(),

    // check('votaciones.*.usuario', 'El usuario definido no existe en la BBDD').optional().isMongoId(),
    // check('votaciones.*.valores.*.criterio', 'El criterio definido no existe en la BBDD').optional().isMongoId(),
    // check('votaciones.*.valores.*.escala', 'El criterio definido no existe en la BBDD').optional().isMongoId(),
    // check('votaciones.*.valores.*.valor', 'El criterio definido no existe en la BBDD').optional().isNumeric(),
    // check('iteracion', 'El identificador de Iteración no es válido').optional().isNumeric(),
    // check('alumno', 'El identificador de Alumno no es válido').optional().isMongoId(),
    validarCampos,
], evaluationCtrl.createEvaluation);

router.put('/lista/:id', [
    validarJWT,
    check('id', 'El id de asignatura debe ser válido').isMongoId(),
    validarCampos,
], evaluationCtrl.updateList);

router.put('/:id', [
    validarJWT,
    check('criterio', 'El criterio definido no existe en la BBDD').optional().isMongoId(),
    check('votaciones.*.valores.*.alumno_votado', 'El usuario definido no existe en la BBDD').optional().isMongoId(),
    check('votaciones.*.valores.*.escala', 'El criterio definido no existe en la BBDD').optional().isMongoId(),
    check('votaciones.*.valores.*.valor', 'El criterio definido no existe en la BBDD').optional().isNumeric(),
    check('iteracion', 'El identificador de Iteración no es válido').optional().isMongoId(),
    check('alumno', 'El identificador de Alumno no es válido').optional().isMongoId(),
    validarCampos,
], evaluationCtrl.updateEvaluation);

router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], evaluationCtrl.deleteEvaluation);

// Nos devuelve la evaluación en concreto correspondiente con la del campo 'alumno' de esa 
router.get('/alumno/', [
    // Campos opcionales que si vienen los validamos desde e id
    validarJWT,
    check('id', 'El id del alumno debe ser válido').optional().isMongoId(),
    check('iteracion', 'El id de la iteración debe ser válido').optional().isMongoId(),
    validarCampos
], evaluationCtrl.getEvaluationsByStudent);

module.exports = router;