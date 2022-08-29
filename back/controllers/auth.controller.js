const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuarios.model');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

const token = async(req, res = response) => {

    const token = req.headers['x-token'];

    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no válido',
                token: ''
            });
        }
        const rolBD = usuarioBD.rol;

        const nuevoToken = await generarJWT(uid, rol);

        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            nombre: usuarioBD.nombre,
            apellidos: usuarioBD.apellidos,
            email: usuarioBD.email,
            rol: rolBD,
            alta: usuarioBD.alta,
            activo: usuarioBD.activo,
            imagen: usuarioBD.imagen,
            token: nuevoToken
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no válido',

            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password } = req.body;
    console.log(password)

    try {

        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto/no encontrado en la BBDD',
                token: ''
            });
        }
        console.log(usuarioBD.password);
        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        console.log(validPassword)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta',
                token: ''
            });
        }

        const { _id, rol } = usuarioBD;
        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: 'login',
            uid: _id,
            rol,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error en login',
            token: ''
        });
    }

}

module.exports = { login, token }