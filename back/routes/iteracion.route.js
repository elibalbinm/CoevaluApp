/*
Ruta base: /api/iteraciones
*/

const { Router } = require('express');
const { check }  = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { iterationCtrl } = require('../controllers/iteracion.controller');
const { validarJWT }    = require('../middleware/validar-jwt');

const router = Router();

router.get('/total', iterationCtrl.totalIteraciones);

router.get('/lista', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del iteracion debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto debe ser válido').optional().trim(),
    validarCampos
], iterationCtrl.listaIteraciones);

router.get('/', [
    validarJWT,
    // Campos opcionales que si vienen los validamos desde e id
    check('id', 'El id del iteracion debe ser válido').optional().isMongoId(),
    check('desde', 'El desde debe ser un número').optional().isNumeric(),
    check('texto', 'El texto debe ser válido').optional().trim(),
    validarCampos
], iterationCtrl.getIterations);

router.get('/:id', [
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarJWT
], iterationCtrl.getIteration);

router.post('/', [
    validarJWT,
    check('curso', 'El id del curso debe ser válido').isMongoId(),
    check('rubrica', 'El id del curso debe ser válido').isMongoId(),
    check('iteracion', 'El argumento iteracion es obligatorio y deber ser un número').isNumeric(),
    check('hito', 'El argumento hito es obligatorio y deber ser un número').isNumeric(),
    check('fecha_ini', 'El formato de fecha_ini no es correcto').isDate(),
    check('fecha_fin', 'El formato de fecha_fin no es correcto').isDate(),
    check('fecha_ini_coe', 'El formato de fecha_ini_coe no es correcto').isDate(),
    check('fecha_fin_coe', 'El formato de fecha_fin_coe no es correcto').isDate(),
    validarCampos,
], iterationCtrl.createIteration);
router.put('/:id', [
    validarJWT,
    check('curso', 'El id del curso debe ser válido').optional().isMongoId(),
    check('rubrica', 'El id del curso debe ser válido').optional().isMongoId(),
    check('iteracion', 'El argumento iteracion es obligatorio y deber ser un número').optional().isNumeric(),
    check('hito', 'El argumento hito es obligatorio y deber ser un número').optional().isNumeric(),
    check('fecha_ini', 'El formato de fecha_ini no es correcto').optional().isDate(),
    check('fecha_fin', 'El formato de fecha_fin no es correcto').optional().isDate(),
    check('fecha_ini_coe', 'El formato de fecha_ini_coe no es correcto').optional().isDate(),
    check('fecha_fin_coe', 'El formato de fecha_fin_coe no es correcto').optional().isDate(),
    validarCampos,
], iterationCtrl.updateIteration);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
], iterationCtrl.deleteIteration);

module.exports = router;