const { response, request } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async(req = request, res = response) => {
    
    const {correo, password} = req.body;

    try {

        // verificar si el email existe
        const existeUsuario = await Usuario.findOne({correo});

        if(!existeUsuario){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        // si el usuario esta activo
        if(!existeUsuario.estado){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: falso'
            })
        }

        // verificar la contrase;a
        const passwordValido = bcryptjs.compareSync(password, existeUsuario.password);
        if(!passwordValido){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //generar el JWT
        const token = await generarJWT(existeUsuario.id);


        res.json({
            msg: 'authPost - login ok',
            existeUsuario,
            token
        });

    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal. Hable con el administrador'
        })
    }

}

module.exports = {
    login
}