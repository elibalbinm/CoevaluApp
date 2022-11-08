/*
Ruta base: /api/criterios
*/

const { Router } = require('express');
const { criterioCtrl } = require('../controllers/criterios.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del criterio debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto de búsqueda debe ser un texto').optional().trim(),
    validarCampos,
], criterioCtrl.getCriterio);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripcion es obligatorio').not().isEmpty().trim(),
    check('activo', 'El estado activo debe ser true/false').optional().isBoolean(),
    validarCampos,
], criterioCtrl.createCriterio);
router.put('/lista/:id', [
    validarJWT,
    check('id', 'El id del criterio debe ser válido').isMongoId(),
    validarCampos,
], criterioCtrl.updateList);
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'El argumento descripcion es obligatorio').optional().not().isEmpty().trim(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').optional().isBoolean(),
    validarCampos,
], criterioCtrl.updateCriterio);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], criterioCtrl.deleteCriterio);

module.exports = router;