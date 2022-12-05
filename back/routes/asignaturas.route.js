/*
Ruta base: /api/asignaturas
*/

const { Router } = require('express');
const { subjectCtrl } = require('../controllers/asignaturas.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
  /*  "/api/asignaturas"
   *    GET: finds all asignaturas
   *    POST: creates a new asignatura
   *    PUT: 
   *    DELETE:
   */

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del asignatura debe ser válido').optional().isMongoId(),
    check('idprof', 'El id del profesor debe ser un id válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto de búsqueda debe ser un texto').optional().trim(),
    check('curso', 'El curso debe ser un identificador de curso válido').optional().isMongoId(),
    validarCampos,
], subjectCtrl.obtenerAsignaturas);

router.get('/totalCursos', subjectCtrl.totalCursos);
router.get('/total', subjectCtrl.totalAsignaturas);

router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Opcionales lista de profesores, si viene comprobar que es id válido
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos,
], subjectCtrl.crearAsignatura);
router.put('/lista/:id', [
    validarJWT,
    check('id', 'El id de asignatura debe ser válido').isMongoId(),
    check('tipo', 'El argumento tipo es obligatorio (alumnos, profesores)').not().isEmpty().trim(),
    validarCampos,
], subjectCtrl.actualizarLista);
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty(),
    check('curso', 'El argumento curso no es válido').isMongoId(),
    // Opcionales lista de profesores, si viene comprobar que es id válido
    check('profesores.*.usuario', 'El identificador de profesor no es válido').optional().isMongoId(),
    validarCampos,
], subjectCtrl.actualizarAsignatura);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], subjectCtrl.borrarAsignatura);

module.exports = router;