/*
Ruta base: /api/escalas
*/

const { Router } = require('express');
const { scaleCtrl } = require('../controllers/escalas.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del escala debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto debe ser válido').optional().trim(),
    validarCampos
], scaleCtrl.getScales);
router.post('/', [
    validarJWT,
    check('nivel', 'El argumento nivel es obligatorio').not().isEmpty().trim(),
    check('descripcion', 'El argumento descripción es obligatorio').not().isEmpty(),
    check('criterio', 'El argumento criterio no es válido').isMongoId(),
    check('valor', 'El argumento valor debe ser un número').isNumeric(),
    validarCampos,
], scaleCtrl.createScale);
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('nivel', 'El argumento nivel es obligatorio').optional().trim(),
    check('descripcion', 'El argumento descripción es obligatorio').optional().trim(),
    check('valor', 'El argumento valor debe ser un número').optional().isNumeric(),
    validarCampos,
], scaleCtrl.updateScale);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], scaleCtrl.deleteScale);

module.exports = router;