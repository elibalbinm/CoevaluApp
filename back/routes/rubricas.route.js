/*
Ruta base: /api/rubricas
*/

const { Router }     = require('express');
const { rubricCtrl } = require('../controllers/rubricas.controller');
const { check }      = require('express-validator');
const { validarCampos }  = require('../middleware/validar-campos');
const { validarJWT }     = require('../middleware/validar-jwt');

const router = Router();

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del Rubrica debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto debe ser válido').optional().trim(),
    validarCampos
], rubricCtrl.getRubrics);
router.post('/', [
    validarJWT,
    check('texto', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El identificador del curso no es válido').isMongoId(),
    check('criterios.*.criterio', 'El identificador de alumno no es válido').isMongoId(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    validarCampos,
], rubricCtrl.createRubric);
router.put('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    check('texto', 'El argumento nombre es obligatorio').not().isEmpty().trim(),
    check('curso', 'El identificador del curso no es válido').isMongoId(),
    check('criterios.*.criterio', 'El identificador de alumno no es válido').isMongoId(),
    check('activo', 'El argumento activo es obligatorio y debe ser true/false').isBoolean(),
    validarCampos,
], rubricCtrl.updateRubric);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], rubricCtrl.deleteRubric);

module.exports = router;