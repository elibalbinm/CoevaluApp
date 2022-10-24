/*
Ruta base: /api/asignaturas
*/

const { Router } = require('express');
const { courseCtrl } = require('../controllers/asignaturas.controller');
const { check } = require('express-validator');
const Usuario      = require('../models/usuarios.model');
const Iteracion     = require('../models/iteraciones.model');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
  /*  "/api/evaluaciones"
   *    GET: finds all evaluaciones
   *    POST: creates a new evaluacion
   *    PUT: modify a evaluacion
   *    DELETE: 
   */

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('iditeracion', 'El id de la iteración debe ser válido').optional().isMongoId(),
    check('idalumno', 'El id del alumno debe ser un id válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto de búsqueda debe ser un texto').optional().trim(),
    // check('curso', 'El curso debe ser un identificador de curso válido').optional().isMongoId(),
    validarCampos,
], courseCtrl.obtenerAsignaturas);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Opcionales lista de profesores, si viene comprobar que es id válido
    check('iteracion.*.iteracion', 'El identificador de Iteración no es válido').optional().isMongoId(),
    check('alumno.*.usuario', 'El identificador de Alumno no es válido').optional().isMongoId(),
    validarCampos,
], courseCtrl.crearAsignatura);
router.put('/lista/:id', [
    validarJWT,
    check('id', 'El id de asignatura debe ser válido').isMongoId(),
    check('tipo', 'El argumento tipo es obligatorio (alumnos, profesores)').not().isEmpty().trim(),
    validarCampos,
], courseCtrl.actualizarLista);
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Opcionales lista de profesores, si viene comprobar que es id válido
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos,
], courseCtrl.actualizarAsignatura);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], courseCtrl.borrarAsignatura);

module.exports = router;