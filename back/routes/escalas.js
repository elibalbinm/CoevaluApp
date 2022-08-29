/*
Ruta base: /api/escalas
*/

const { Router } = require('express');
const { obtenerEscalas, crearEscala, actualizarEscala, borrarEscala } = require('../controllers/escalas.controller');
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
], obtenerEscalas);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    validarCampos,
], crearEscala);
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('nombrecorto', 'El argumento nombrecorto es obligatorio').not().isEmpty().trim(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], actualizarEscala);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], borrarEscala);

module.exports = router;