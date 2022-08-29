/*
Ruta base: /api/cursos
*/

const { Router } = require('express');
const { courseCtrl } = require('../controllers/cursos.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del curso debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto debe ser válido').optional().trim(),
    validarCampos
], courseCtrl.getCourse);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('porcentaje', 'El porcentaje debe ser un número').not().isEmpty().isNumeric(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    validarCampos,
], courseCtrl.createCourse);
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('porcentaje', 'El porcentaje debe ser un número').not().isEmpty().isNumeric(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], courseCtrl.updateCourse);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], courseCtrl.deleteCourse);

module.exports = router;